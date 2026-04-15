const commentsContainer = document.getElementById("commentsContainer");
const footerStorage = document.getElementById("footerStorage");
const feedbackModal = document.getElementById("feedbackModal");
const closeModal = document.getElementById("closeModal");
const themeToggle = document.getElementById("themeToggle");

function detectOS() {
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Windows")) {
        return "Windows";
    }

    if (userAgent.includes("Mac")) {
        return "macOS";
    }

    if (userAgent.includes("Linux")) {
        return "Linux";
    }

    if (userAgent.includes("Android")) {
        return "Android";
    }

    if (userAgent.includes("like Mac")) {
        return "iOS";
    }

    return "Невідома ОС";
}

function saveBrowserData() {
    const browserData = {
        os: detectOS(),
        browserUserAgent: navigator.userAgent,
        browserLanguage: navigator.language,
        platform: navigator.platform,
        browserName: navigator.appName,
        browserVersion: navigator.appVersion,
        cookiesEnabled: navigator.cookieEnabled,
        onlineStatus: navigator.onLine,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height
    };

    Object.entries(browserData).forEach(([key, value]) => {
        localStorage.setItem(key, String(value));
    });
}

function renderLocalStorageData() {
    footerStorage.innerHTML = "";

    Object.keys(localStorage).forEach((key) => {
        const item = document.createElement("p");
        item.className = "storage-item";
        item.textContent = key + ": " + localStorage.getItem(key);
        footerStorage.appendChild(item);
    });
}

async function loadComments() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/17/comments");
        const comments = await response.json();

        commentsContainer.innerHTML = "";

        comments.forEach((comment) => {
            const card = document.createElement("div");
            card.className = "comment-card";

            const name = document.createElement("h3");
            name.textContent = comment.name;

            const email = document.createElement("p");
            email.textContent = comment.email;

            const body = document.createElement("p");
            body.textContent = comment.body;

            card.appendChild(name);
            card.appendChild(email);
            card.appendChild(body);
            commentsContainer.appendChild(card);
        });
    } catch (error) {
        commentsContainer.innerHTML = "<p>Не вдалося завантажити коментарі.</p>";
    }
}

function getThemeByTime() {
    const hour = new Date().getHours();
    return hour >= 7 && hour < 21 ? "light" : "dark";
}

function applyTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");

    if (theme === "dark") {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.add("light-theme");
    }

    localStorage.setItem("theme", theme);
    renderLocalStorageData();
}

function initTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
        applyTheme(savedTheme);
    } else {
        applyTheme(getThemeByTime());
    }
}

themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    applyTheme(isDark ? "light" : "dark");
});

function openModal() {
    feedbackModal.style.display = "flex";
}

function closeFeedbackModal() {
    feedbackModal.style.display = "none";
}

closeModal.addEventListener("click", closeFeedbackModal);

feedbackModal.addEventListener("click", (event) => {
    if (event.target === feedbackModal) {
        closeFeedbackModal();
    }
});

setTimeout(openModal, 60000);

saveBrowserData();
initTheme();
renderLocalStorageData();
loadComments();