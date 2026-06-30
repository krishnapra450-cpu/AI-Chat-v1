const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

const API_URL = "https://ai-chat-backend-zhqr.onrender.com/chat";

// सभी Chats
let chats = JSON.parse(localStorage.getItem("allChats")) || [];

// वर्तमान Chat
let currentChat = 0;

// पहली बार वेबसाइट खुली
if (chats.length === 0) {
    chats.push({
        title: "Chat 1",
        messages: [
            {
                type: "bot",
                text: "👋 Hello! How can I assist you today?"
            }
        ]
    });

    localStorage.setItem("allChats", JSON.stringify(chats));
}
function saveChats() {
    localStorage.setItem("allChats", JSON.stringify(chats));
}

function renderChatList() {
    const chatList = document.getElementById("chat-list");
    chatList.innerHTML = "";

    chats.forEach((chat, index) => {
        const div = document.createElement("div");
        div.className = "chat-item" + (index === currentChat ? " active" : "");
        div.innerText = chat.title;

        div.onclick = () => {
            currentChat = index;
            renderChatList();
            renderMessages();
        };

        chatList.appendChild(div);
    });
}

function renderMessages() {
    chatBox.innerHTML = "";

    chats[currentChat].messages.forEach(msg => {
        chatBox.innerHTML += `
            <div class="${msg.type}-message">${msg.text}</div>
        `;
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

function newChat() {
    chats.push({
        title: "Chat " + (chats.length + 1),
        messages: [
            {
                type: "bot",
                text: "👋 Hello! How can I assist you today?"
            }
        ]
    });

    currentChat = chats.length - 1;

    saveChats();
    renderChatList();
    renderMessages();
}
async function sendMessage() {
    const message = userInput.value.trim();

    if (message === "") return;

    chats[currentChat].messages.push({
        type: "user",
        text: message
    });

    userInput.value = "";

    renderMessages();
    saveChats();

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        chats[currentChat].messages.push({
            type: "bot",
            text: data.reply
        });

        saveChats();
        renderMessages();

    } catch (error) {

        chats[currentChat].messages.push({
            type: "bot",
            text: "❌ Server se connect nahi ho paaya."
        });

        saveChats();
        renderMessages();

        console.error(error);
    }
}

userInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

window.onload = () => {
    renderChatList();
    renderMessages();

    const newChatBtn = document.querySelector(".new-chat");
    if (newChatBtn) {
        newChatBtn.onclick = newChat;
    }
};
