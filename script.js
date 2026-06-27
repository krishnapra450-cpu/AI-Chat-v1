
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

function sendMessage() {
    const text = userInput.value.trim();

    if (text === "") return;

    chatBox.innerHTML += `
        <div class="user-message">${text}</div>
    `;

    userInput.value = "";

    let reply = getReply(text);

    chatBox.innerHTML += `
        <div class="bot-message">🤖 ${reply}</div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;
}

function getReply(message) {
    message = message.toLowerCase();

    if (message.includes("hello") || message.includes("hi")) {
        return "Hello! 👋";
    }

    if (message.includes("how are you")) {
        return "I'm fine. 😊";
    }

    if (message.includes("name")) {
        return "My name is My AI Assistant 🤖";
    }

    if (message.includes("bye")) {
        return "Goodbye! 👋";
    }

    return "Sorry, I don't understand that yet.";
}

userInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});