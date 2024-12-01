const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

function appendMessage(content, className) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = content;
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendMessage() {
    const userMessage = userInput.value.trim();

    if (!userMessage) return;

    // Append user's message
    appendMessage(userMessage, "user-message");

    // Clear the input field
    userInput.value = "";

    try {
        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();
        if (data.response) {
            // Display the bot's response
            appendMessage(data.response, "bot-message");
        } else {
            appendMessage("No response from bot.", "bot-message");
        }
    } catch (error) {
        appendMessage("Error communicating with bot.", "bot-message");
        console.error("Error:", error);
    }
}

// Event listener for the "Send" button
sendBtn.addEventListener("click", sendMessage);

// Event listener for pressing "Enter" key
userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
        event.preventDefault(); // Prevent any unwanted behavior like form submission
    }
});
