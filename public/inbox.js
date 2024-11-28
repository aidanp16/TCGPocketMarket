const socket = io(); // Connect to the WebSocket server

// Simulated current and recipient users (replace with dynamic logic)
const currentUser = "Ash"; // Replace with logged-in user
const recipientUser = "Misty"; // Replace dynamically

// Fetch messages between the current user and recipient
fetch(`/messages?user1=${currentUser}&user2=${recipientUser}`)
  .then((res) => res.json())
  .then((messages) => {
    const chatWindow = document.getElementById("chatWindow");
    messages.forEach((msg) => {
      const messageElement = document.createElement("div");
      messageElement.textContent = `${msg.sender}: ${msg.content}`;
      chatWindow.appendChild(messageElement);
    });
  });

// Send a new message
document.getElementById("sendMessage").addEventListener("click", () => {
  const messageInput = document.getElementById("messageInput");
  const content = messageInput.value.trim();

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
