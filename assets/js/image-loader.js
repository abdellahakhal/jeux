/**
 * Advanced Image Loading System
 *
 * This script enhances image loading with:
 * - Skeleton loading placeholders
 * - Lazy loading
 * - Error handling with backup images
 * - IntersectionObserver for performance
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    setupImageLoading();
});

/**
 * Sets up enhanced image loading for the entire site
 */
function setupImageLoading() {
    // Find all game images that need enhancement
    const targetImages = document.querySelectorAll('.game-image img, .hero-image img, .screenshot-item img');

    // Process each image
    targetImages.forEach(img => {
        enhanceImage(img);
    });

    // Set up lazy loading with IntersectionObserver
    setupLazyLoading();
}

/**
 * Enhances an image with loading states and error handling
 * @param {HTMLImageElement} img - The image element to enhance
 */
function enhanceImage(img) {
    // Skip if already processed
    if (img.dataset.enhanced) return;
    img.dataset.enhanced = "true";

    // Store original src
    const originalSrc = img.src;
    img.dataset.originalSrc = originalSrc;

    // Create a container for the image if it doesn't exist
    let container = img.parentElement;
    if (!container.classList.contains('image-container')) {
        // Create new container
        container = document.createElement('div');
        container.className = 'image-container';

        // Create placeholder content
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder-content';
        placeholder.innerHTML = `
            <div class="icon"><i class="fas fa-image"></i></div>
            <div class="title">${img.alt || 'Game Image'}</div>
            <div class="message">Image could not be loaded</div>
        `;

        // Insert the container
        img.parentNode.insertBefore(container, img);
        container.appendChild(img);
        container.appendChild(placeholder);
    }

    // Set up loading and error events
    img.onload = function() {
        container.classList.add('loaded');
    };

    img.onerror = function() {
        container.classList.add('error');

        // Try to generate a better placeholder using the canvas approach
        if (window.createPlaceholderImage) {
            createPlaceholderImage(img, img.alt || 'Game Image');
        }
    };

    // Set as lazy loaded
    img.loading = 'lazy';

    // Mark as ready for intersection observer
    img.dataset.lazySrc = originalSrc;
    img.src = ''; // Clear source to prevent immediate loading
}

/**
 * Sets up lazy loading with IntersectionObserver
 */
function setupLazyLoading() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('img[data-lazy-src]').forEach(img => {
            img.src = img.dataset.lazySrc;
        });
        return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.lazySrc;
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '100px', // Load images when they are 100px from viewport
        threshold: 0.1 // Load when at least 10% of the image is visible
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-lazy-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Preloads critical images for faster rendering
 * @param {string[]} urls - Array of image URLs to preload
 */
function preloadCriticalImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Preload important assets
preloadCriticalImages([
    'assets/images/gamesprint-logo.svg',
    'assets/images/8ball-logo.png',
    'assets/images/gta5-logo.jpg',
    'assets/images/coc-logo.png'
]);
