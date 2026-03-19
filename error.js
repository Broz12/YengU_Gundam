class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

function handleError(err) {
    console.error(`Error: ${err.message}`);
    // Additional logic for handling errors (e.g. logging to a server)
}

function showUserNotification(message) {
    alert(message);  // Replace with proper UI notification in production
}

function retryWithBackoff(fn, retries = 3, delay = 1000) {
    return new Promise((resolve, reject) => {
        fn()
            .then(resolve)
            .catch((error) => {
                if (retries <= 0) {
                    reject(error);
                    return;
                }
                setTimeout(() => {
                    retryWithBackoff(fn, retries - 1, delay * 2)
                        .then(resolve)
                        .catch(reject);
                }, delay);
            });
    });
}

// Exporting the utilities
module.exports = {
    AppError,
    handleError,
    showUserNotification,
    retryWithBackoff
};