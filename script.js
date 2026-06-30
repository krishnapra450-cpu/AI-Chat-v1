const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

const API_URL = "https://ai-chat-backend-zhqr.onrender.com/chat";

let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

// पुरानी चैट दिखाओ
window.onload = () => {
    chatHistory.forEach(chat => {
        if (chat.type === "user") {
            chatBox.innerHTML += `<div class="user-message">${chat.text}</div>`;
        } else {
            chatBox.innerHTML += `<div class="bot-message">${chat.text}</div>`;
        }
    });

    chatBox.scrollTop = chatBox.scrollHeight;
};

async function sendMessage() {
    const message = userInput.value.trim();

    if (message === "") return;

    // User Message
    chatHistory.push({
        type: "user",
        text: message
    });

    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

    chatBox.innerHTML += `
        <div class="user-message">${message}</div>
    `;

    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Typing...
    const typingDiv = document.createElement("div");
    typingDiv.className = "bot-message";
    typingDiv.innerText = "🤖 Typing...";
    chatBox.appendChild(typingDiv);

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

        typingDiv.remove();

        chatHistory.push({
            type: "bot",
            text: data.reply
        });

        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

        chatBox.innerHTML += `
            <div class="bot-message">${data.reply}</div>
        `;

    } catch (error) {

        typingDiv.remove();

        chatBox.innerHTML += `
            <div class="bot-message">
                ❌ Server se connect nahi ho paaya.
            </div>
        `;

        console.error(error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

userInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
