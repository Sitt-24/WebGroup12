// >>>  For Barbtn
const bar_btn = document.getElementById('bar-btn');
const nav_popup = document.querySelector('.nav-popup');
const bar_icon = document.querySelector('.fa-solid');

bar_btn?.addEventListener('click', () => {
    nav_popup?.classList.toggle('nav-popup-toggle');
    bar_icon?.classList.toggle('fa-droplet');
    bar_icon?.classList.toggle('fa-fire');
});

// >>>  For Find button
const search_icon = document.getElementById('Find-i');
const search_box = document.getElementById('Find-box1');
let toggle = true;

search_icon?.addEventListener("click", () => {
    toggle = !toggle;
    search_box.style.opacity = toggle ? 0 : 1;
});

// >>>  For Login Popup & Registration Popup Functionality
const wrapper = document.querySelector('.login-wrapper');
const registerLink = document.querySelector('.reg-link');
const loginLink = document.querySelector('.log-link');
const Popupbtn = document.querySelector('.Login-popup');
const Closeicon = document.querySelector('.i-close');
const playButtons = document.querySelectorAll('#play-btn, #play-btn2, #play-btn3, #play-btn4, #play-btn5');
const orderButtons = document.querySelectorAll('.P-table button');
const reviewSubmitBtn = document.querySelector('.Contact-i-btn');

// Popup open/close handling
registerLink?.addEventListener("click", () => wrapper?.classList.add('active'));
loginLink?.addEventListener("click", () => wrapper?.classList.remove('active'));
Popupbtn?.addEventListener("click", () => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const currentUser = sessionStorage.getItem("currentUser");

    if (isLoggedIn === "true" && currentUser) {
        showPopupMessage("You are now already logged in!");
    } else {
        wrapper?.classList.add('active-popup');
    }
});
Closeicon?.addEventListener("click", () => wrapper?.classList.remove('active-popup'));

// Login required popup trigger
const showLoginPopup = (event) => {
    event.preventDefault();
    if (sessionStorage.getItem("isLoggedIn") === "true") {
        showPopupMessage("You are now already logged in!");
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        wrapper?.classList.add('active-popup');
    }
};

[...playButtons, ...orderButtons].forEach(button =>
    button?.addEventListener("click", showLoginPopup)
);

reviewSubmitBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!sessionStorage.getItem("isLoggedIn")) {
        showLoginPopup(e);
    } else {
        const reviewForm = document.querySelector('.Contact-i form');
        const inputs = reviewForm.querySelectorAll('input, textarea');
        let allFilled = true;

        inputs.forEach(input => {
            if (input.value.trim() === "") {
                allFilled = false;
            }
        });

        if (!allFilled) {
            showPopupMessage("❌ Please input all of the required fields in order to add feedback.");
        } else {
            showPopupMessage("✅ Your comment is successfully submitted. Thanks for your feedback!");
            setTimeout(() => reviewForm.reset(), 3000);
        }
    }
});

// Function to handle user storage for multiple accounts
function getUsers() {
    return JSON.parse(sessionStorage.getItem('users')) || [];
}

function saveUsers(users) {
    sessionStorage.setItem('users', JSON.stringify(users));
}

// >>> Registration and Login Logic with Validation
const registerForm = document.querySelector('.f-box.register form');
const loginForm = document.querySelector('.f-box.login form');
const loginSubmitBtn = loginForm.querySelector('.log-btn');
const registerSubmitBtn = registerForm.querySelector('.reg-btn');
const registerPasswordInput = registerForm.querySelector('input[type="password"]');
const showPasswordCheckbox = document.getElementById('show-password-checkbox');

showPasswordCheckbox?.addEventListener('change', function () {
    registerPasswordInput.type = this.checked ? 'text' : 'password';
});

// >>> Email Validation Function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to show popup messages
function showPopupMessage(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup-message');
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
}

// Password validation
function validatePassword(password) {
    return (
        password.length >= 9 &&
        /\d/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
}

// Handle registration
registerForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const fullName = registerForm.querySelectorAll('input')[0].value.trim();
    const email = registerForm.querySelectorAll('input')[1].value.trim();
    const password = registerForm.querySelectorAll('input')[2].value;
    
    // Validate email format
    if (!isValidEmail(email)) {
        showPopupMessage('❌ Please provide a valid email address.');
        return;
    }
    
    // Validate password strength
    if (!validatePassword(password)) {
        showPopupMessage('❌ Password must have 9+ chars, a number & a special char.');
        return;
    }

    const users = getUsers(); // Retrieve all stored users
    const userExists = users.some(user => user.email.toLowerCase() === email.toLocaleLowerCase()); // Check if the email already exists

    if (userExists) {
        showPopupMessage('❌ This email is already registered. Please login.');
    } else {
        users.push({fullName, email, password});
        saveUsers(users);
        showPopupMessage('✅ You are now signed up! Please login.');
        setTimeout(() => {
            registerForm.reset();
            wrapper?.classList.remove('active'); // Switch to Login popup
        }, 3000);
    }
});

// Handle login
loginForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = loginForm.querySelectorAll('input')[0].value.trim();
    const password = loginForm.querySelectorAll('input')[1].value;

    const users = getUsers();
    const loggedInUser = users.find(user => user.email.toLowerCase() === email.toLocaleLowerCase() && user.password === password);

    if (loggedInUser) {
        sessionStorage.setItem("currentUser", JSON.stringify(loggedInUser));
        sessionStorage.setItem("isLoggedIn", "true");
        showPopupMessage(`✅ Welcome back, ${loggedInUser.fullName}!`);
        setTimeout(() => {
            loginForm.reset();
            wrapper?.classList.remove('active-popup');
            checkLoginState(); // Update button after login
        }, 3000);
    } else {
        showPopupMessage('❌ Invalid email or password. Please try again!');
    }
});

// Handle Logout
const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    sessionStorage.setItem("isLoggedIn", "false");
    Popupbtn.textContent = 'Login';
    wrapper?.classList.remove('active-popup');
    Popupbtn.removeEventListener("click", handleLogout);
    Popupbtn.addEventListener("click", showLoginPopup);
    showPopupMessage('✅ You have been logged out!');
};

// Check login state and update button accordingly
function checkLoginState() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (sessionStorage.getItem("isLoggedIn") === "true" && currentUser) {
        Popupbtn.textContent = `Logout (${currentUser.fullName})`;
        Popupbtn.removeEventListener("click", showLoginPopup);
        Popupbtn.addEventListener("click", handleLogout);
    } else {
        Popupbtn.textContent = 'Login';
        Popupbtn.removeEventListener("click", handleLogout);
        Popupbtn.addEventListener("click", showLoginPopup);
    }
}
checkLoginState(); // Call on every page load to persist login state

// >>>  For Story Card Carousel
const carousel = document.querySelector(".carousel");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const dotsContainer = document.querySelector(".dots-container");

if (carousel) {
    const totalItems = document.querySelectorAll(".story-card").length;
    const visibleItems = 4;

    for (let i = 0; i < Math.ceil(totalItems / visibleItems); i++) {
        let dot = document.createElement("span");
        dot.classList.add("dot");
        dot.setAttribute("data-index", i);
        dotsContainer?.appendChild(dot);
    }

    const dots = document.querySelectorAll(".dot");
    if (dots.length > 0) dots[0].classList.add("active");

    let scrollAmount = 0;
    const itemWidth = document.querySelector(".story-card")?.offsetWidth + 15 || 0;

    prevBtn?.addEventListener("click", () => {
        scrollAmount -= itemWidth * visibleItems;
        scrollAmount = Math.max(scrollAmount, 0);
        carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
        updateDots();
    });

    nextBtn?.addEventListener("click", () => {
        if (scrollAmount < (totalItems - visibleItems) * itemWidth) {
            scrollAmount += itemWidth * visibleItems;
        }
        carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
        updateDots();
    });

    const updateDots = () => {
        let activeIndex = Math.round(scrollAmount / (itemWidth * visibleItems));
        dots.forEach(dot => dot.classList.remove("active"));
        if (dots[activeIndex]) dots[activeIndex].classList.add("active");
    };

    dots.forEach(dot => {
        dot.addEventListener("click", (e) => {
            let index = e.target.getAttribute("data-index");
            scrollAmount = index * itemWidth * visibleItems;
            carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
            updateDots();
        });
    });
}

// Add Hover Effect for images
document.querySelectorAll('.story-card img, .col1 img, .col2 img, .t-col img').forEach(image => {
    image.addEventListener('mousemove', (e) => {
        let xAxis = (window.innerWidth / 2 - e.pageX) /25;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        image.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) scale(1.05)`;
    });
    image.addEventListener('mouseleave', () => {
        image.style.transform = `rotateY(0deg) rotateX(0deg) scale(1)`;
    });
});

// >>> Cookie Consent Popup Functionality (Always Show on Reload)
document.addEventListener("DOMContentLoaded", function() {
    const cookieBar = document.getElementById("cookie-consent");
    const allowAllBtn = document.getElementById("allow-all");
    const allowSelectionBtn = document.getElementById("allow-selection");

    // Check session storage; if no consent given, show popup
    if (!sessionStorage.getItem("cookieConsentGiven")) {
        cookieBar.style.display = "block";
    }

    const hideCookieBar = () => {
        cookieBar.style.display = "none";
        sessionStorage.setItem("cookieConsentGiven", "true"); // Store consent for session
    };

    allowAllBtn.addEventListener("click", hideCookieBar);
    allowSelectionBtn.addEventListener("click", hideCookieBar);
});

// ================= Theme Selector Animation & Page Redirection ================= //
const themeButtons = document.querySelectorAll('.theme-btn');

themeButtons.forEach((btn) => {
    // Hover Animation
    btn.addEventListener('mouseenter', () => {
        themeButtons.forEach(otherBtn => {
            if (otherBtn !== btn) {
                otherBtn.style.transform = 'scale(0.9)';
                otherBtn.style.filter = 'brightness(70%)';
            }
        });
        btn.style.transform = 'translateY(-25px) scale(1.1)';
        btn.classList.add('glow-effect'); // Glow effect on hover
    });

    btn.addEventListener('mouseleave', () => {
        themeButtons.forEach(otherBtn => {
            otherBtn.style.transform = 'scale(1)';
            otherBtn.style.filter = 'brightness(100%)';
        });
        btn.classList.remove('glow-effect'); // Remove glow effect
    });

    // Page Redirection on Click
    btn.addEventListener('click', () => {
        const link = btn.getAttribute('data-link');
        if (link) window.location.href = link;
    });
});
