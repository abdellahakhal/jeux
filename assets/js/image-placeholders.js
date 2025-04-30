/**
 * Image Placeholder Generator
 *
 * This script creates placeholder images for games if external images fail to load.
 * It uses HTML canvas to generate colorful placeholders with the game name.
 */

// Create placeholder images for game cards when external images fail to load
document.addEventListener('DOMContentLoaded', function() {
    // Find all game images
    const gameImages = document.querySelectorAll('.game-image img, .hero-image img, .screenshot-item img');

    // Add error handler to each image
    gameImages.forEach(img => {
        img.addEventListener('error', function() {
            // Get game title from closest .game-card or parent elements
            let gameTitle = '';

            // Try to find the title from parent elements
            if (this.closest('.game-card')) {
                const titleElement = this.closest('.game-card').querySelector('.game-title');
                if (titleElement) {
                    gameTitle = titleElement.textContent;
                }
            } else if (this.closest('.hero')) {
                const titleElement = this.closest('.hero').querySelector('h1 .accent, h1 span, h1');
                if (titleElement) {
                    gameTitle = titleElement.textContent;
                }
            } else if (this.alt) {
                gameTitle = this.alt;
            }

            // Create a placeholder image
            createPlaceholderImage(this, gameTitle);
        });
    });
});

/**
 * Creates a placeholder image using canvas and replaces the broken image
 * @param {HTMLImageElement} imgElement - The image element to replace
 * @param {string} text - Text to display on the placeholder
 */
function createPlaceholderImage(imgElement, text) {
    // Get natural dimensions of the image element
    const width = imgElement.naturalWidth || imgElement.width || 300;
    const height = imgElement.naturalHeight || imgElement.height || 200;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Generate a gradient background based on the text
    const hashCode = text.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    // Create a background gradient
    const hue1 = Math.abs(hashCode) % 360;
    const hue2 = (hue1 + 40) % 360;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `hsl(${hue1}, 70%, 30%)`);
    gradient.addColorStop(1, `hsl(${hue2}, 80%, 20%)`);

    // Fill the background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add a pattern to the background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    const patternSize = 20;
    for (let x = 0; x < width; x += patternSize) {
        for (let y = 0; y < height; y += patternSize) {
            if ((x + y) % (patternSize * 2) === 0) {
                ctx.fillRect(x, y, patternSize, patternSize);
            }
        }
    }

    // Prepare text
    const fontSize = Math.min(width, height) * 0.15;
    ctx.font = `bold ${fontSize}px Poppins, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Add text shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillText(text, width / 2 + 2, height / 2 + 2);

    // Add text
    ctx.fillStyle = 'white';
    ctx.fillText(text, width / 2, height / 2);

    // Add a game controller icon
    drawGameIcon(ctx, width / 2, height * 0.75, fontSize);

    // Convert canvas to data URL and set as source
    imgElement.src = canvas.toDataURL('image/png');
}

/**
 * Draws a simple game controller icon
 */
function drawGameIcon(ctx, x, y, size) {
    const iconSize = size * 0.8;

    // Draw controller body
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

    // D-pad
    ctx.beginPath();
    ctx.arc(x - iconSize/2, y, iconSize/6, 0, 2 * Math.PI);
    ctx.fill();

    // Action buttons
    ctx.beginPath();
    ctx.arc(x + iconSize/2, y, iconSize/6, 0, 2 * Math.PI);
    ctx.fill();
}
