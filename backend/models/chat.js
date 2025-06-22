const socket = io("http://localhost:3000"); // use your live URL when deploying
let currentUser = "USER_ID"; // Replace with your logged-in user ID
let currentConversationId = null;

// Load inbox
fetch(`/api/dm/conversations/${currentUser}`)
  .then((res) => res.json())
  .then((conversations) => {
    const inbox = document.getElementById("inbox");
    conversations.forEach((conv) => {
      const el = document.createElement("div");
      el.textContent = `Chat with ${conv.participants.join(", ")}`;
      el.classList.add("chat-preview");
      el.onclick = () => openChat(conv._id);
      inbox.appendChild(el);
    });
  });

function openChat(conversationId) {
  currentConversationId = conversationId;
  document.getElementById("chatWindow").classList.remove("hidden");
  document.getElementById("messages").innerHTML = "";

  socket.emit("joinRoom", conversationId);

  fetch(`/api/dm/message/${conversationId}`)
    .then((res) => res.json())
    .then((messages) => {
      messages.forEach((msg) => {
        addMessageToUI(msg);
      });
    });
}

function addMessageToUI(msg) {
  const msgDiv = document.createElement("div");
  msgDiv.textContent = `${msg.sender}: ${msg.text}`;
  document.getElementById("messages").appendChild(msgDiv);
}

// Send message
document.getElementById("messageForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = document.getElementById("messageInput").value;

  const message = {
    conversationId: currentConversationId,
    sender: currentUser,
    text,
  };

  await fetch("/api/dm/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  socket.emit("sendMessage", message);
  addMessageToUI(message);
  document.getElementById("messageInput").value = "";
});

socket.on("receiveMessage", (data) => {
  if (data.conversationId === currentConversationId) {
    addMessageToUI(data);
  }
});
