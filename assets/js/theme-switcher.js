/**
 * Theme Switcher for GameSprint
 *
 * Provides light/dark theme switching functionality that works with
 * multilingual support and maintains user preferences.
 */

// Theme constants
const THEME_KEY = 'gamesprint_theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initializeThemeSwitcher();
});

/**
 * Initialize the theme switcher component
 */
function initializeThemeSwitcher() {
    // Create the theme toggle button if it doesn't exist
    createThemeToggleButton();

    // Set initial theme from user preferences
    setInitialTheme();

    // Update theme toggle icon based on current theme
    updateThemeToggleIcon();
}

/**
 * Create the theme toggle button and add it to the page
 */
function createThemeToggleButton() {
    // Check if button already exists
    if (document.querySelector('.theme-toggle')) return;

    // Create button element
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    themeToggle.innerHTML = '<span class="icon"><i class="fas fa-moon"></i></span>';

    // Add click event listener
    themeToggle.addEventListener('click', toggleTheme);

    // Add to the body
    document.body.appendChild(themeToggle);
}

/**
 * Set the initial theme based on user preference or system preference
 */
function setInitialTheme() {
    // Check if theme preference is stored
    const storedTheme = localStorage.getItem(THEME_KEY);

    if (storedTheme) {
        // Use stored preference
        applyTheme(storedTheme);
    } else {
        // Check for system preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = prefersDarkScheme ? DARK_THEME : LIGHT_THEME;

        // Apply and save the default theme
        applyTheme(defaultTheme);
        localStorage.setItem(THEME_KEY, defaultTheme);
    }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('light-theme') ? LIGHT_THEME : DARK_THEME;
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

    // Apply and save the new theme
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);

    // Update the toggle button icon
    updateThemeToggleIcon();

    // Show a notification about the theme change
    showThemeChangeNotification(newTheme);
}

/**
 * Apply the specified theme to the document
 * @param {string} theme - The theme to apply ('light' or 'dark')
 */
function applyTheme(theme) {
    if (theme === LIGHT_THEME) {
        document.documentElement.classList.add('light-theme');
    } else {
        document.documentElement.classList.remove('light-theme');
    }
}

/**
 * Update the theme toggle icon based on the current theme
 */
function updateThemeToggleIcon() {
    const iconElement = document.querySelector('.theme-toggle .icon i');
    if (!iconElement) return;

    const isLightTheme = document.documentElement.classList.contains('light-theme');

    // Change icon based on current theme
    if (isLightTheme) {
        iconElement.className = 'fas fa-sun';
    } else {
        iconElement.className = 'fas fa-moon';
    }
}

/**
 * Show a notification about the theme change
 * @param {string} theme - The new theme
 */
function showThemeChangeNotification(theme) {
    // Check if the language indicator exists (used in our multilingual support)
    const langIndicator = document.getElementById('languageIndicator');
    if (!langIndicator) return;

    // Create a clone of the language indicator for theme notification
    const themeNotification = langIndicator.cloneNode(true);
    themeNotification.id = 'themeNotification';
    themeNotification.className = 'language-indicator';

    // Set the notification text based on theme
    if (theme === LIGHT_THEME) {
        themeNotification.textContent = '☀️ Light Theme';
    } else {
        themeNotification.textContent = '🌙 Dark Theme';
    }

    // Add to the body
    document.body.appendChild(themeNotification);

    // Show the notification
    setTimeout(() => {
        themeNotification.classList.add('show');
    }, 100);

    // Hide and remove after a delay
    setTimeout(() => {
        themeNotification.classList.remove('show');
        setTimeout(() => {
            themeNotification.remove();
        }, 300);
    }, 3000);
}
