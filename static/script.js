document.addEventListener('DOMContentLoaded', function () {

    // ============================================================
    // SUPABASE CONNECTION
    // ============================================================
    const { createClient } = supabase;
    const _supabase = createClient(
        'https://fmsbpelnkfqfiospdsbw.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtc2JwZWxua2ZxZmlvc3Bkc2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0ODE2MTIsImV4cCI6MjA5MTA1NzYxMn0.oxsG7jJiG1B8RIbEuD2iGNDwWCn_1-mGZySnUttGAMA'
    );

    // ============================================================
    // SIDEBAR
    // ============================================================
    window.openNav = function () {
        document.getElementById('sideNav').style.width = '280px';
    };

    window.closeNav = function () {
        document.getElementById('sideNav').style.width = '0';
    };

    // ============================================================
    // LOGIN MODAL — open / close
    // ============================================================
    const modal         = document.getElementById('loginModal');
    const closeBtn      = document.querySelector('.close-btn');
    const loginTriggers = document.querySelectorAll('.login-trigger');

    loginTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            showTab('login');
            if (modal) modal.style.display = 'block';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // ============================================================
    // TAB SWITCHER — Login / Sign Up
    // ============================================================
    window.showTab = function (tab) {
        const loginForm  = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const tabLogin   = document.getElementById('tabLogin');
        const tabSignup  = document.getElementById('tabSignup');

        if (tab === 'login') {
            loginForm.style.display  = 'block';
            signupForm.style.display = 'none';
            tabLogin.style.color        = '#0046ad';
            tabLogin.style.borderBottom = '2px solid #0046ad';
            tabSignup.style.color        = '#94a3b8';
            tabSignup.style.borderBottom = '2px solid transparent';
        } else {
            loginForm.style.display  = 'none';
            signupForm.style.display = 'block';
            tabSignup.style.color        = '#0046ad';
            tabSignup.style.borderBottom = '2px solid #0046ad';
            tabLogin.style.color        = '#94a3b8';
            tabLogin.style.borderBottom = '2px solid transparent';
        }
    };

    // ============================================================
    // LOGIN FORM
    // ============================================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email    = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const errEl    = document.getElementById('loginError');
            errEl.textContent = '';

            const { data, error } = await _supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                errEl.textContent = 'Error: ' + error.message;
            } else {
                modal.style.display = 'none';
                updateUIForUser(data.user);
            }
        });
    }

    // ============================================================
    // SIGN UP FORM
    // ============================================================
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const name     = document.getElementById('signupName').value;
            const email    = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirm  = document.getElementById('signupConfirm').value;
            const errEl    = document.getElementById('signupError');
            errEl.textContent = '';

            if (password !== confirm) {
                errEl.textContent = 'Passwords do not match.';
                return;
            }
            if (password.length < 6) {
                errEl.textContent = 'Password must be at least 6 characters.';
                return;
            }

            const { data, error } = await _supabase.auth.signUp({
                email: email,
                password: password,
                options: { data: { full_name: name } }
            });

            if (error) {
                errEl.textContent = 'Error: ' + error.message;
            } else {
                document.getElementById('signupSuccess').style.display = 'block';
                signupForm.reset();
            }
        });
    }

    // ============================================================
    // CHECK SESSION ON PAGE LOAD
    // ============================================================
    async function checkSession() {
        const { data } = await _supabase.auth.getSession();
        if (data.session) {
            updateUIForUser(data.session.user);
        }
    }

    checkSession();

    // ============================================================
    // UPDATE UI — show username + logout in both nav and sidebar
    // ============================================================
    function updateUIForUser(user) {
        const displayName = user.email.split('@')[0];

        // Update all login triggers to show username
        document.querySelectorAll('.login-trigger').forEach(function (el) {
            el.textContent = displayName;
            el.style.pointerEvents = 'none';
        });

        // Add logout to desktop nav
        if (!document.getElementById('logoutBtnDesktop')) {
            const btn = document.createElement('a');
            btn.id        = 'logoutBtnDesktop';
            btn.href      = '#';
            btn.textContent = 'Log Out';
            btn.style.cssText = 'color:#e74c3c; font-weight:600; margin-left:15px; text-decoration:none; font-size:14px;';
            btn.addEventListener('click', handleLogout);
            const desktopNav = document.querySelector('.desktop-nav');
            if (desktopNav) desktopNav.appendChild(btn);
        }

        // Add logout to sidebar
        if (!document.getElementById('logoutBtnSidebar')) {
            const btn = document.createElement('a');
            btn.id        = 'logoutBtnSidebar';
            btn.href      = '#';
            btn.textContent = 'Log Out';
            btn.style.cssText = 'color:#e74c3c !important; font-weight:700;';
            btn.addEventListener('click', handleLogout);
            const sidenavLinks = document.querySelector('.sidenav-links');
            if (sidenavLinks) sidenavLinks.appendChild(btn);
        }
    }

    async function handleLogout(e) {
        e.preventDefault();
        await _supabase.auth.signOut();
        window.location.reload();
    }

    // ============================================================
    // CHATBOT
    // ============================================================
    window.toggleChat = function () {
        const chat = document.getElementById('chatWindow');
        chat.style.display = (chat.style.display === 'block') ? 'none' : 'block';
    };

    window.sendMessage = function () {
        const input = document.getElementById('userInput');
        const body  = document.getElementById('chatBody');
        const msg   = input.value.trim();
        if (msg === '') return;

        const userDiv = document.createElement('div');
        userDiv.className   = 'user-bubble';
        userDiv.textContent = msg;
        body.appendChild(userDiv);
        input.value = '';
        body.scrollTop = body.scrollHeight;

        setTimeout(function () {
            const aiDiv = document.createElement('div');
            aiDiv.className   = 'ai-bubble';
            aiDiv.textContent = 'Thank you! An advisor will review your message shortly.';
            body.appendChild(aiDiv);
            body.scrollTop = body.scrollHeight;
        }, 800);
    };

    window.handleEnter = function (e) {
        if (e.key === 'Enter') sendMessage();
    };

     // ============================================================
     // CONTACT FORM
    // ============================================================
    window.submitContactForm = function () {
        const nameEl    = document.querySelector('#contact input[type="text"]');
        const emailEl   = document.querySelector('#contact input[type="email"]');
        const subjectEl = document.querySelector('#contact select');
        const msgEl     = document.querySelector('#contact textarea');

        if (!nameEl.value.trim() || !emailEl.value.trim() || !msgEl.value.trim()) {
            alert('Please fill in all required fields.');
            return;
        }

        alert('Thank you, ' + nameEl.value.trim() + '! We will get back to you within 1–2 business days.');

        nameEl.value    = '';
        emailEl.value   = '';
        subjectEl.value = '';
        msgEl.value     = '';
    };

});