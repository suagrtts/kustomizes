// Load cart and favorites count when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCounts();
    initializeFeaturedCards();
    initializeDropdown();
});

// Update cart and favorites count
function updateCounts() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = cartCount;
    document.querySelector('.favorites-count').textContent = favorites.length;
}

// Initialize featured cards click handlers
function initializeFeaturedCards() {
    document.querySelectorAll('.featured-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            localStorage.setItem('selectedCategory', category);
            window.location.href = 'homepage.html';
        });

        // Add hover effect cursor
        card.style.cursor = 'pointer';
    });
}

// Initialize dropdown menu functionality
function initializeDropdown() {
    const profileDropdown = document.querySelector('.profile-dropdown');
    const dropdownContent = document.querySelector('.profile-dropdown-content');
    const profileButton = document.querySelector('.profile');

    if (!profileDropdown || !dropdownContent || !profileButton) return;

    // Toggle dropdown on profile click
    profileButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!profileDropdown.contains(e.target)) {
            dropdownContent.classList.remove('show');
        }
    });
}

// Logout functionality
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
}