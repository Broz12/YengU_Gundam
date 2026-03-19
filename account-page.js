// account-page.js

// Manage account page sections
class AccountPage {
    constructor() {
        this.sections = document.querySelectorAll('.account-section');
        this.form = document.querySelector('#account-form');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showSection('profile'); // Default section
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleFormSubmission();
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                const targetSection = event.target.dataset.target;
                this.showSection(targetSection);
            });
        });
    }

    showSection(sectionId) {
        this.sections.forEach(section => {
            section.style.display = section.id === sectionId ? 'block' : 'none';
        });
    }

    handleFormSubmission() {
        const formData = new FormData(this.form);
        // Process form data (e.g., send to server)
        console.log('Form submitted', Object.fromEntries(formData.entries()));
    }
}

// Initialize the account page logic
document.addEventListener('DOMContentLoaded', () => {
    new AccountPage();
});