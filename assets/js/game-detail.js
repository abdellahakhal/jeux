// Global variables for user state
let isLoggedIn = false;
let currentUser = null;

// DOM Elements
const loginModal = document.getElementById('loginModal');
const loginRequiredElements = document.querySelectorAll('.login-required');
const loginMessages = document.querySelectorAll('.login-message');
const starRatingElements = document.querySelectorAll('.star-rating i');
const reviewForm = document.getElementById('reviewForm');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

// Check login status on page load - Simulating a backend check
document.addEventListener('DOMContentLoaded', () => {
    // This would normally be a fetch to the backend to check login status
    checkLoginStatus();

    // Show or hide login messages based on login status
    updateLoginElements();

    // Initialize star rating
    initializeStarRating();

    // Add event listeners for review form if it exists
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }
});

/**
 * Check if user is logged in - Simulated function
 * In a real app, this would check cookies/localStorage and validate with the backend
 */
function checkLoginStatus() {
    // For demo purposes, let's check localStorage for a saved login
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            isLoggedIn = true;
        } catch (error) {
            console.error('Error parsing saved user data', error);
            // Clear invalid data
            localStorage.removeItem('currentUser');
            isLoggedIn = false;
            currentUser = null;
        }
    }
}

/**
 * Update UI elements based on login status
 */
function updateLoginElements() {
    // Show/hide login required messages
    loginMessages.forEach(message => {
        message.style.display = isLoggedIn ? 'none' : 'flex';
    });

    // Add event listeners to login-required elements
    loginRequiredElements.forEach(element => {
        // If clicking a form, we don't need to add a click handler
        if (element.tagName === 'FORM') return;

        element.addEventListener('click', (e) => {
            if (!isLoggedIn) {
                e.preventDefault();
                showLoginModal();
                return false;
            }
        });
    });
}

/**
 * Show the login modal
 */
function showLoginModal() {
    loginModal.classList.add('show');

    // Add close event to the modal close button
    const closeBtn = loginModal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        loginModal.classList.remove('show');
    });

    // Close modal when clicking outside
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('show');
        }
    });
}

/**
 * Initialize star rating functionality
 */
function initializeStarRating() {
    if (!starRatingElements.length) return;

    // Set initial rating (all stars active)
    starRatingElements.forEach(star => {
        star.classList.add('active');
    });

    // Add event listeners to stars
    starRatingElements.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            document.getElementById('selected-rating').value = rating;

            // Update visual stars
            starRatingElements.forEach(s => {
                const sRating = parseInt(s.getAttribute('data-rating'));
                if (sRating <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });

        // Hover effects
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.getAttribute('data-rating'));

            starRatingElements.forEach(s => {
                const sRating = parseInt(s.getAttribute('data-rating'));
                if (sRating <= rating) {
                    s.classList.add('hover');
                } else {
                    s.classList.remove('hover');
                }
            });
        });
    });

    // Remove hover effect when mouse leaves the rating container
    const starRating = document.querySelector('.star-rating');
    if (starRating) {
        starRating.addEventListener('mouseleave', () => {
            starRatingElements.forEach(s => {
                s.classList.remove('hover');
            });
        });
    }
}

/**
 * Handle review form submission
 */
function handleReviewSubmit(e) {
    e.preventDefault();

    if (!isLoggedIn) {
        showLoginModal();
        return false;
    }

    // Get form values
    const rating = document.getElementById('selected-rating').value;
    const title = document.getElementById('review-title').value;
    const content = document.getElementById('review-content').value;

    // Validate
    if (!title || !content) {
        showNotification('error', 'Please fill out all fields in the review form');
        return;
    }

    // Prepare review data
    const reviewData = {
        rating,
        title,
        content,
        userId: currentUser.id,
        username: currentUser.username,
        date: new Date().toISOString()
    };

    // This would normally send data to the backend
    console.log('Review submitted:', reviewData);

    // Show success message
    showNotification('success', 'Your review has been submitted successfully!');

    // Reset form
    reviewForm.reset();

    // In a real app, we would then refresh the reviews or add the new one to the list
    // For demo purposes, let's simulate adding the review
    addReviewToList(reviewData);
}

/**
 * Add a new review to the review list - Demo function
 */
function addReviewToList(review) {
    const reviewList = document.querySelector('.review-list');
    if (!reviewList) return;

    // Create new review element
    const reviewElement = document.createElement('div');
    reviewElement.classList.add('review-item');

    // Format date
    const date = new Date(review.date);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    // Create stars HTML
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= review.rating) {
            starsHtml += '★';
        } else {
            starsHtml += '☆';
        }
    }

    // Set review HTML
    reviewElement.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <div class="reviewer-avatar">
                    <img src="https://ui-avatars.com/api/?name=${review.username}&background=random" alt="${review.username}">
                </div>
                <div>
                    <div class="reviewer-name">${review.username}</div>
                    <div class="review-date">${formattedDate}</div>
                </div>
            </div>
            <div class="review-rating">${starsHtml}</div>
        </div>
        <div class="review-content">
            <h4>${review.title}</h4>
            <p>${review.content}</p>
        </div>
        <div class="review-actions">
            <button><i class="fas fa-thumbs-up"></i> Helpful</button>
            <button><i class="fas fa-flag"></i> Report</button>
        </div>
    `;

    // Add to the list (at the top)
    reviewList.insertBefore(reviewElement, reviewList.firstChild);

    // Update review count and stats
    updateReviewStats(parseInt(review.rating));
}

/**
 * Update review statistics - Demo function
 */
function updateReviewStats(rating) {
    // In a real app, this would recalculate the stats based on all reviews
    // For this demo, we'll just increment the count and adjust the rating slightly

    const totalReviewsElement = document.querySelector('.total-reviews');
    if (totalReviewsElement) {
        const currentCount = parseInt(totalReviewsElement.textContent.match(/\d+/)[0]);
        totalReviewsElement.textContent = `Based on ${currentCount + 1} reviews`;
    }

    // This would be more complex in a real app
    const ratingNumberElement = document.querySelector('.rating-number');
    if (ratingNumberElement) {
        const currentRating = parseFloat(ratingNumberElement.textContent);
        // Simple weighted average (heavily weighted to existing rating for demo)
        const newRating = ((currentRating * 20) + rating) / 21;
        ratingNumberElement.textContent = newRating.toFixed(1);
    }
}

/**
 * Show a notification toast
 * @param {string} type - 'success', 'error', 'info', 'warning'
 * @param {string} message - The message to display
 */
function showNotification(type, message) {
    // Set icon based on type
    const notificationIcon = notification.querySelector('.notification-icon');
    switch (type) {
        case 'success':
            notificationIcon.className = 'notification-icon fas fa-check-circle';
            notification.style.background = 'rgba(76, 209, 55, 0.9)';
            break;
        case 'error':
            notificationIcon.className = 'notification-icon fas fa-exclamation-circle';
            notification.style.background = 'rgba(255, 71, 87, 0.9)';
            break;
        case 'warning':
            notificationIcon.className = 'notification-icon fas fa-exclamation-triangle';
            notification.style.background = 'rgba(255, 165, 2, 0.9)';
            break;
        case 'info':
        default:
            notificationIcon.className = 'notification-icon fas fa-info-circle';
            notification.style.background = 'rgba(74, 57, 239, 0.9)';
    }

    // Set message
    notificationText.textContent = message;

    // Show notification
    notification.classList.add('show');

    // Add click event to close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
    });

    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

/**
 * Handle download button clicks - Shows notification and simulates download
 * @param {string} type - 'free' or 'premium'
 */
function showDownloadNotification(type = 'free') {
    if (type === 'premium' && !isLoggedIn) {
        showLoginModal();
        return;
    }

    const gameTitle = document.querySelector('.hero h1 .accent').textContent;

    if (type === 'premium') {
        showNotification('info', `Preparing your premium download for ${gameTitle}...`);
        // In a real app, this would redirect to payment processing
        setTimeout(() => {
            window.location.href = `payment.html?game=${encodeURIComponent(gameTitle)}`;
        }, 1500);
    } else {
        showNotification('success', `Downloading ${gameTitle} - Free Version. Thank you for using our service!`);
        // Simulate file download - in a real app this would trigger the download
        setTimeout(() => {
            // Create a fake download link
            const downloadLink = document.createElement('a');
            downloadLink.href = '#';
            downloadLink.download = `${gameTitle.replace(/\s+/g, '-').toLowerCase()}-mod.apk`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }, 2000);
    }

    // Log download (this would normally be a backend API call)
    console.log(`Download requested: ${gameTitle} - ${type} version`);

    return false; // Prevent default link behavior
}
