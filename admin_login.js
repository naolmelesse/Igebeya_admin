// Initialize the Telegram WebApp instance
const tg = window.Telegram.WebApp;
const chatId = tg.initDataUnsafe.user.id;

// Notification badge
function showNotification(message, type = 'success') {
    // Check if a notification already exists
    let existingNotification = document.getElementById('notification-badge');
    if (existingNotification) {
        existingNotification.remove(); // Remove the old notification
    }

    // Create the notification element
    const notification = document.createElement('div');
    notification.id = 'notification-badge';
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Append the notification to the body
    document.body.appendChild(notification);

    // Set a timeout to remove the notification after 3 seconds
    setTimeout(() => {
        notification.remove();
        }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
    if (!tg) {
        console.error("Telegram WebApp is not initialized.");
    }

    // Toggle password type on eye click
    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.querySelector(".password");

    togglePassword.addEventListener("click", function () {
        // Toggle the type attribute between 'password' and 'text'
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);

        // Toggle the eye icon
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");

        // Toggle the visible class to apply specific CSS
        if (type === "text") {
            passwordInput.classList.add("visible");
        } else {
            passwordInput.classList.remove("visible");
        }
    });

    const login_cont = document.getElementById("login_cont");

    // Remove focus from the input to hide the keyboard
    login_cont.addEventListener('click', function(event) {
        if (!event.target.closest('input')) {
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                input.blur();
            });
        }
    });

    const email_ = document.getElementById('email');
    const password_ = document.getElementById('password');
    const twofa_ = document.getElementById('twofa');
    const username_ = document.getElementById('username');
    const container = document.querySelector(".login-container");

    // Event listener to detect focus and adjust the message box
    email_.addEventListener('focus', function() {
        // adjustMessageBoxHeight(); // Adjust the height when the textarea gets focus
        container.style.marginBottom = '280px';
    });

    // Event listener to reset height on blur (optional)
    email_.addEventListener('blur', function() {
        container.style.marginBottom = '30px';
    });

    // Event listener to detect focus and adjust the message box
    password_.addEventListener('focus', function() {
        // adjustMessageBoxHeight(); // Adjust the height when the textarea gets focus
        container.style.marginBottom = '280px';
    });

    // Event listener to reset height on blur (optional)
    password_.addEventListener('blur', function() {
        container.style.marginBottom = '30px';
    });

    // Event listener to detect focus and adjust the message box
    twofa_.addEventListener('focus', function() {
        // adjustMessageBoxHeight(); // Adjust the height when the textarea gets focus
        container.style.marginBottom = '280px';
    });

    // Event listener to reset height on blur (optional)
    twofa_.addEventListener('blur', function() {
        container.style.marginBottom = '30px';
    });

    // Event listener to detect focus and adjust the message box
    username_.addEventListener('focus', function() {
        // adjustMessageBoxHeight(); // Adjust the height when the textarea gets focus
        container.style.marginBottom = '280px';
    });

    // Event listener to reset height on blur (optional)
    username_.addEventListener('blur', function() {
        container.style.marginBottom = '30px';
    });

    // Handle signup form submission
    const loginForm = document.getElementById("login_form");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default form submission

        // Collect form data
        const email = document.getElementById("email").value.trim().toLowerCase();
        const username = document.getElementById("username").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();
        const twofa = document.getElementById("twofa").value.trim();
        const loadingIndicator = document.getElementById("loading");
        const submitButt = document.getElementById("submit");

        if (!email || !password || !username || !twofa) {
            showNotification("Please enter all the required fields","error");
            return;
        }

        submitButt.style.display = "none";
        loadingIndicator.style.display = "block";

        // Prepare formData object
        const formData = {
            chat_id: chatId,
            email: email,
            username: username,
            twofa: twofa,
            password: password
        };

        fetch(`/api/admin_login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            if (data.status !== "success") {
                // alert(data.message);
                showNotification(data.message, "error");
                loadingIndicator.style.display = "none";
                submitButt.style.display = "block";

            } else if (data.status === "success") {
                // alert(data.message);
                // console.log(data.token);
                showNotification(data.message,"success");
                localStorage.setItem("token", JSON.stringify(data.token));
                window.location.href = `/admin_panel.html`;

            }

        })
        .catch((error) => {
            loadingIndicator.style.display = "none";
            submitButt.style.display = "block";
            console.error('Error:', error);
            showNotification("Something went wrong, try again!", "error");
        });

    });


});