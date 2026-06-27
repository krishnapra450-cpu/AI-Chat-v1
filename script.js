const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

const API_URL = "https://ai-chat-backend-zhqr.onrender.com/chat";

async function sendMessage() {
    const message = userInput.value.trim();

    if (message === "") return;

    chatBox.innerHTML += `
        <div class="user-message">${message}</div>
    `;

    userInput.value = "";
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

        chatBox.innerHTML += `
            <div class="bot-message">${data.reply}</div>
        `;

    } catch (error) {
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
