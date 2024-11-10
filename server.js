const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
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
  password: { type: String, required: true}
});
const User = mongoose.model('User', userSchema);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//Register a new user
app.post('/register', async (req, res) => {
  console.log(req.body);
  try{   
    const { username, password } = req.body;

    //Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
 
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
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

    res.json({message: 'Login successful', redirect: '/home.html'});
  } catch(error) {
    res.status(500).json({ message: "Error logging in", error});
  }
});


//Serve Registration form
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

//Serve the homepage
app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
