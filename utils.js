// Utility functions for error handling, validation, and formatting

// Error handling function
function handleError(error) {
    console.error('Error:', error);
    // Additional error handling logic here
}

// Validation function
function validateInput(input) {
    // Add validation logic here
    return input !== null && input !== undefined;
}

// Formatting function
function formatDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

module.exports = { handleError, validateInput, formatDate };