let tg = window.Telegram.WebApp;
const chatId = tg.initDataUnsafe.user.id;
let isFetching = false;

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

updatePageHistory('admin_panel.html');

document.addEventListener("DOMContentLoaded", function () {
    const token = JSON.parse(localStorage.getItem("token"));

    tg.BackButton.hide()
    const userManagement = document.getElementById('user-management');
    const itemManagement = document.getElementById('item-management');
    const messageManagement = document.getElementById('message-management');
    const userInteraction = document.getElementById('user-interaction');
    const popularItems = document.getElementById('popular-items');
    const igebeyaAnalytics = document.getElementById('igebeya-analytics');
    const adminActions = document.getElementById('admin-actions');
    const securityVerification = document.getElementById('security-verification');
    const systemSetting = document.getElementById('system-setting');
    const advancedSetting = document.getElementById('advanced-setting');

    const usersSection = document.getElementById('users-section');

    const menu = document.getElementById('menu');
    const leftOptions = document.querySelector(".left-options");
    const rightContent = document.querySelector(".right-content");
    const header = document.querySelector(".header");
    const filter = document.querySelector(".header-filter");

    const users_list = document.querySelector(".all-users");

    let start = 0;
    let limit = 40;

    // Track the currently selected user's chat ID
    let selectedUserChatId = null;

    // Set up the Intersection Observer for home page items
    const observer = new IntersectionObserver((entries) => {
        // console.log(entries);
        if (entries[0].isIntersecting && !isFetching) {
            start += limit;
            fetchUsers(start, limit);
        }
    }, {threshold: 0.5});

    // Menu to toggle the left section for mobile view
    menu.addEventListener('click', function () {
        leftOptions.classList.toggle("hidden");
        rightContent.classList.toggle('full-screen');
        header.classList.toggle('full-screen');
        filter.classList.toggle('full-screen');
    });

    // User management section
    userManagement.addEventListener('click', function () {
        usersSection.style.display = 'block';
        fetchUsers(start, limit);
    });

    adminActions.addEventListener('click', function () {
        window.location.href = `admin_actions.html?token=${token}`;
    });

    // Add a single event listener for the "confirm send" button
    document.getElementById("confirm-send-btn").addEventListener("click", function () {
        const messageContent = document.getElementById("inbox-message").value.trim();

        if (messageContent && selectedUserChatId) {
            const dataMessage = JSON.stringify({
                message: messageContent,
                user_chatId: selectedUserChatId,
                admin_chatId: chatId,
                sender_type: 'admin',
                token: token
            });

            // Send data back to the bot
            fetch(`/api/webapp_data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: dataMessage
            })
                .then(response => response.json())
                .then(data => {
                    document.getElementById("inbox-message").value = '';
                    document.getElementById("inbox-modal").style.display = 'none';
                    document.querySelector(".users-section").classList.remove("no-scroll");
                    console.log('Message sent to user:', data);
                    showNotification("Message sent to user!", "success");
                })
                .catch(error => {
                    document.getElementById("inbox-message").value = '';
                    document.getElementById("inbox-modal").style.display = 'none';
                    document.querySelector(".users-section").classList.remove("no-scroll");
                    console.error('Error sending message to user:', error);
                    showNotification("Error sending message to user!", "error");
                });
        }
    });

    const closeButtonInbox = document.querySelector(".close-btn");
    closeButtonInbox.addEventListener('click', function () {
        document.getElementById("inbox-modal").style.display = 'none';
        document.querySelector(".users-section").classList.remove("no-scroll");
        document.getElementById("inbox-message").value = '';
    });

    function fetchUsers(start, limit) {
        if (isFetching) return;
        isFetching = true;

        fetch(`/api/get_igebeya_users?start=${start}&limit=${limit}`)
            .then(response => response.json())
            .then(users => {
                console.log(users);
                const igebeyUsers = users;

                if (start === 0) {
                    users_list.innerHTML = '';
                }

                if (igebeyUsers.length === 0) {
                    console.log("No users found.");
                    showNotification("No Users Yet!", "success");
                } else if (igebeyUsers.length === 0 && start !== 0) {
                    showNotification("No More Users Found!", "success");
                    console.log("No more users found.");
                } else {
                    document.querySelector(".loading-container-trending").style.display = 'none';
                    igebeyUsers.forEach((user, index) => {
                        const userBox = document.createElement('div');
                        userBox.classList.add('user-box');
                        userBox.setAttribute('data-id', user.id);
                        userBox.setAttribute('user-chat-id', user.chat_id);
                        const badge = user.verified === 'blue' ? 'Verified' : user.verified === 'pending' ? 'Pending' : 'Not Verified';

                        const reported = user.reported_items > 0;

                        userBox.innerHTML = `
                            <div class="profile-pic" style="background-color: ${user.verified === 'grey' ? '#d3d3d3' : user.verified === 'pending' ? '#21b5a3' : '#2e87e6'};">
                                ${user.username.charAt(0).toUpperCase()}
                            </div>
                            <div class="user-details">
                                <p><strong style="color: #0199ac;"><i class="fas fa-id-badge"></i> ID:</strong> ${user.id}</p>
                                <p><strong style="color: #0199ac;"><i class="fas fa-user"></i> Username:</strong> ${user.username}</p>
                                <p><strong style="color: #0199ac;"><i class="fas fa-calendar-alt"></i> Joined:</strong> ${user.date}</p>
                                <p><strong style="color: #0199ac;"><i class="fas fa-shield-alt"></i> Badge:</strong> ${badge}</p>
                                <p><strong style="color: #0199ac;"><i class="fas fa-bolt"></i> Boosts:</strong> ${user.boost}</p>
                                <p><strong style="color: #0199ac;"><i class="fas fa-rocket"></i> Boosted Items:</strong> ${user.boosted_items}</p>
                                <p><strong style="color: #0199ac;"><i class="fas fa-flag"></i> Total Reported:</strong> ${user.reported_items}</p>
                                <p><strong style="color: #0199ac;"><i class="fas fa-flag"></i> Unlisted Reports:</strong> ${user.unlisted_reported}</p>
                                <p><strong style="color: #0199ac;"><i class="fas fa-box"></i> Total Items:</strong> ${user.total_items}</p>   
                                <p><strong style="color: #0199ac;"><i class="fas fa-eye"></i> Total Views:</strong> ${user.total_views}</p>  
                            </div>

                            <div class="user-actions">
                                <button class="btn inbox">Inbox</button>
                                <button class="btn items">Items</button>
                                <button class="btn badge">Badge</button>
                                <button class="btn free-boost">Free Boost</button>
                                <button class="btn see-more">See More</button>
                                <button class="btn ban-user">Ban User</button>
                            </div>
                        `;

                        // <p><strong style="color: #0199ac;"><i
                        //     className="fas fa-envelope"></i> Email:</strong> ${user.email}</p>
                        // <p><strong style="color: #0199ac;"><i
                        //     className="fas fa-circle"></i> Status:</strong> ${user.status}</p>
                        // <p><strong style="color: #0199ac;"><i
                        //     className="fas fa-comments"></i> ChatId:</strong> ${user.chat_id}</p>
                        // <p><strong style="color: #0199ac;"><i className="fas fa-clock"></i> Badge
                        //     Expiry:</strong> ${user.expiry_date}</p>
                        // <p><strong style="color: #0199ac;"><i className="fas fa-history"></i> Last
                        //     Checkin:</strong> ${user.last_checkin}</p>


                        // Inbox
                        const inboxUser = userBox.querySelector('.inbox');
                        inboxUser.addEventListener('click', function () {
                            document.getElementById("inbox-modal").style.display = 'block';
                            document.querySelector(".users-section").classList.add("no-scroll");
                            selectedUserChatId = user.chat_id;
                        });

                        // Items
                        const userItems = userBox.querySelector('.items');
                        userItems.addEventListener('click', function () {
                            window.location.href = `admin_user_items.html?userChatId=${user.chat_id}&username=${user.username}&token=${token}`;
                        });

                        // Badge
                        const userBadge = userBox.querySelector('.badge');
                        userBadge.addEventListener('click', function () {
                            window.location.href = `adminUsersBadge.html?userChatId=${user.chat_id}&token=${token}`;
                        });

                        // Free Boost
                        const freeBoost = userBox.querySelector('.free-boost');
                        freeBoost.addEventListener('click', function () {
                            freeBoostAirDrop(user.chat_id);
                        });

                        // See More
                        const seeMore = userBox.querySelector('.see-more');
                        seeMore.addEventListener('click', function () {
                            const userData = {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                chat_id: user.chat_id,
                                status: user.status,
                                last_checkin: user.last_checkin,
                                date: user.date,
                                badge: badge,
                                expiry_date: user.expiry_date,
                                boost: user.boost,
                                boosted_items: user.boosted_items,
                                reported_items: user.reported_items,
                                unlisted_reported: user.unlisted_reported,
                                total_items: user.total_items,
                                total_views: user.total_views,
                                token: token
                            };

                            const queryParams = new URLSearchParams(userData).toString();
                            window.location.href = `adminSeeMore.html?${queryParams}`;
                        });


                        if (reported) userBox.style.backgroundColor = 'rgba(255,0,49,0.15)';
                        users_list.appendChild(userBox);

                        // Add observer to the last user box
                        if (index === igebeyUsers.length - 1) {
                            console.log("Observing...");
                            observer.observe(userBox);
                        }

                    });
                }
                isFetching = false;

            }).catch(err => console.log(err));

    }

    function freeBoostAirDrop(chat_id) {
        const dataArray = {'chat_id': chat_id, 'type': 'adminairdrop', 'token': token, 'admin_chat_id': chatId}
        fetch(`/api/claim_tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataArray)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    showNotification("+1 free boost was airdropped to the user", "success");
                } else {
                    showNotification(data.message, 'error');
                }

            }).catch(error => console.log(error));
    }

});