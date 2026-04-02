document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById("loginModal");
    const loginTriggers = document.querySelectorAll(".login-trigger");
    const closeBtn = document.querySelector(".close-btn");

    // Бүх "Login" товчлуурууд дээр дарах үйлдлийг бүртгэх
    loginTriggers.forEach(trigger => {
        trigger.onclick = function(e) {
            e.preventDefault();
            if(modal) modal.style.display = "block";
        };
    });
   if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        };
    }
});
    // --- SIDEBAR FUNCTIONS ---
    window.openNav = function() {
        document.getElementById("sideNav").style.width = "280px";
    }

    window.closeNav = function() {
        document.getElementById("sideNav").style.width = "0";
    }

    // --- CHATBOT FUNCTIONS ---
    window.toggleChat = function() {
        const chat = document.getElementById("chatWindow");
        chat.style.display = (chat.style.display === "block") ? "none" : "block";
    }

    window.sendMessage = function() {
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

    window.handleEnter = function(e) {
        if (e.key === "Enter") sendMessage();
    }

    // --- LOGIN MODAL (OPEN/CLOSE) ---
    if (loginTrigger) {
        loginTrigger.onclick = function(e) {
            e.preventDefault();
            modal.style.display = "block";
        };
    }

    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        };
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // --- LOGIN BACKEND INTEGRATION ---
    if (authForm) {
        authForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Амжилттай нэвтэрлээ!");
                    window.location.reload(); 
                } else {
                    alert("Алдаа: " + result.message);
                }
            } catch (error) {
                console.error("Error during login:", error);
                alert("Сервертэй холбогдоход алдаа гарлаа.");
            }
        });
    }
       