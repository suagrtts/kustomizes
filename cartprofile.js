// Display shipping address on cart page

document.addEventListener('DOMContentLoaded', function() {
    displayShippingAddress();
});

function displayShippingAddress() {
    const container = document.querySelector('.cart-container');
    if (!container) return;
    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));
    let addressHTML = '';
    if (shippingAddress) {
        addressHTML = `<div class="cart-shipping-address"><strong>Shipping Address:</strong> ${formatAddress(shippingAddress)}</div>`;
    } else {
        addressHTML = `<div class="cart-shipping-address"><strong>Shipping Address:</strong> <span style='color:#ff4444'>No address added. <a href='profile.html'>Add one in your profile</a></span></div>`;
    }
    // Insert above cart items
    const cartItems = document.getElementById('cart-items');
    if (cartItems) {
        cartItems.insertAdjacentHTML('beforebegin', addressHTML);
    }
}

function formatAddress(addr) {
    return `${addr.addressName}: ${addr.fullAddress}, ${addr.city}, ${addr.province}, ${addr.postalCode}`;
} 