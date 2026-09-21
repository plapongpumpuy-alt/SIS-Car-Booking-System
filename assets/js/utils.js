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
 * Converts any date representation (ISO, Date, string) to YYYY-MM-DD in Bangkok (+07:00) timezone
 * @param {string|Date} val - date string or Date object
 * @returns {string|null} YYYY-MM-DD or null
 */
function toBangkokYMD(val) {
    if (!val || val === '-') return null;
    if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val.trim())) return val.trim();
    try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return null;
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(d);
    } catch(e) {
        return null;
    }
}
