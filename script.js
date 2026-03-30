// SIDEBAR FUNCTIONS
function openNav() {
    document.getElementById("sideNav").style.width = "280px";
}

function closeNav() {
    document.getElementById("sideNav").style.width = "0";
}

// CHATBOT FUNCTIONS
function toggleChat() {
    const chat = document.getElementById("chatWindow");
    if (chat.style.display === "block") {
        chat.style.display = "none";
    } else {
        chat.style.display = "block";
    }
}

function sendMessage() {
    const input = document.getElementById("userInput");
    const body = document.getElementById("chatBody");
    const msg = input.value.trim();

    if (msg === "") return;

    // User message
    const userDiv = document.createElement("div");
    userDiv.className = "user-bubble";
    userDiv.textContent = msg;
    body.appendChild(userDiv);

    input.value = "";
    body.scrollTop = body.scrollHeight;

    // AI Simulated reply
    setTimeout(() => {
        const aiDiv = document.createElement("div");
        aiDiv.className = "ai-bubble";
        aiDiv.textContent = "Thank you! An advisor will review your message shortly.";
        body.appendChild(aiDiv);
        body.scrollTop = body.scrollHeight;
    }, 800);
}

function handleEnter(e) {
    if (e.key === "Enter") sendMessage();
}