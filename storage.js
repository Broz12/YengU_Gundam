// storage.js - Local Storage Management Utilities

/**
 * Set an item in local storage.
 * @param {string} key - The key of the item.
 * @param {any} value - The value to be stored.
 */
function setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Get an item from local storage.
 * @param {string} key - The key of the item.
 * @returns {any} - The retrieved value.
 */
function getItem(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

/**
 * Remove an item from local storage.
 * @param {string} key - The key of the item to remove.
 */
function removeItem(key) {
    localStorage.removeItem(key);
}

/**
 * Clear all items from local storage.
 */
function clearStorage() {
    localStorage.clear();
}

/**
 * Get user data from local storage.
 * @returns {object|null} - The user data.
 */
function getUserData() {
    return getItem('userData');
}

/**
 * Set user data in local storage.
 * @param {object} data - The user data to store.
 */
function setUserData(data) {
    setItem('userData', data);
}

/**
 * Get auth token from local storage.
 * @returns {string|null} - The auth token.
 */
function getAuthToken() {
    return getItem('authToken');
}

/**
 * Set auth token in local storage.
 * @param {string} token - The auth token to store.
 */
function setAuthToken(token) {
    setItem('authToken', token);
}

/**
 * Remove auth token from local storage.
 */
function removeAuthToken() {
    removeItem('authToken');
}