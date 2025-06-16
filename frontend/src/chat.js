const socket = io(); 

const inbox = document.getElementById("inbox");
const chatWindow = document.getElementById("chatWindow");
const messagesDiv = document.getElementById("messages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

let currentUser = "USER_ID_FROM_LOGIN"; // Replace with real user ID
let currentConversationId = null;

// 1. Load conversations
fetch(`/api/dm/conversations/${currentUser}`, {
headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})
.then((res) => res.json())
.then((conversations) => {
    conversations.forEach((conv) => {
    const participant = conv.participants.find((p) => p._id !== currentUser);
    const div = document.createElement("div");
    div.className = "conversation";
    div.textContent = `Chat with ${participant?.username || "Unknown"}`;
    div.onclick = () => openChat(conv._id);
    inbox.appendChild(div);
    });
});

// 2. Open chat window and join socket room
function openChat(convoId) {
  currentConversationId = convoId;
  socket.emit("joinRoom", convoId);
  chatWindow.classList.remove("hidden");
  messagesDiv.innerHTML = "";

  fetch(`/api/dm/messages/${convoId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
    .then((res) => res.json())
    .then((msgs) => {
      msgs.forEach(displayMessage);
    });
}

// 3. Submit message
messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  const payload = {
    conversationId: currentConversationId,
    text,
    sender: currentUser,
  };

  // Send via HTTP
  await fetch("/api/dm/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  // Emit via socket
  socket.emit("sendMessage", payload);
  displayMessage(payload);
  messageInput.value = "";
});

// 4. Receive messages live
socket.on("receiveMessage", (data) => {
  if (data.conversationId === currentConversationId) {
    displayMessage(data);
  }
});

// 5. Display in DOM
function displayMessage(data) {
  const msg = document.createElement("div");
  msg.className = "chat-bubble";
  msg.textContent = data.text;
  messagesDiv.appendChild(msg);
}
