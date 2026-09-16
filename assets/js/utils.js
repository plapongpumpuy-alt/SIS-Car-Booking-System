// utils.js

/**
 * Generates a random booking ID
 * @returns {string} e.g. BK-20260915-ABCD
 */
function generateBookingId() {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    // Generate 4 random alphanumeric characters
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    return `BK-${yyyy}${mm}${dd}-${randomChars}`;
}

/**
 * Format datetime to Thai readable format
 * @param {string} datetimeStr - ISO Datetime string
 * @returns {string} Formatted string
 */
function formatDateTimeTH(datetimeStr) {
    if (!datetimeStr) return '-';
    
    const date = new Date(datetimeStr);
    
    // Check if valid date
    if (isNaN(date.getTime())) return '-';

    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return date.toLocaleDateString('th-TH', options);
}

/**
 * Get current datetime in local timezone format for input[type="datetime-local"] min attribute
 * @returns {string} e.g. "2026-09-15T16:20"
 */
function getCurrentDateTimeLocal() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
}
