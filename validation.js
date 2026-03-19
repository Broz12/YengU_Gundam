// form validation utilities

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validateRequired(value) {
    return value.trim() !== '';
}

function validatePhoneNumber(phone) {
    const re = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return re.test(String(phone));
}

module.exports = { validateEmail, validateRequired, validatePhoneNumber };