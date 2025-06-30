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

updatePageHistory('adminUsersBadge.html');

function getPageHistory() {
    return JSON.parse(localStorage.getItem('adminPageHistory')) || [];
}

let pageHistory = getPageHistory();

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userChatId = urlParams.get('userChatId');
    const token = JSON.parse(localStorage.getItem('token'));

    tg.BackButton.show();

    // Zoom functionality
    const modal = document.getElementById("zoom-modal");
    const zoomedImage = document.getElementById("zoomed-image");
    const closeBtn = document.querySelector(".close");

    document.querySelectorAll(".images img").forEach(img => {
        img.addEventListener("click", function () {
            modal.style.display = "block";
            zoomedImage.src = this.src;
        });
    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Approve button action
    const approve = document.getElementById("approve")
    approve.addEventListener('click', () => {
        tg.showConfirm("Are you sure you want to approve?", function (ok) {
            if (ok) {
                const identification_number = approve.getAttribute("identification_number");

                const dataArray = {
                    'chat_id': userChatId,
                    'identification_number': identification_number,
                    'status': 'blue',
                    'token': token,
                    'admin_chat_id': chatId
                }
                fetch(`/api/admin_action_verification`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataArray)
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            showNotification(data.message, "success");
                            setTimeout(() => {
                                location.reload();
                            }, 1000);

                        } else {
                            showNotification(data.message, "error");
                        }

                    }).catch(error => {
                    console.log(error);
                });
            }
        });


    });

    const revoke = document.getElementById("revoke")
    revoke.addEventListener('click', () => {
        tg.showConfirm("Are you sure you want to revoke?", function (ok) {
            if (ok) {
                const identification_number = revoke.getAttribute("identification_number");

                const dataArray = {
                    'chat_id': userChatId,
                    'identification_number': identification_number,
                    'status': 'grey',
                    'token': token,
                    'admin_chat_id': chatId
                }
                fetch(`/api/admin_action_verification`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataArray)
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            showNotification(data.message, "success");
                            setTimeout(() => {
                                location.reload();
                            }, 1000);
                        } else {
                            showNotification(data.message, "error");
                        }

                    }).catch(error => {
                    console.log(error);
                });
            }
        });


    });

    const menu = document.getElementById("menu");
    menu.addEventListener('click', () => {
        window.location.href = 'admin_panel.html';
    });


    function fetchUserVerificationDetails() {
        const dataArray = {'chat_id': userChatId, 'token': token, 'admin_chat_id': chatId}
        fetch(`/api/get_user_verification_details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataArray)
        })
            .then(response => response.json())
            .then(data => {
                // console.log("Data: ", data);
                const userDetails = data[0];
                document.getElementById("seller-items-loading-indicator").style.display = 'none';
                document.getElementById("main-content").style.display = 'block';

                // Populate text fields
                document.getElementById("verified").textContent = userDetails.verified || "N/A";
                document.getElementById("id_number").textContent = userDetails.identification_number || "N/A";
                document.getElementById("expiry_date").textContent = userDetails.expiry_date || "N/A";

                // Parse the user_data JSON string
                const userData = JSON.parse(userDetails.user_data || "{}");
                userDetails.verified === 'blue' ? document.getElementById("approve").disabled = true : document.getElementById("approve").disabled = false;

                document.getElementById("nationality").textContent = userData.Nationality || "N/A";
                userData.Type === 'ID Card' ? document.getElementById("fcn").textContent = userData.FCN || "N/A" : document.getElementById("fcn").textContent = userData['Passport Number'] || "N/A";
                document.getElementById("valid_status").textContent = userData.Valid ? "Yes" : "No";
                if (userDetails.verified !== 'blue') {
                    document.getElementById("approve").disabled = userData.Valid !== true;
                }

                document.getElementById("approve").style.cursor = !userData.Valid ? "not-allowed" : "pointer";


                // Create images div, add images and append the div to parent element
                const imagesBox = document.createElement('div');
                imagesBox.classList.add('images');

                if (userData.Type === "ID Card") {
                    imagesBox.innerHTML = `
                        <h2>ID Front Image</h2>
                        <img src=${userDetails.id_front_image} id="id_front_image" alt="ID Front Image"/>
                        
                        <h2>ID Back Image</h2>
                        <img src=${userDetails.id_back_image} id="id_back_image" alt="ID Back Image"/>
                        
                        <h2>Selfie Image</h2>
                        <img src=${userDetails.selfie_image} id="selfie_image" alt="Selfie Image"/>
                    `;
                } else {
                    imagesBox.innerHTML = `
                        <h2>Passport Image</h2>
                        <img src=${userDetails.passport_image} id="passport_image" alt="Passport Image"/>
                        
                        <h2>Selfie Image</h2>
                        <img src=${userDetails.selfie_image} id="selfie_image" alt="Selfie Image"/>
                    `;
                }

                document.getElementById("main-content").appendChild(imagesBox);

                document.querySelectorAll(".images img").forEach(img => {
                    img.addEventListener("click", function () {
                        modal.style.display = "block";
                        zoomedImage.src = this.src;
                    });
                });

                closeBtn.addEventListener("click", function () {
                    modal.style.display = "none";
                });

                modal.addEventListener("click", function (event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                });

                // set data attr in btns
                document.getElementById("approve").setAttribute("identification_number", userDetails.identification_number)
                document.getElementById("revoke").setAttribute("identification_number", userDetails.identification_number)
            })
            .catch(error => {
                console.error('Error fetching badge details:', error);
                showNotification("Error fetching badge details!", "error");
            });

    }

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

    fetchUserVerificationDetails();

});
