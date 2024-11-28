const socket = io('https://tcgpocketmarket.onrender.com'); // Connect to the WebSocket server

// Log connection success or failure
socket.on('connect', () => {
  console.log('Connected to WebSocket server with ID:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('WebSocket connection error:', err);
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

let currentUser = sessionStorage.getItem("username") || "DefaultUser"; // Replace with real logic
let recipientUser = ""; // Dynamically set when validated

// Validate the recipient's username
document.getElementById('validateRecipient').addEventListener('click', () => {
  const usernameInput = document.getElementById('recipientUsername').value.trim();
  const validationMessage = document.getElementById('validationMessage');

  if (!usernameInput) {
    validationMessage.textContent = "Please enter a username.";
    return;
  }

  fetch(`https://tcgpocketmarket.onrender.com/validate-username?username=${usernameInput}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.exists) {
        validationMessage.style.color = "green";
        validationMessage.textContent = `User "${usernameInput}" is valid.`;
        recipientUser = usernameInput; // Set the recipient
      } else {
        validationMessage.style.color = "red";
        validationMessage.textContent = `No user found with the username "${usernameInput}".`;
        recipientUser = ""; // Reset recipient
      }
    })
    .catch((err) => {
      console.error("Error validating username:", err);
      validationMessage.textContent = "An error occurred. Please try again.";
    });
});

// Load message threads for the current user
function loadThreads() {
  fetch(`https://tcgpocketmarket.onrender.com/threads?username=${currentUser}`)
    .then((res) => res.json())
    .then((threads) => {
      const messagesList = document.getElementById("messages");
      messagesList.innerHTML = ""; // Clear existing threads

      threads.forEach((thread) => {
        const threadItem = document.createElement("li");
        threadItem.textContent = `${thread.username} - ${thread.lastMessage}`;
        threadItem.className = "thread-item";
        threadItem.addEventListener("click", () => {
          loadConversation(thread.username); // Load conversation when clicked
        });

        messagesList.appendChild(threadItem);
      });
    })
    .catch((err) => console.error("Error loading threads:", err));
}

// Load conversation log between the current user and the selected recipient
function loadConversation(participant) {
  fetch(
    `https://tcgpocketmarket.onrender.com/conversation?user1=${currentUser}&user2=${participant}`
  )
    .then((res) => res.json())
    .then((messages) => {
      const chatWindow = document.getElementById("chatWindow");
      chatWindow.innerHTML = ""; // Clear the chat window

      messages.forEach((message) => {
        const messageElement = document.createElement("div");
        messageElement.textContent = `${message.sender}: ${message.content}`;
        chatWindow.appendChild(messageElement);
      });

      recipientUser = participant; // Set the recipient for sending new messages
    })
    .catch((err) => console.error("Error loading conversation:", err));
}

// Send a message
document.getElementById("sendMessage").addEventListener("click", () => {
  const messageInput = document.getElementById("messageInput");
  const content = messageInput.value.trim();

  if (!recipientUser) {
    alert("Please validate a recipient username before sending a message.");
    return;
  }

  if (content) {
    const message = {
      sender: currentUser,
      recipient: recipientUser,
      content,
    };

    console.log("Sending message:", message); // Log the message being sent
    socket.emit("sendMessage", message); // Send message to the server

    // Add the message to the chat window locally
    const chatWindow = document.getElementById("chatWindow");
    const messageElement = document.createElement("div");
    messageElement.textContent = `You: ${content}`;
    chatWindow.appendChild(messageElement);

    messageInput.value = ""; // Clear the input field
  }
});

// Listen for incoming messages
socket.on("receiveMessage", (message) => {
  console.log("Received message:", message);

  // Refresh threads
  loadThreads();

  // Update the chat window if the current thread matches
  if (message.sender === recipientUser || message.recipient === recipientUser) {
    const chatWindow = document.getElementById("chatWindow");
    const messageElement = document.createElement("div");
    messageElement.textContent = `${message.sender}: ${message.content}`;
    chatWindow.appendChild(messageElement);
  }
});

// Load threads on page load
window.onload = () => {
  loadThreads();
};
