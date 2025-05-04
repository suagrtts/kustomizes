// Product data from homepagefunctions.js
let product = null;

// DOM Elements
const productImage = document.getElementById('productImage');
const productName = document.getElementById('productName');
const currentPrice = document.getElementById('currentPrice');
const originalPrice = document.getElementById('originalPrice');
const discount = document.getElementById('discount');
const productBrand = document.getElementById('productBrand');
const productStyle = document.getElementById('productStyle');
const productDescription = document.getElementById('productDescription');
const sizeOptions = document.getElementById('sizeOptions');
const addToCartBtn = document.getElementById('addToCart');
const addToWishlistBtn = document.getElementById('addToWishlist');

// Size options
const sizes = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];

// Check authentication state
function checkLoginState() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Show login prompt
function showLoginPrompt() {
    alert('Please log in to use this feature');
    window.location.href = 'login.html';
}

// Initialize the page
function initializeProductPage() {
    setProductDetails();
    initializeEventListeners();
    updateCartCount();
    updateFavoritesCount();
}

// Set product details
function setProductDetails() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // Find the product in the products array
    product = products.find(p => p.id === productId);

    if (!product) {
        showError('Product not found');
        return;
    }

    // Update page title
    document.title = `${product.name} - Nike Store`;

    // Update product details
    productImage.src = product.image;
    productImage.alt = product.name;
    productName.textContent = product.name;
    currentPrice.textContent = formatPrice(product.price);
    originalPrice.textContent = formatPrice(product.originalPrice);
    discount.textContent = `${product.discount}% OFF`;
    productBrand.textContent = product.brand;
    productStyle.textContent = product.style;
    productDescription.textContent = product.description;

    // Create size options
    createSizeOptions();

    // Set up size and color options if they exist
    const sizeBtns = document.querySelectorAll('.size-option');
    const colorOptions = document.querySelectorAll('.color-option');

    if (sizeBtns.length) {
        sizeBtns[0].classList.add('selected');
    }

    if (colorOptions.length) {
        colorOptions[0].classList.add('selected');
    }
}

// Create size options
function createSizeOptions() {
    sizeOptions.innerHTML = '';
    sizes.forEach(size => {
        const sizeBtn = document.createElement('button');
        sizeBtn.className = 'size-option';
        sizeBtn.textContent = size;
        sizeBtn.addEventListener('click', () => selectSize(sizeBtn));
        sizeOptions.appendChild(sizeBtn);
    });
}

// Handle size selection
function selectSize(selectedBtn) {
    const sizeBtns = document.querySelectorAll('.size-option');
    sizeBtns.forEach(btn => btn.classList.remove('selected'));
    selectedBtn.classList.add('selected');
    addToCartBtn.disabled = false;
}

// Initialize event listeners
function initializeEventListeners() {
    // Add to cart
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (!checkLoginState()) {
                showLoginPrompt();
                return;
            }

            const selectedSize = document.querySelector('.size-option.selected');
            if (!selectedSize) {
                showError('Please select a size');
                return;
            }

            const quantityInput = document.getElementById('quantity');
            const quantity = parseInt(quantityInput.value) || 1;

            addToCart(product, quantity, selectedSize.textContent);
        });
    }

    // Add to wishlist
    const addToWishlistBtn = document.querySelector('.favorite-btn');
    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', () => {
            if (!checkLoginState()) {
                showLoginPrompt();
                return;
            }
            toggleFavorite(product);
        });
    }

    // Check if product is in wishlist
    checkFavoriteStatus(product.id);
}

// Update quantity
function updateQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let newValue = parseInt(quantityInput.value) + change;
    newValue = Math.max(1, Math.min(10, newValue));
    quantityInput.value = newValue;
}

// Validate quantity input
function validateQuantity(input) {
    const value = parseInt(input.value);
    if (isNaN(value) || value < 1) {
        input.value = 1;
    } else if (value > 10) {
        input.value = 10;
    }
}

// Add to cart functionality
function addToCart(product, quantity, size) {
    if (!checkLoginState()) {
        showLoginPrompt();
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        size: size
    };

    const existingItemIndex = cart.findIndex(item => 
        item.id === product.id && item.size === size
    );

    if (existingItemIndex !== -1) {
        const newQuantity = cart[existingItemIndex].quantity + quantity;
        if (newQuantity <= 10) {
            cart[existingItemIndex].quantity = newQuantity;
            showSuccess('Updated quantity in cart!');
        } else {
            showError('Maximum quantity limit reached (10 items)');
            return;
        }
    } else {
        cart.push(cartItem);
        showSuccess('Added to cart successfully!');
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Toggle favorite functionality
function toggleFavorite(product) {
    if (!checkLoginState()) {
        showLoginPrompt();
        return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.findIndex(f => f.id === product.id);
    const favoriteBtn = document.querySelector('.favorite-btn');
    
    if (index === -1) {
        favorites.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            brand: product.brand,
            style: product.style
        });
        if (favoriteBtn) favoriteBtn.classList.add('active');
        showSuccess('Added to favorites!');
    } else {
        favorites.splice(index, 1);
        if (favoriteBtn) favoriteBtn.classList.remove('active');
        showNotification('Removed from favorites!', 'warning');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
}

// Check if product is in favorites
function checkFavoriteStatus(productId) {
    if (!checkLoginState()) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFavorite = favorites.some(f => f.id === productId);
    const favoriteBtn = document.querySelector('.favorite-btn');
    
    if (isFavorite && favoriteBtn) {
        favoriteBtn.classList.add('active');
    }
}

// Update cart count in navbar
function updateCartCount() {
    if (!checkLoginState()) {
        document.querySelectorAll('.cart-count')
            .forEach(el => el.textContent = '0');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count')
        .forEach(el => el.textContent = count);
}

// Update favorites count in navbar
function updateFavoritesCount() {
    if (!checkLoginState()) {
        document.querySelectorAll('.favorites-count')
            .forEach(el => el.textContent = '0');
        return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    document.querySelectorAll('.favorites-count')
        .forEach(el => el.textContent = favorites.length);
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

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(price);
}

// Show error message
function showError(message) {
    showNotification(message, 'error');
}

// Show success message
function showSuccess(message) {
    showNotification(message, 'success');
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeProductPage);