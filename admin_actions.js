let tg = window.Telegram.WebApp;
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

// Track page history
function updatePageHistory(pageName) {
    // Retrieve existing history from localStorage or initialize an empty array
    let pageHistory = JSON.parse(localStorage.getItem('adminPageHistory')) || [];

    // Add the current page to the history
    pageHistory.push(pageName);

    // Save the updated history back to localStorage
    localStorage.setItem('adminPageHistory', JSON.stringify(pageHistory));
}

updatePageHistory('admin_actions.html');

function getPageHistory() {
    return JSON.parse(localStorage.getItem('adminPageHistory')) || [];
}

let pageHistory = getPageHistory();

document.addEventListener('DOMContentLoaded', () => {
    tg.BackButton.show()
    // Extract the token from the URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const token = JSON.parse(localStorage.getItem('token'));

    const backToHome = document.getElementById("menu");
    const toggleMenu = document.getElementById("toggle-menu");
    const addAdmin = document.getElementById("add-admin");
    const removeAdmin = document.getElementById("remove-admin");
    const changePassword = document.getElementById("change-admin-password");
    const recoverSecretKey = document.getElementById("recover-secret-key");

    const leftOptions = document.querySelector('.left-options');
    const rightContent = document.querySelector('.right-content');


    backToHome.addEventListener('click', function () {
        window.location.href = 'admin_panel.html';
    });

    // Menu to toggle the left section for mobile view
    toggleMenu.addEventListener('click', function () {
        toggleActive(this);
        leftOptions.classList.toggle("hidden");
        rightContent.classList.toggle('full-screen');
    });

    addAdmin.addEventListener('click', function () {
        toggleActive(this);
        document.getElementById("add-admin-form").style.display = "block";
        document.getElementById("remove-admin-container").style.display = "none";
    });

    removeAdmin.addEventListener('click', function () {
        toggleActive(this);
        document.getElementById("add-admin-form").style.display = "none";
        fetch(`/api/get_admins`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"token":token, "chat_id":chatId})
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById("remove-admin-container").style.display = "block";
                const adminList = document.querySelector('.remove-admin-container');

                data.forEach((item) => {
                    const adminBox = document.createElement("div");
                    adminBox.className = "admin-info";

                    adminBox.innerHTML = `
                        <i class="fas fa-user"></i> <span id="admin-username">${item.admin_username}</span>
                        <i class="fas fa-envelope"></i> <span id="admin-email">${item.admin_email}</span>
                        <i class="fas fa-users"></i> <span id="admin-role">${item.admin_role}</span>
                        <button class="rmv-admin-btn">Remove</button>
                    `;

                    adminList.appendChild(adminBox);
                });

            })
            .catch((error) => {
                showNotification("Something went wrong, try again!", "error");
            });
    });

    changePassword.addEventListener('click', function () {
        toggleActive(this);
        console.log("Add admin");
    });

    recoverSecretKey.addEventListener('click', function () {
        toggleActive(this);
        console.log("Add admin");
    });

    // Handle back button click event
    tg.onEvent('backButtonClicked', function () {
        // Go to the previous page using Telegram's built-in back button functionality
        if (pageHistory.length > 0) {
            // Navigate back by removing the last page from history
            pageHistory.pop();
            const previousPage = pageHistory.pop();

            // Manually navigate to the previous page. shop, sell, item-details
            // window.location.href = previousPage;

            // If the previous page is home.html, switch to close button
            if (previousPage === 'admin_panel.html') {
                localStorage.removeItem('adminPageHistory');
                let pageHistory = [];
                pageHistory.push('admin_panel.html')
                localStorage.setItem('adminPageHistory', JSON.stringify(pageHistory));
                tg.BackButton.hide();
                window.history.back();
            } else {
                window.history.back();
            }
        } else {
            tg.BackButton.hide();
            window.history.back();
        }

    });

    const email_ = document.getElementById('email');
    const password_ = document.getElementById('password');
    const newAdminRole = document.getElementById('new-admin-role');
    const username_ = document.getElementById('username');
    const newAdminChatIdElement = document.getElementById("chat-id");
    const container = document.querySelector(".add-admin-form");

    // Event listener to detect focus and adjust the message box
    email_.addEventListener('focus', function () {
        // adjustMessageBoxHeight(); // Adjust the height when the textarea gets focus
        container.style.marginBottom = '280px';
    });

    // Event listener to reset height on blur (optional)
    email_.addEventListener('blur', function () {
        container.style.marginBottom = '30px';
    });

    // Event listener to detect focus and adjust the message box
    password_.addEventListener('focus', function () {
        // adjustMessageBoxHeight(); // Adjust the height when the textarea gets focus
        container.style.marginBottom = '280px';
    });

    // Event listener to reset height on blur (optional)
    password_.addEventListener('blur', function () {
        container.style.marginBottom = '30px';
    });

    // Event listener to detect focus and adjust the message box
    newAdminRole.addEventListener('focus', function () {
        // adjustMessageBoxHeight(); // Adjust the height when the textarea gets focus
        container.style.marginBottom = '280px';
    });

    // Event listener to reset height on blur (optional)
    newAdminRole.addEventListener('blur', function () {
        container.style.marginBottom = '30px';
    });

    // Event listener to detect focus and adjust the message box
    username_.addEventListener('focus', function () {
        // adjustMessageBoxHeight(); // Adjust the height when the textarea gets focus
        container.style.marginBottom = '280px';
    });

    // Event listener to reset height on blur (optional)
    username_.addEventListener('blur', function () {
        container.style.marginBottom = '30px';
    });

    // Event listener to detect focus and adjust the message box
    newAdminChatIdElement.addEventListener('focus', function () {
        // adjustMessageBoxHeight(); // Adjust the height when the textarea gets focus
        container.style.marginBottom = '280px';
    });

    // Event listener to reset height on blur (optional)
    newAdminChatIdElement.addEventListener('blur', function () {
        container.style.marginBottom = '30px';
    });

    function toggleActive(element) {
        // Remove active class from all items and hide all dots
        document.querySelectorAll('.add-admin').forEach(div => div.classList.remove('active'));
        document.querySelectorAll('.dot').forEach(dot => dot.classList.add('hidden'));

        // Add active class to clicked item
        element.classList.add('active');

        // Show the dot inside the clicked item
        let dot = element.querySelector('.dot');
        if (dot) {
            dot.classList.remove('hidden');
        }
    }

    function copySecretKey(event) {
        if (event) event.stopPropagation();

        const secretKey = document.getElementById("secret-key").innerText;
        navigator.clipboard.writeText(secretKey).then(() => {
            showNotification("Secret key copied!", "success");
        });
    }


    document.querySelector('.secret-key-box').addEventListener('click', function () {
        copySecretKey();
    });

    document.querySelector('.copy-btn').addEventListener('click', function (event) {
        copySecretKey(event);
    });

    // Send the new admin data to the backend
    const submitButton = document.getElementById("submit");
    const loadingIndicator = document.getElementById("loading");
    submitButton.addEventListener('click', function (e) {
        e.preventDefault();

        // Collect form data
        const email = document.getElementById("email").value.trim().toLowerCase();
        const username = document.getElementById("username").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();
        const role = document.getElementById("new-admin-role").value.trim();
        const newAdminChatId = document.getElementById("chat-id").value.trim();

        if (!email || !password || !username || !role || !newAdminChatId) {
            showNotification("Please enter all the required fields", "error");
            return;
        }

        submitButton.style.display = 'none';
        loadingIndicator.style.display = "block";

        // Prepare formData object
        const newAdminFormData = {
            admin_chat_id: chatId,
            email: email,
            username: username,
            role: role,
            password: password,
            new_admin_chat_id: newAdminChatId,
            token: token
        };

        fetch(`/api/add_admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAdminFormData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status !== "success") {
                    showNotification(data.message, "error");
                    loadingIndicator.style.display = "none";
                    submitButton.style.display = "block";
                } else if (data.status === "success") {
                    showNotification(data.message, "success");
                    document.getElementById("add-admin-form").style.display = "none";
                    document.getElementById("secret-key-container").style.display = "block";
                    document.getElementById("secret-key").textContent = data.key;
                }

            })
            .catch((error) => {
                loadingIndicator.style.display = "none";
                submitButton.style.display = "block";
                console.error('Error:', error);
                showNotification("Something went wrong, try again!", "error");
            });

    });


});