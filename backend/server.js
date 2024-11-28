const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http'); // Required for Socket.IO integration
const { Server } = require('socket.io'); // Import Socket.IO

const app = express();
const server = http.createServer(app); // Create an HTTP server for Express
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity; restrict in production
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  console.log(`Received ${req.method} request on ${req.path}`);
  next();
});
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://aidanp_16:FigW5XXOzObUYFVS@tcgpocketcluster.jt9mx.mongodb.net/users?retryWrites=true&w=majority')
  .then(() => console.log('Database connected'))
  .catch((err) => console.error("Connection error", err));

// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now }, // for member since
  lastLogin: { type: Date },
  subscriptionType: { type: String, default: 'Free' }
});
const User = mongoose.model('User', userSchema);

// Message schema and model
const messageSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

// API endpoint to fetch messages between two users
app.get('/messages', async (req, res) => {
  const { user1, user2 } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort('timestamp');

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// API endpoint to check if a user exists by username
app.get('/validate-username', async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error('Error validating username:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// WebSocket handling
io.on('connection', (socket) => {
  console.log(`New WebSocket connection: ${socket.id}`);

  socket.on('sendMessage', async (data) => {
    const { sender, recipient, content } = data;

    try {
      // Check if the recipient exists
      const recipientUser = await User.findOne({ username: recipient });
      if (!recipientUser) {
        socket.emit('errorMessage', `User "${recipient}" does not exist.`);
        return;
      }

      // Save the message to the database
      const newMessage = new Message({ sender, recipient, content });
      await newMessage.save();

      // Notify the sender of successful delivery
      socket.emit('messageSent', { message: newMessage });

      // Broadcast the message to the recipient
      io.emit('receiveMessage', newMessage);
      console.log('Message sent:', newMessage);
    } catch (err) {
      console.error('Error saving message:', err);
      socket.emit('errorMessage', 'An error occurred while sending the message.');
    }
  });

  socket.on('disconnect', () => {
    console.log(`WebSocket disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = process.env.PORT || 3000; // Use Render's assigned port or default to 3000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Register a new user
app.post('/register', async (req, res) => {
  console.log(req.body);
  try{   
    const { username, password, email } = req.body;

    //Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
 
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully '});
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error});
  }
});



//Login a user
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    //Find the user by username
    const user = await User.findOne({ username });
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }

    //Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) { 
      return res.status(403).json({ message: 'Invalid password'});
    }

    res.json({message: 'Login successful', redirect: '/index.html', username: user.username });
  } catch(error) {
    res.status(500).json({ message: "Error logging in", error});
  }
});

// Update user profile
app.post('/update-profile', async (req, res) => {
  try {
    const { currentUsername, newUsername, email, phone, password } = req.body;

    // Find the user by the current username
    const user = await User.findOne({ username: currentUsername });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the new username already exists (and is different from the current one)
    if (newUsername !== currentUsername) {
      const existingUser = await User.findOne({ username: newUsername });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      user.username = newUsername; // Update username if unique
    }

    // Update other fields
    user.email = email || user.email;
    user.phone = phone || user.phone;

    // Update password if provided (hash the password before saving)
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Save updated user to the database
    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile', error });
  }
});


app.get('/get-profile', async (req, res) => {
  try {
      // Assume we have a way to identify the user, e.g., via a session or token
      const username = req.query.username; // Use req.query or a more secure method

      const user = await User.findOne({ username });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({
          username: user.username,
          email: user.email,
          phone: user.phone,
          memberSince: user.createdAt,  // assuming `createdAt` is available
          lastLogin: user.lastLogin,    // assuming `lastLogin` is stored
          subscriptionType: user.subscriptionType || 'Free' // assuming this field exists
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving profile data' });
  }
});


app.get('/status', (req,res) => {
  res.json({ message: 'Server is running'});
});

//Serve Registration form
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

//Serve the homepage
app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
