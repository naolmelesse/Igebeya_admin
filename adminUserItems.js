// Initialize the Telegram WebApp instance
const tg = window.Telegram.WebApp;
const chatId = tg.initDataUnsafe.user.id;


function updatePageHistory(pageName) {
    // Retrieve existing history from localStorage or initialize an empty array
    let pageHistory = JSON.parse(localStorage.getItem('adminPageHistory')) || [];

    // Add the current page to the history
    pageHistory.push(pageName);

    // Save the updated history back to localStorage
    localStorage.setItem('adminPageHistory', JSON.stringify(pageHistory));
}

updatePageHistory('allItemsBySeller.html');

function getPageHistory() {
    return JSON.parse(localStorage.getItem('adminPageHistory')) || [];
}

let pageHistory = getPageHistory();


document.addEventListener("DOMContentLoaded", function () {
    // Extract the item ID from the URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const seller_chat_id = urlParams.get('userChatId');
    const token = urlParams.get('token');
    const posted_by = urlParams.get('username');

    let isFetching = false;
    let start = 0;
    let limit = 20;
    const loadingIndicator = document.getElementById("seller-items-loading-indicator");

    // Show the Telegram back button in the top bar
    tg.BackButton.show();

    // Handle back button click event
    tg.onEvent('backButtonClicked', function() {
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
            }
            else{
                window.history.back();  // You can use custom logic here as well
            }
        } else {
            tg.BackButton.hide();
            window.history.back();
        }

    });

    // Fetch seller items
    fetchSellerItems(start, limit);

    const menu = document.getElementById("menu");
    menu.addEventListener('click',  function(event)  {
        event.stopPropagation();
        window.location.href = 'admin_panel.html';
    });

    // Set up the Intersection Observer for home page items
    const observer = new IntersectionObserver((entries) => {
        // console.log(entries);
        if (entries[0].isIntersecting && !isFetching) {
            start += limit;
            fetchSellerItems(start, limit);
        }
    }, { threshold: 0.5 });

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


    function fetchSellerItems(start, limit) {
        if (isFetching) return;
        isFetching = true;

                fetch(`/api/get_seller_items_admin?chat_id=${seller_chat_id}&start=${start}&limit=${limit}`)
                    .then(response => response.json())
                    .then(items => {
                        items.sort((a, b) => b.reported - a.reported);

                        if (items.length === 0 && start === 0) {
                            // console.log("No favorites found.");
                            isFetching = false;
                            showNotification('No items listed by this user!', 'error');
                            loadingIndicator.style.display = 'none';
                            // alert("No items in favorite!");
                            return;
                        } else if (items.length === 0 && start !== 0) {
                            isFetching = false;
                            showNotification('No more new items by this user!', 'error');
                            loadingIndicator.style.display = 'none';
                        }

                        // console.log(items);  // Log the items to check the structure
                        const itemsList = document.querySelector('.items-list');

                        if (start === 0) {
                            // Clear existing items in case this is a refresh
                            itemsList.innerHTML = '';
                        }

                        // Loop through each item and add to the DOM
                        items.forEach(item => {

                            const itemBox = document.createElement('div');
                            itemBox.classList.add('item-box');

                            // Set the data-id attribute with the item's unique identifier
                            itemBox.setAttribute('data-id', item.id);
                            item.reported > 0 ? itemBox.setAttribute('reported', true) : itemBox.setAttribute('reported', false);

                            // Split the item pictures and create an array of image URLs
                            const images = item.item_pic.split(',');

                            // Determine if the item is boosted
                            const isBoosted = item.boosted === 'yep';
                            isBoosted && itemBox.classList.add('boosted');

                            const itemDate = calculateDaysAgo(item.item_date);

                            // New layout with image on the left, text in the middle, and remove button on the right
                            itemBox.innerHTML = `
                    <div class="item-content">
                        <img src="${images[0]}" alt="${item.item_name}" class="item-image">
                        ${isBoosted ? `
                                    <div class="boost-badge">
                                        <i class="fas fa-star"></i>
                                        <i class="fas fa-fire"></i>
                                    </div>
                        ` : ''}
                        <div class="item-details">
                            <p class="item-title">${item.item_name}</p>
                            ${item.new_item_price ? `<p class="item-price"><strong>ETB ${Number(item.new_item_price).toLocaleString()}</strong></p>` : `<p class="item-price"><strong>ETB ${Number(item.item_price).toLocaleString()}</strong></p>`}
                            <p class="item-description">${item.item_description}</p>
                            <div class="item-poster-details">
                                <span><i class="fas fa-user"></i>: ${posted_by}</span>
                                <span><i class="fas fa-map-marker-alt"></i>: ${item.item_city}</span>
                                <span><i class="fas fa-calendar-alt"></i>: ${itemDate}</span>
                            </div> 
                        </div>
                    </div>
                `;

                            // Add a click event listener to the item box
                            itemBox.addEventListener('click', function () {
                                const itemId = this.getAttribute('data-id');
                                const reported = this.getAttribute('reported');
                                console.log('Item ID:', itemId);
                                if (itemId) {
                                    window.location.href = `admin_item-details.html?id=${itemId}&reported=${reported}&chat_id=${seller_chat_id}&token=${token}`;
                                } else {
                                    //console.error('Item ID is undefined');
                                    showNotification('Try again!','error');
                                }
                            });

                            if (item.reported > 0) itemBox.style.backgroundColor = 'rgba(255,0,49,0.15)';

                            // Append the item box to the list
                            itemsList.appendChild(itemBox);
                            isFetching = false;
                            loadingIndicator.style.display = 'block';
                            // itemsList.appendChild(loadingIndicator);
                        });
                        // Observe the loading indicator
                        observer.observe(loadingIndicator);
                    })
                    .catch(error => {
                        //console.error('Error fetching items:', error);
                        showNotification('No items!', 'error');
                    });

    }

});