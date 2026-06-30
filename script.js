const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

const API_URL = "https://ai-chat-backend-zhqr.onrender.com/chat";

// Chat History Load
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

function renderChat() {
    chatBox.innerHTML = "";

    if (chatHistory.length === 0) {
        chatBox.innerHTML = `
        <div class="bot-message">
            👋 Hello! How can I help you today?
        </div>`;
    }

    chatHistory.forEach(chat => {
        chatBox.innerHTML += `
        <div class="${chat.type}-message">
            ${chat.text}
        </div>`;
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

renderChat();

async function sendMessage() {

    const message = userInput.value.trim();

    if (!message) return;

    chatHistory.push({
        type: "user",
        text: message
    });

    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

    renderChat();

    userInput.value = "";

    chatBox.innerHTML += `
    <div class="bot-message" id="typing">
        🤖 Typing...
    </div>`;

    chatBox.scrollTop = chatBox.scrollHeight;

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

        document.getElementById("typing").remove();

        chatHistory.push({
            type: "bot",
            text: data.reply
        });

        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

        renderChat();

    } catch (err) {

        document.getElementById("typing").remove();

        chatHistory.push({
            type: "bot",
            text: "❌ Server Error"
        });

        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

        renderChat();

        console.log(err);
    }

}

userInput.addEventListener("keypress", function(e){
    if(e.key==="Enter"){
        sendMessage();
    }
});

// Chat Clear Function
function clearChat(){
    localStorage.removeItem("chatHistory");
    chatHistory = [];
    renderChat();
}
