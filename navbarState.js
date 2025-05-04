// Update navbar based on authentication state
function updateNavbar() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const cartLink = document.querySelector('.cart-icon');
    const favoritesLink = document.querySelector('.favorites-icon');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileButton = document.querySelector('.profile');
    
    if (isLoggedIn && currentUser) {
        // Show cart and favorites links
        if (cartLink) {
            cartLink.style.display = 'inline-block';
            cartLink.setAttribute('aria-label', 'View shopping cart');
        }
        if (favoritesLink) {
            favoritesLink.style.display = 'inline-block';
            favoritesLink.setAttribute('aria-label', 'View favorites');
        }
        
        // Show and update profile dropdown
        if (profileDropdown) {
            profileDropdown.style.display = 'block';
            if (profileButton) {
                profileButton.setAttribute('aria-haspopup', 'true');
                profileButton.setAttribute('aria-expanded', 'false');
            }
        }

        // Update counts
        updateCounts();
    } else {
        // Hide authenticated-only elements
        if (cartLink) cartLink.style.display = 'none';
        if (favoritesLink) favoritesLink.style.display = 'none';
        if (profileDropdown) profileDropdown.style.display = 'none';
        
        // Check if we're on a protected page
        const protectedPages = ['cart.html', 'favorites.html', 'profile.html', 'homepage.html'];
        const currentPath = window.location.pathname;
        
        if (protectedPages.some(page => currentPath.toLowerCase().endsWith(page.toLowerCase()))) {
            window.location.replace('login.html');
        }
    }
}

// Update cart and favorites count
function updateCounts() {
    const cartCount = document.querySelector('.cart-count');
    const favoritesCount = document.querySelector('.favorites-count');
    
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
        cartCount.setAttribute('aria-label', `${count} items in cart`);
    }
    
    if (favoritesCount) {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesCount.textContent = favorites.length;
        favoritesCount.setAttribute('aria-label', `${favorites.length} items in favorites`);
    }
}

// Initialize navbar state when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    initializeDropdown();
    
    // Listen for storage changes
    window.addEventListener('storage', (e) => {
        if (['cart', 'favorites', 'isLoggedIn', 'currentUser'].includes(e.key)) {
            updateNavbar();
        }
    });
});

// Initialize dropdown functionality if not already defined
if (typeof initializeDropdown !== 'function') {
    function initializeDropdown() {
        const profileDropdown = document.querySelector('.profile-dropdown');
        const dropdownContent = document.querySelector('.profile-dropdown-content');
        const profileButton = document.querySelector('.profile');

        if (!profileDropdown || !dropdownContent || !profileButton) return;

        profileButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isExpanded = dropdownContent.classList.contains('show');
            dropdownContent.classList.toggle('show');
            profileButton.setAttribute('aria-expanded', !isExpanded);
        });

        document.addEventListener('click', function(e) {
            if (!profileDropdown.contains(e.target)) {
                dropdownContent.classList.remove('show');
                profileButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
}