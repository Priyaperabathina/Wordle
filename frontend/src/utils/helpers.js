// Utility functions for the Wordle application

/**
 * Validates if a string is a valid 5-letter word
 * @param {string} word - The word to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidWord = (word) => {
    return word && typeof word === 'string' && word.length === 5 && /^[A-Z]+$/.test(word);
};

/**
 * Formats a date to a readable string
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Calculates win rate percentage
 * @param {number} wins - Number of wins
 * @param {number} total - Total number of games
 * @returns {number} - Win rate percentage
 */
export const calculateWinRate = (wins, total) => {
    if (total === 0) return 0;
    return Math.round((wins / total) * 100);
};

/**
 * Generates a random color for charts/graphs
 * @returns {string} - Hex color code
 */
export const getRandomColor = () => {
    const colors = [
        '#6aaa64', // Wordle green
        '#c9b458', // Wordle yellow
        '#787c7e', // Wordle gray
        '#3a3a3c', // Dark gray
        '#538d4e', // Dark green
        '#b59f3b', // Dark yellow
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Converts array of objects to CSV string
 * @param {Array} data - Array of objects
 * @param {Array} headers - Array of header names
 * @returns {string} - CSV string
 */
export const arrayToCSV = (data, headers = null) => {
    if (!data || data.length === 0) return '';

    const csvHeaders = headers || Object.keys(data[0]);
    const csvContent = [
        csvHeaders.join(','),
        ...data.map(row => csvHeaders.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    return csvContent;
};

/**
 * Downloads a file with the given content and filename
 * @param {string} content - File content
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type (default: text/csv)
 */
export const downloadFile = (content, filename, mimeType = 'text/csv') => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

/**
 * Gets the appropriate color for game status
 * @param {string} status - Game status
 * @returns {string} - Color name
 */
export const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
        case 'WON':
            return 'success';
        case 'LOST':
            return 'error';
        case 'PLAYING':
            return 'info';
        default:
            return 'default';
    }
};

/**
 * Formats duration in minutes to a readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} - Formatted duration string
 */
export const formatDuration = (minutes) => {
    if (!minutes || minutes < 0) return 'N/A';

    if (minutes < 1) {
        return '< 1 min';
    } else if (minutes < 60) {
        return `${Math.round(minutes)} min`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.round(minutes % 60);
        return `${hours}h ${remainingMinutes}m`;
    }
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, message: 'Password is required' };
    }

    if (password.length < 8) {
        return { isValid: false, message: 'Password must be at least 8 characters long' };
    }

    if (!/(?=.*[a-z])/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!/(?=.*\d)/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one number' };
    }

    return { isValid: true, message: 'Password is valid' };
};

/**
 * Validates username
 * @param {string} username - Username to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validateUsername = (username) => {
    if (!username) {
        return { isValid: false, message: 'Username is required' };
    }

    if (username.length < 5) {
        return { isValid: false, message: 'Username must be at least 5 characters long' };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }

    return { isValid: true, message: 'Username is valid' };
};

