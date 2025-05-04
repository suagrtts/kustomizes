// JavaScript source code

// Homepage Product Logic: Clean, Modern, and Fast

let products = [];
let filteredProducts = [];
let allCategories = new Set();
let allBrands = new Set();
let allStyles = new Set();

const productList = document.getElementById('productList');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const sortSelect = document.getElementById('sortSelect');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const searchInput = document.getElementById('searchInput');

// Filter state
let filters = {
    search: '',
    maxPrice: 50000,
    category: '',
    brand: '',
    style: '',
    sort: ''
};

// Load products and initialize
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    products = data.map(p => ({
        ...p,
        slug: generateSlug(p.name)
    }));
    extractFilters(products);
    renderFilterOptions();
    applyFilters();
  });

// Generate slug from product name
function generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function extractFilters(products) {
    allCategories = new Set(products.map(p => p.style).filter(Boolean));
    allBrands = new Set(products.map(p => p.brand).filter(Boolean));
    allStyles = new Set(products.map(p => p.style).filter(Boolean));
}

function renderFilterOptions() {
    // Category
    const catList = document.getElementById('categoryFilters');
    catList.innerHTML = '<li><label><input type="radio" name="category" value="" checked> All</label></li>' +
        Array.from(allCategories).map(cat =>
            `<li><label><input type="radio" name="category" value="${cat}"> ${cat}</label></li>`
        ).join('');
    catList.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', e => {
            filters.category = e.target.value;
            applyFilters();
        });
    });
    // Brand
    const brandList = document.getElementById('brandFilters');
    brandList.innerHTML = '<li><label><input type="radio" name="brand" value="" checked> All</label></li>' +
        Array.from(allBrands).map(brand =>
            `<li><label><input type="radio" name="brand" value="${brand}"> ${brand}</label></li>`
        ).join('');
    brandList.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', e => {
            filters.brand = e.target.value;
            applyFilters();
        });
    });
    // Style
    const styleList = document.getElementById('styleFilters');
    styleList.innerHTML = '<li><label><input type="radio" name="style" value="" checked> All</label></li>' +
        Array.from(allStyles).map(style =>
            `<li><label><input type="radio" name="style" value="${style}"> ${style}</label></li>`
        ).join('');
    styleList.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', e => {
            filters.style = e.target.value;
            applyFilters();
        });
    });
}

// Search filter
if (searchInput) {
    searchInput.addEventListener('input', e => {
        filters.search = e.target.value.toLowerCase().trim();
        applyFilters();
    });
}

// Price filter
priceRange.addEventListener('input', e => {
    filters.maxPrice = parseInt(e.target.value);
    priceValue.textContent = '₱' + parseInt(e.target.value).toLocaleString('en-PH', {minimumFractionDigits:2});
    applyFilters();
});

// Sorting
sortSelect.addEventListener('change', e => {
    filters.sort = e.target.value;
    applyFilters();
});

// Reset filters
resetFiltersBtn.addEventListener('click', () => {
    filters = {
        search: '',
        maxPrice: 50000,
        category: '',
        brand: '',
        style: '',
        sort: ''
    };
    if (searchInput) searchInput.value = '';
    priceRange.value = 50000;
    priceValue.textContent = '₱50,000.00';
    document.querySelectorAll('.sidebar input[type=radio][name=category]').forEach(i => i.checked = i.value === '');
    document.querySelectorAll('.sidebar input[type=radio][name=brand]').forEach(i => i.checked = i.value === '');
    document.querySelectorAll('.sidebar input[type=radio][name=style]').forEach(i => i.checked = i.value === '');
    sortSelect.value = '';
    applyFilters();
});

function applyFilters() {
    filteredProducts = products.filter(p => {
        if (filters.search && !(
            p.name.toLowerCase().includes(filters.search) ||
            (p.brand && p.brand.toLowerCase().includes(filters.search)) ||
            (p.style && p.style.toLowerCase().includes(filters.search))
        )) return false;
        if (filters.category && p.style !== filters.category) return false;
        if (filters.brand && p.brand !== filters.brand) return false;
        if (filters.style && p.style !== filters.style) return false;
        if (p.price > filters.maxPrice) return false;
        return true;
    });
    // Sorting
    if (filters.sort) {
        if (filters.sort === 'price_asc') filteredProducts.sort((a,b) => a.price - b.price);
        if (filters.sort === 'price_desc') filteredProducts.sort((a,b) => b.price - a.price);
        if (filters.sort === 'name_asc') filteredProducts.sort((a,b) => a.name.localeCompare(b.name));
        if (filters.sort === 'name_desc') filteredProducts.sort((a,b) => b.name.localeCompare(a.name));
        if (filters.sort === 'newest') filteredProducts.sort((a,b) => (b.id||0) - (a.id||0));
    }
    renderProducts();
}

function renderProducts() {
    if (!filteredProducts.length) {
        productList.innerHTML = '<div class="no-products">No products found matching your criteria.</div>';
        return;
    }
    productList.innerHTML = filteredProducts.map(product => `
        <a href="product_pages/${product.slug}.html" class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src='placeholder.png';">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                ${product.brand ? `<p class="brand">${product.brand}</p>` : ''}
                <div class="price-container">
                    <span class="current-price">₱${parseInt(product.price).toLocaleString('en-PH')}</span>
                </div>
            </div>
        </a>
    `).join('');
}

// Load and filter products
let allProducts = [];

// Check authentication state
function checkLoginState() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Show login prompt
function showLoginPrompt() {
    alert('Please log in to use this feature');
    window.location.href = 'login.html';
}

// Load products
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        allProducts = await response.json();
        displayProducts(allProducts);
        updateCounts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products
function displayProducts(products) {
    const productsContainer = document.querySelector('.products-grid');
    if (!productsContainer) return;

    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <button class="favorite-btn ${isFavorite(product.id) ? 'active' : ''}" 
                        onclick="toggleFavorite(event, ${JSON.stringify(product)})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">₱${product.price.toLocaleString()}</p>
                <p class="brand">${product.brand}</p>
                <p class="style">${product.style}</p>
                <a href="${product.link}" class="view-details">View Details</a>
            </div>
        </div>
    `).join('');
}

// Filter products
function filterProducts(category = 'all') {
    let filtered = [...allProducts];
    
    if (category !== 'all') {
        filtered = filtered.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    displayProducts(filtered);
}

// Search products
function searchProducts(query) {
    query = query.toLowerCase().trim();
    
    if (!query) {
        displayProducts(allProducts);
        return;
    }
    
    const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.style.toLowerCase().includes(query)
    );
    
    displayProducts(filtered);
}

// Favorite functionality
function toggleFavorite(event, product) {
    event.preventDefault();
    
    if (!checkLoginState()) {
        showLoginPrompt();
        return;
    }
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.findIndex(f => f.id === product.id);
    
    if (index === -1) {
        favorites.push(product);
        event.currentTarget.classList.add('active');
        showNotification('Added to favorites!', 'success');
    } else {
        favorites.splice(index, 1);
        event.currentTarget.classList.remove('active');
        showNotification('Removed from favorites!', 'warning');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateCounts();
}

// Check if product is in favorites
function isFavorite(productId) {
    if (!checkLoginState()) return false;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.some(f => f.id === productId);
}

// Update counts in navbar
function updateCounts() {
    if (!checkLoginState()) {
        document.querySelectorAll('.cart-count, .favorites-count')
            .forEach(el => el.textContent = '0');
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    document.querySelectorAll('.cart-count')
        .forEach(el => el.textContent = cart.reduce((sum, item) => sum + item.quantity, 0));
    document.querySelectorAll('.favorites-count')
        .forEach(el => el.textContent = favorites.length);
}

// Show notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Set up search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => searchProducts(e.target.value));
    }
    
    // Set up filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.dataset.category);
        });
    });

    // Profile dropdown and logout functionality
    const profileIcon = document.querySelector('.profile-icon');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const dropdownContent = document.querySelector('.profile-dropdown-content');
    
    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.style.display = profileDropdown.style.display === 'none' ? 'block' : 'none';
        });

        profileDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownContent.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileDropdown.contains(e.target)) {
                dropdownContent.classList.remove('show');
            }
        });

        // Set up logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout(); // Use centralized logout function from auth.js
            });
        }
    }
});



