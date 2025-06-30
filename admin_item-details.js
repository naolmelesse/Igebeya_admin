// Initialize the Telegram WebApp instance
const tg = window.Telegram.WebApp;
const chatId = tg.initDataUnsafe.user.id;

function calculateTrustLevel(boosts, isVerified, lastCheckinDays, claimedTasks, reportedCount) {
    // Define weights
    const weights = {
        boosts: 0.2,
        verification: 0.3,
        lastCheckin: 0.2,
        claimedTasks: 0.1,
        reported: 0.2
    };

    // Normalize each factor
    const normalizedBoosts = Math.min(boosts / 10, 1);
    const normalizedVerification = isVerified ? 1 : 0;
    const normalizedCheckin = Math.max(1 - lastCheckinDays / 30, 0);
    const normalizedClaimedTasks = claimedTasks / 10;
    const normalizedReports = Math.min(reportedCount / 5, 1);

    // Calculate trust level (subtract reports impact)
    const trustLevel = (
        weights.boosts * normalizedBoosts +
        weights.verification * normalizedVerification +
        weights.lastCheckin * normalizedCheckin +
        weights.claimedTasks * normalizedClaimedTasks -
        weights.reported * normalizedReports
    );

    // Convert to percentage and cap between 55% and 99%
    return Math.min(99, 55 + Math.min(99, trustLevel * 100));
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

updatePageHistory('admin_item-details.html');

function getPageHistory() {
    return JSON.parse(localStorage.getItem('adminPageHistory')) || [];
}

let pageHistory = getPageHistory();

document.addEventListener("DOMContentLoaded", function () {
    // Show the place-holder
    const placeholder = document.querySelector('.loading-placeholder');
    const content = document.querySelector('.content');

    // Extract the item ID from the URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    let SellerChatID;
    const token = JSON.parse(localStorage.getItem('token'));
    const reported = urlParams.get('reported');
    const seller_chat_id = urlParams.get('chat_id');

    // console.log(itemId); // Ensure this logs the correct itemId
    const item_cont = this.getElementById('item_cont');
    const loadingIndicator = document.getElementById("loading-indicator");

    // Show the Telegram back button in the top bar
    tg.BackButton.show();

    const menu = document.getElementById("menu");
    menu.addEventListener('click', () => {
        window.location.href = 'admin_panel.html';
    });

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

    // Calculate days difference
    function calculateDaysAgo(dateString) {
        // Parse the input date string (format YYYY-MM-DD)
        const givenDate = new Date(dateString);

        // Get the current date
        const currentDate = new Date();

        // Calculate the difference in milliseconds
        const differenceInMilliseconds = currentDate - givenDate;

        // Convert the difference to days
        const daysDifference = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

        // Handle cases
        if (daysDifference === 0) {
            return "Today";
        } else if (daysDifference === 1) {
            return "Yesterday";
        } else if (daysDifference > 1) {
            return `${daysDifference} days ago`;
        } else {
            return "Unknown days ago";
        }
    }

    function itemDetails() {
        let reportsNew ;
        if (reported) {
            fetch(`/api/get_report_messages?item_id=${itemId}&chat_id=${seller_chat_id}`)
                .then(response => response.json())
                .then(reports => {
                    reportsNew = reports;

                }).catch(error => {
                console.error('Error fetching item reports:', error);
                showNotification("Error fetching item reports, try again!", "error");
            });
        }
        // Fetch item details from the server
        fetch(`/api/get_item_details?item_id=${itemId}`)
            .then(response => response.json())
            .then(itemDetails => {
                // Log item details to the console for debugging
                console.log(itemDetails);
                console.log("Reports: ", reportsNew);

                // Check if itemDetails has the required fields
                if (!itemDetails || itemDetails.error) {
                    console.error('Item details not found');
                    showNotification("Item not found! May be unlisted!", "error");
                    return;
                }

                // Split the item pictures and create an array of image URLs
                const images = itemDetails.item_pic.split(',');
                SellerChatID = itemDetails.chat_id;

                // Load the initial main image
                const mainImage = document.getElementById("main-image");
                mainImage.src = `${images[0]}`;

                // Create thumbnail images
                const thumbnailsContainer = document.querySelector('.thumbnails');
                images.forEach((imageSrc, index) => {
                    const thumbnail = document.createElement('img');
                    thumbnail.src = `${imageSrc}`;
                    thumbnail.addEventListener('click', () => {
                        mainImage.src = `${imageSrc}`;
                    });
                    thumbnailsContainer.appendChild(thumbnail);
                });

                // Add event listeners to arrows for navigating through images
                let currentImageIndex = 0;

                function updateMainImage(index) {
                    if (index >= 0 && index < images.length) {
                        currentImageIndex = index;
                        mainImage.src = `${images[currentImageIndex]}`;
                    }
                }

                document.getElementById("prev-arrow").addEventListener('click', () => {
                    updateMainImage(currentImageIndex - 1);
                });

                document.getElementById("next-arrow").addEventListener('click', () => {
                    updateMainImage(currentImageIndex + 1);
                });

                // Swipe functionality
                let startX;

                function handleSwipeLeft() {
                    updateMainImage(currentImageIndex + 1);
                }

                function handleSwipeRight() {
                    updateMainImage(currentImageIndex - 1);
                }

                mainImage.addEventListener('touchstart', (event) => {
                    startX = event.touches[0].clientX;
                });

                mainImage.addEventListener('touchend', (event) => {
                    const endX = event.changedTouches[0].clientX;
                    const diffX = startX - endX;

                    if (Math.abs(diffX) > 30) { // Threshold for swipe detection
                        if (diffX > 0) {
                            handleSwipeLeft();
                        } else {
                            handleSwipeRight();
                        }
                    }
                });

                // Open modal when main image is clicked
                mainImage.addEventListener('click', () => {
                    const modal = document.getElementById("image-modal");
                    const modalImage = document.getElementById("modal-image");
                    document.body.classList.add("no-scroll");
                    modal.style.display = "block";
                    modalImage.src = mainImage.src;
                });

                // Close modal when the close button is clicked
                const closeModal = document.querySelector(".modal .close");
                closeModal.addEventListener('click', () => {
                    document.body.classList.remove("no-scroll");
                    const modal = document.getElementById("image-modal");
                    modal.style.display = "none";
                });

                // Close modal when clicking outside of the modal content
                window.addEventListener('click', (event) => {
                    const modal = document.getElementById("image-modal");
                    if (event.target === modal) {
                        document.body.classList.remove("no-scroll");
                        modal.style.display = "none";
                    }
                });

                // Function to format the view count
                function formatViews(views) {
                    if (views >= 1_000_000) {
                        return (views / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'; // Format as 1M, 1.2M
                    } else if (views >= 1_000) {
                        return (views / 1_000).toFixed(1).replace(/\.0$/, '') + 'k'; // Format as 1k, 1.2k
                    } else {
                        return views.toString(); // Display as is for numbers less than 1000
                    }
                }

                // Calculate the users trust level
                const claimedTasks = itemDetails.claimed_tasks === null ? 0 : itemDetails.claimed_tasks.split(',').slice(0, 10).length;
                // console.log(claimedTasks);

                const userTrustLevel = calculateTrustLevel(Number(itemDetails.boost), itemDetails.verified === 'blue' ? true : false, Number(itemDetails.last_checkin), claimedTasks, Number(itemDetails.max_reported))


                // console.log(`User Trust Level: ${userTrustLevel}%`);
                //  Remove the place-holder
                placeholder.style.display = 'none';
                content.classList.remove('hidden');


                // Populate the rest of the item details
                itemDetails.new_item_price ? document.getElementById("item-price").textContent = `ETB ${Number(itemDetails.new_item_price).toLocaleString()}` :
                    document.getElementById("item-price").textContent = `ETB ${Number(itemDetails.item_price).toLocaleString()}`;
                document.getElementById("item-title").textContent = itemDetails.item_name;
                document.getElementById("item_main").textContent = itemDetails.item_main_category;
                document.getElementById("item_sub").textContent = itemDetails.item_sub_category;
                document.getElementById("item_cat").textContent = itemDetails.item_category;
                document.getElementById("item-views").innerHTML = `<i class="fas fa-eye"></i>
                                                                          <span>${formatViews(itemDetails.views)}</span>`;

                document.getElementById("item-city").innerHTML = `<i class="fas fa-map-marker-alt"></i> ${itemDetails.item_city}`;
                document.getElementById("date").innerHTML = `<i class="fas fa-calendar-alt"></i> ${calculateDaysAgo(itemDetails.date)}`;
                document.getElementById("item-description").textContent = itemDetails.item_description;
                reportsNew ? document.getElementById("item-reports").innerHTML = `<i class="fas fa-message"></i> Reports: ${reportsNew}` : document.getElementById("item-reports").innerHTML = `<i class="fas fa-message"></i> Reports: ...`;
                document.getElementById("posted-by").innerHTML = `<i class="fas fa-user"></i> By: ${itemDetails.username} <i class="trusted-text">(${userTrustLevel}% Trusted)</i>`;

                document.getElementById("joined-date").innerHTML = `<i class="fas fa-clock"></i> Joined: ${itemDetails.joined_date}`;
                document.getElementById("last_active").innerHTML = `<i class="fas fa-history"></i> Last Seen: ${itemDetails.last_active}`;
                if (itemDetails.verified === 'grey') {
                    document.getElementById("verification-badge-grey").innerHTML = `<img src="grey_checkmark.svg" alt="Verified Checkmark" class="checkmark-icon-grey"> Account not verified`;
                }
                if (itemDetails.verified === 'blue') {
                    document.getElementById("verification-badge-blue").innerHTML = `<img src="blue_checkmark.svg" alt="Verified Checkmark" class="checkmark-icon-blue"> Verified account`;
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

                document.getElementById("delete-item").addEventListener('click', function () {
                    tg.showConfirm("Are you sure you want to un-list the item?", function (ok) {
                        if (ok) {
                            const itemData = {'itemId': itemId, 'token':token, 'chat_id': chatId, 'reports': reportsNew, 'seller_chat_id': SellerChatID};
                            unlistItem(itemData);
                        }
                    });

                });

            })
            .catch(error => {
                console.error('Error fetching item details:', error);
                showNotification("Error fetching item details, try again!", "error");
            });
    }

    // Function to unlist an item
    function unlistItem(itemData) {
        // Make a request to the backend to unlist the item
        fetch(`/api/admin_unlist_item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(`Item has been successfully unlisted.`, 'success');
                setTimeout(() => {
                    window.history.back();
                }, 1500);

            } else {
                showNotification(data.error, 'error');
            }
        })
        .catch(error => {
            showNotification('An error occurred while trying to unlist the item.', 'error');
        });
    }

    itemDetails();
});