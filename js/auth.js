
function ensureAppMessageStyles() {
    if (document.getElementById('appMessageStyles')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'appMessageStyles';
    style.textContent = `
        .app-toast-container {
            position: fixed;
            top: 22px;
            right: 22px;
            z-index: 3000;
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-width: 360px;
        }
        .app-toast {
            background: #ffffff;
            border-radius: 16px;
            padding: 14px 18px;
            box-shadow: 0 14px 35px rgba(0, 0, 0, 0.12);
            font-weight: 700;
            color: #2d3436;
            border-left: 5px solid #4facfe;
            animation: appToastIn 0.25s ease;
        }
        .app-toast-success { border-left-color: #2ecc71; }
        .app-toast-danger { border-left-color: #d63031; }
        .app-toast-warning { border-left-color: #FFC371; }
        .app-toast-info { border-left-color: #4facfe; }
        @keyframes appToastIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .form-message {
            padding: 12px 14px;
            border-radius: 14px;
            font-weight: 700;
            font-size: 0.9rem;
            margin-bottom: 15px;
        }
        .form-message-danger {
            background: #fff0f0;
            color: #d63031;
            border: 1px solid #ffd1d1;
        }
        .form-message-success {
            background: #f0fff4;
            color: #1f8f4d;
            border: 1px solid #c6f6d5;
        }
        .input-error {
            border-color: #d63031 !important;
            background: #fffafa !important;
        }
        .app-confirm-backdrop {
            position: fixed;
            inset: 0;
            z-index: 2500;
            background: rgba(0, 0, 0, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .app-confirm-box {
            width: 100%;
            max-width: 420px;
            background: #ffffff;
            border-radius: 24px;
            padding: 26px;
            box-shadow: 0 20px 55px rgba(0, 0, 0, 0.2);
        }
        .audio-word-btn {
            border: none;
            background: transparent;
            padding: 0;
        }
        .audio-word-btn.speaking,
        .audio-word-btn:hover {
            color: #FFC371 !important;
            transform: scale(1.08);
        }
    `;
    document.head.appendChild(style);
}

function showAppMessage(message, type = 'info') {
    if (type === 'success' || type === 'info') {
        return;
    }

    ensureAppMessageStyles();

    let container = document.querySelector('.app-toast-container');

    if (!container) {
        container = document.createElement('div');
        container.className = 'app-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `app-toast app-toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-8px)';
        toast.style.transition = '0.25s';
        setTimeout(() => toast.remove(), 260);
    }, 3000);
}

window.showAppMessage = showAppMessage;

function getUsers() {
    try {
        const users = localStorage.getItem('espassUsers');
        return users ? JSON.parse(users) : [];
    } catch (error) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem('espassUsers', JSON.stringify(users));
}

function getDefaultUser() {
    return {
        name: 'Valeria Sapozhko',
        email: 'valeria@example.com',
        password: '123456',
        gender: 'Жіноча',
        birthDate: '2004-05-12',
        bio: 'hola! вивчаю іспанську для подорожей!',
        level: 'Elemental (А2)'
    };
}

function addDefaultUser() {
    const users = getUsers();
    const defaultUser = getDefaultUser();
    const exists = users.some((user) => user.email === defaultUser.email);

    if (!exists) {
        users.push(defaultUser);
        saveUsers(users);
    }
}

function getCurrentUser() {
    try {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser ? JSON.parse(currentUser) : getDefaultUser();
    } catch (error) {
        return getDefaultUser();
    }
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
}

function updateSavedUser(updatedUser, oldEmail = updatedUser.email) {
    const users = getUsers();
    const index = users.findIndex((user) => user.email === oldEmail);

    if (index >= 0) {
        users[index] = updatedUser;
    } else {
        users.push(updatedUser);
    }

    saveUsers(users);
    setCurrentUser(updatedUser);
}

function showFormMessage(form, message, type = 'danger') {
    if (!form) {
        return;
    }

    let messageBox = form.querySelector('.form-message');

    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.className = 'form-message';
        form.prepend(messageBox);
    }

    messageBox.className = `form-message form-message-${type}`;
    messageBox.textContent = message;
}

function clearFormMessage(form) {
    const messageBox = form ? form.querySelector('.form-message') : null;

    if (messageBox) {
        messageBox.remove();
    }
}

function showProfileMessage(message, type = 'success') {
    const saveProfileBtn = document.getElementById('saveProfileBtn');

    if (!saveProfileBtn) {
        return;
    }

    let messageBox = document.getElementById('profileSaveMessage');

    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = 'profileSaveMessage';
        saveProfileBtn.parentElement.prepend(messageBox);
    }

    messageBox.className = `form-message form-message-${type}`;
    messageBox.textContent = message;
}

function clearProfileMessage() {
    const messageBox = document.getElementById('profileSaveMessage');

    if (messageBox) {
        messageBox.remove();
    }
}

function setInvalidField(input, isInvalid) {
    if (!input) {
        return;
    }

    input.classList.toggle('input-error', isInvalid);
}

function toggleAuth() {
    const login = document.getElementById('login-section');
    const register = document.getElementById('register-section');

    if (!login || !register) {
        return;
    }

    login.style.display = login.style.display === 'none' ? 'block' : 'none';
    register.style.display = register.style.display === 'none' ? 'block' : 'none';
}

function initLoginForm() {
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) {
        return;
    }

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    [emailInput, passwordInput].forEach((input) => {
        if (input) {
            input.addEventListener('input', () => {
                setInvalidField(input, false);
                clearFormMessage(loginForm);
            });
        }
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const users = getUsers();
        const userByEmail = users.find((item) => item.email === email);

        setInvalidField(emailInput, false);
        setInvalidField(passwordInput, false);

        if (!email || !password) {
            showFormMessage(loginForm, 'Заповніть email і пароль.');
            setInvalidField(emailInput, !email);
            setInvalidField(passwordInput, !password);
            return;
        }

        if (!userByEmail) {
            showFormMessage(loginForm, 'Користувача з таким email не знайдено. Спочатку зареєструйтесь.');
            setInvalidField(emailInput, true);
            return;
        }

        if (userByEmail.password !== password) {
            showFormMessage(loginForm, 'Неправильний пароль. Перевірте пароль і спробуйте ще раз.');
            setInvalidField(passwordInput, true);
            return;
        }

        setCurrentUser(userByEmail);
        window.location.href = 'index.html';
    });
}

function initRegisterForm() {
    const registerForm = document.getElementById('registerForm');

    if (!registerForm) {
        return;
    }

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const user = {
            name: document.getElementById('registerName').value.trim(),
            email: document.getElementById('registerEmail').value.trim(),
            password: document.getElementById('registerPassword').value,
            gender: document.getElementById('registerGender').value,
            birthDate: document.getElementById('registerBirthDate').value,
            bio: 'hola! вивчаю іспанську для подорожей!',
            level: 'Elemental (А2)'
        };

        clearFormMessage(registerForm);

        if (!user.name || !user.email || !user.password || !user.gender || !user.birthDate) {
            showFormMessage(registerForm, 'Заповніть усі поля реєстрації.');
            return;
        }

        if (user.password.length < 4) {
            showFormMessage(registerForm, 'Пароль має містити мінімум 4 символи.');
            return;
        }

        const users = getUsers();
        const exists = users.some((item) => item.email === user.email);

        if (exists) {
            showFormMessage(registerForm, 'Користувач з таким email вже існує. Увійдіть або використайте інший email.');
            return;
        }

        users.push(user);
        saveUsers(users);
        setCurrentUser(user);
        showFormMessage(registerForm, 'Реєстрація успішна. Тепер можна увійти.', 'success');
        setTimeout(() => toggleAuth(), 700);
    });
}

function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
        element.textContent = value;
    });
}

function initHeaderUser() {
    const user = getCurrentUser();
    const shortName = user.name ? user.name.split(' ').slice(0, 2).join(' ') : 'Usuario';

    setText('.js-user-name', shortName);
    setText('.js-user-level', user.level || 'Elemental (А2)');
}

function initProfileSettings() {
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileBio = document.getElementById('profileBio');
    const profileGender = document.getElementById('profileGender');
    const profileBirthDate = document.getElementById('profileBirthDate');
    const profileLevel = document.getElementById('profileLevel');
    const saveProfileBtn = document.getElementById('saveProfileBtn');

    if (!profileName || !profileEmail || !profileBio || !profileGender || !profileBirthDate) {
        return;
    }

    const user = getCurrentUser();

    profileName.value = user.name || '';
    profileEmail.value = user.email || '';
    profileBio.value = user.bio || '';
    profileGender.value = user.gender || '';
    profileBirthDate.value = user.birthDate || '';

    if (profileLevel) {
        profileLevel.value = user.level || 'Elemental (А2)';
    }

    renderProfileTable(user);

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            clearProfileMessage();
            const currentUser = getCurrentUser();
            const oldEmail = currentUser.email;
            const updatedUser = {
                ...currentUser,
                name: profileName.value.trim(),
                email: profileEmail.value.trim(),
                bio: profileBio.value.trim(),
                gender: profileGender.value,
                birthDate: profileBirthDate.value,
                level: profileLevel ? profileLevel.value : currentUser.level
            };

            [profileName, profileEmail, profileGender, profileBirthDate].forEach((input) => setInvalidField(input, false));

            if (!updatedUser.name || !updatedUser.email || !updatedUser.gender || !updatedUser.birthDate) {
                setInvalidField(profileName, !updatedUser.name);
                setInvalidField(profileEmail, !updatedUser.email);
                setInvalidField(profileGender, !updatedUser.gender);
                setInvalidField(profileBirthDate, !updatedUser.birthDate);
                showProfileMessage('Заповніть ім’я, email, стать і дату народження.', 'danger');
                return;
            }

            updateSavedUser(updatedUser, oldEmail);
            renderProfileTable(updatedUser);
            initHeaderUser();
            showProfileMessage('Дані профілю збережено.', 'success');
        });
    }
}

function renderProfileTable(user) {
    const profileTableBody = document.getElementById('profileTableBody');

    if (!profileTableBody) {
        return;
    }

    profileTableBody.innerHTML = `
        <tr><th>Ім’я</th><td>${user.name || ''}</td></tr>
        <tr><th>Email</th><td>${user.email || ''}</td></tr>
        <tr><th>Стать</th><td>${user.gender || ''}</td></tr>
        <tr><th>Дата народження</th><td>${user.birthDate || ''}</td></tr>
        <tr><th>Рівень мови</th><td>${user.level || ''}</td></tr>
    `;
}


function initSimpleActionMessages() {
    // Демонстраційні сповіщення для кнопок без дії вимкнені.
}

function initLogoutButtons() {
    document.querySelectorAll('a[href="login.html"]').forEach((link) => {
        if (link.title === 'Cerrar sesión' || link.classList.contains('logout-btn')) {
            link.addEventListener('click', () => {
                localStorage.setItem('isLoggedIn', 'false');
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    ensureAppMessageStyles();
    addDefaultUser();
    initLoginForm();
    initRegisterForm();
    initHeaderUser();
    initProfileSettings();
    initLogoutButtons();
    initSimpleActionMessages();
});
