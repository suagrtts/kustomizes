// Authentication state management
let isLoggedIn = false;

// Initialize auth state
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
});

// Check authentication state
function checkLoginState() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Login function
function login(username, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'homepage.html';
        return true;
    }
    return false;
}

// Logout function
function logout() {
    // Clear all user-specific data
    const itemsToClear = [
        'isLoggedIn',
        'currentUser',
        'cart',
        'favorites',
        'orderHistory',
        'selectedCategory',
        'userEmail',
        'userName'
    ];
    
    itemsToClear.forEach(item => localStorage.removeItem(item));
    
    // Reset UI elements
    const cartCount = document.querySelector('.cart-count');
    const favoritesCount = document.querySelector('.favorites-count');
    if (cartCount) cartCount.textContent = '0';
    if (favoritesCount) favoritesCount.textContent = '0';
    
    // Close dropdown if open
    const dropdownContent = document.querySelector('.profile-dropdown-content');
    if (dropdownContent) {
        dropdownContent.classList.remove('show');
    }
    
    // Redirect to login
    window.location.replace('login.html');
}

// Register function
function register(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username exists
    if (users.some(u => u.username === userData.username)) {
        return { success: false, message: 'Username already exists' };
    }
    
    // Check if email exists
    if (users.some(u => u.email === userData.email)) {
        return { success: false, message: 'Email already registered' };
    }
    
    // Add new user
    users.push({
        ...userData,
        id: Date.now(), // Simple way to generate unique ID
        joined: new Date().toISOString()
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'Registration successful' };
}

// Reset password
function resetPassword(email, newPassword) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
        return { success: false, message: 'Email not found' };
    }
    
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'Password reset successful' };
}

// Check authentication state and redirect if needed
function checkAuthState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPath = window.location.pathname;
    const publicPages = ['/login.html', '/signup.html', '/forgotpassword.html', '/index.html'];
    const isPublicPage = publicPages.some(page => 
        currentPath.toLowerCase().endsWith(page.toLowerCase())
    );
    
    if (!isLoggedIn && !isPublicPage) {
        window.location.replace('login.html');
    } else if (isLoggedIn && isPublicPage && !currentPath.toLowerCase().endsWith('/index.html')) {
        window.location.replace('homepage.html');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}