const socket = io('https://tcgpocketmarket.onrender.com'); // Connect to the WebSocket server

let currentUser = "Ash"; // Replace with logged-in user
let recipientUser = ""; // Dynamically set when validated

// Validate the recipient's username
document.getElementById('validateRecipient').addEventListener('click', () => {
  const usernameInput = document.getElementById('recipientUsername').value.trim();
  const validationMessage = document.getElementById('validationMessage');

  if (!usernameInput) {
    validationMessage.textContent = "Please enter a username.";
    return;
  }

  fetch(`/validate-username?username=${usernameInput}`)
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

    socket.emit("sendMessage", message); // Send message to the server

    // Add the message to the chat window
    const chatWindow = document.getElementById("chatWindow");
    const messageElement = document.createElement("div");
    messageElement.textContent = `You: ${content}`;
    chatWindow.appendChild(messageElement);

    messageInput.value = ""; // Clear the input field
  }
});

// Listen for incoming messages
socket.on("receiveMessage", (message) => {
  if (
    (message.sender === recipientUser && message.recipient === currentUser) ||
    (message.sender === currentUser && message.recipient === recipientUser)
  ) {
    const chatWindow = document.getElementById("chatWindow");
    const messageElement = document.createElement("div");
    messageElement.textContent = `${message.sender}: ${message.content}`;
    chatWindow.appendChild(messageElement);
  }
});
