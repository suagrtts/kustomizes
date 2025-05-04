// Profile page initialization
document.addEventListener('DOMContentLoaded', () => {
    if (!checkLoginState()) return;

    // Initialize functions
    loadUserProfile();
    setupProfilePicture();
    setupAddressModal();
    setupInfoModal();
    loadShippingAddress();
    loadPersonalInfo();
    loadOrderHistory();
});

// Check login state
function checkLoginState() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Load user profile information
function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('display-name').textContent = currentUser.username || 'Username';
        document.getElementById('display-email').textContent = currentUser.email || 'user@email.com';
    }
}

// Load shipping address
function loadShippingAddress() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const address = currentUser.shippingAddress || {};
    
    document.getElementById('display-street').textContent = address.street || 'Not set';
    document.getElementById('display-city').textContent = address.city || 'Not set';
    document.getElementById('display-state').textContent = address.state || 'Not set';
    document.getElementById('display-zip').textContent = address.zip || 'Not set';
}

// Load personal information
function loadPersonalInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const info = currentUser.personalInfo || {};
    
    document.getElementById('display-full-name').textContent = info.fullName || 'Not set';
    document.getElementById('display-email-address').textContent = info.email || 'Not set';
    document.getElementById('display-phone').textContent = info.phone || 'Not set';
    document.getElementById('display-birthday').textContent = info.birthday ? new Date(info.birthday).toLocaleDateString() : 'Not set';
    document.getElementById('display-gender').textContent = info.gender || 'Not set';
}

// Setup address modal
function setupAddressModal() {
    const editAddressBtn = document.getElementById('edit-address-btn');
    const addressForm = document.getElementById('address-form');
    const closeButtons = document.querySelectorAll('.close-modal');
    const modal = document.getElementById('address-modal');

    // Open modal
    if (editAddressBtn) {
        editAddressBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            
            // Load current address into form
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            const address = currentUser.shippingAddress || {};
            
            document.getElementById('street').value = address.street || '';
            document.getElementById('city').value = address.city || '';
            document.getElementById('state').value = address.state || '';
            document.getElementById('zip').value = address.zip || '';
        });
    }

    // Close modal
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    if (addressForm) {
        addressForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            currentUser.shippingAddress = {
                street: document.getElementById('street').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update display
            loadShippingAddress();
            
            // Close modal
            modal.style.display = 'none';
            
            showNotification('Shipping address updated successfully');
        });
    }
}

// Setup personal info modal
function setupInfoModal() {
    const editInfoBtn = document.getElementById('edit-info-btn');
    const infoForm = document.getElementById('info-form');
    const closeButtons = document.querySelectorAll('.close-modal');
    const modal = document.getElementById('info-modal');

    // Open modal
    if (editInfoBtn) {
        editInfoBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            
            // Load current info into form
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            const info = currentUser.personalInfo || {};
            
            document.getElementById('fullName').value = info.fullName || '';
            document.getElementById('email').value = info.email || '';
            document.getElementById('phone').value = info.phone || '';
            document.getElementById('birthday').value = info.birthday || '';
            document.getElementById('gender').value = info.gender || '';
        });
    }

    // Close modal
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    if (infoForm) {
        infoForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            currentUser.personalInfo = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                birthday: document.getElementById('birthday').value,
                gender: document.getElementById('gender').value
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Close modal
            modal.style.display = 'none';
            
            loadPersonalInfo();
            showNotification('Personal information updated successfully');
        });
    }
}

// Setup profile picture
function setupProfilePicture() {
    const profilePictureInput = document.getElementById('profile-picture-input');
    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', handleProfilePictureUpload);
    }

    // Load saved profile picture
    const profilePicture = document.getElementById('profile-picture');
    if (profilePicture) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
        if (currentUser.profilePicture) {
            profilePicture.src = currentUser.profilePicture;
        }
    }
}

// Load order history
function loadOrderHistory() {
    const orderList = document.getElementById('order-list');
    if (!orderList) return;

    // Get order history from localStorage
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    
    // Create order items
    const orderItems = orderHistory.map(order => {
        const date = new Date(order.date).toLocaleDateString();
        
        // Create HTML for each item in the order
        const orderItemsHtml = order.items.map(item => `
            <div class="order-product">
                <h4 class="order-product-name">${item.name}</h4>
                <p class="order-product-size">Size: US ${item.size}</p>
                <p class="order-product-quantity">Quantity: ${item.quantity}</p>
                <p class="order-product-price">₱${item.price.toFixed(2)}</p>
            </div>
        `).join('');

        return `
            <div class="order-item">
                <div class="order-item-header">
                    <h3>Order #${order.id}</h3>
                    <span class="order-date">${date}</span>
                </div>
                <div class="order-item-details">
                    ${orderItemsHtml}
                </div>
                <div class="order-total">
                    <span>Total:</span>
                    <span class="order-total-price">₱${order.total.toFixed(2)}</span>
                </div>
            </div>
        `;
    }).join('');

    // Update order list
    orderList.innerHTML = orderItems;

    // Show message if no orders
    if (orderItems.length === 0) {
        orderList.innerHTML = `
            <div class="no-orders">
                <p>No orders found.</p>
            </div>
        `;
    }
}

// Handle profile picture upload
function handleProfilePictureUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
        currentUser.profilePicture = e.target.result;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        const profilePicture = document.getElementById('profile-picture');
        if (profilePicture) {
            profilePicture.src = e.target.result;
        }
        
        showNotification('Profile picture updated successfully');
    };
    reader.readAsDataURL(file);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}