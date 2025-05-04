let cart = JSON.parse(localStorage.getItem("cart")) || [];

function checkLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        cart = [];
        localStorage.removeItem('cart');
        window.location.replace('login.html');
        return false;
    }
    return true;
}

function renderCart() {
    if (!checkLoginState()) return;
    
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutBtn = document.querySelector(".checkout-btn");

    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p style='text-align: center; color: #888;'>Your cart is empty.</p>";
        cartTotal.style.display = "none";
        checkoutBtn.style.display = "none";
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        let imagePath = item.image.replace(/^\.\.\//, '');
        const itemHTML = `
            <div class="cart-item">
                <img src="${imagePath}" alt="${item.name}">
                <div class="cart-details">
                    <h3>${item.name}</h3>
                    <p>Color: ${item.colorDisplay || item.color.charAt(0).toUpperCase() + item.color.slice(1)}</p>
                    <p>Size: US ${item.size}</p>
                    <p>₱${item.price.toLocaleString()} x ${item.quantity}</p>
                    <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
        `;
        cartItems.innerHTML += itemHTML;
    });

    cartTotal.innerText = `Total: ₱${total.toLocaleString()}`;
    cartTotal.style.display = "block";
    checkoutBtn.style.display = "block";
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCounts();
}

function showPaymentForm() {
    if (!checkLoginState()) return;
    
    // Clear any previous error messages
    document.getElementById("error-message").style.display = "none";
    
    // Show payment section
    document.getElementById("payment-section").style.display = "block";
    
    // Focus on the first input field
    document.getElementById("card-name").focus();
}

function generateOrderId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    return `ORDER-${timestamp}-${random}`;
}

function validatePayment() {
    console.log('Starting payment validation');
    
    if (!checkLoginState()) {
        console.log('User not logged in');
        return;
    }

    // Check if cart has items
    if (cart.length === 0) {
        console.log('Cart is empty');
        document.getElementById("error-message").textContent = 'Your cart is empty. Please add items before proceeding.';
        document.getElementById("error-message").style.display = "block";
        return;
    }

    const cardName = document.getElementById("card-name").value.trim();
    const cardNumber = document.getElementById("card-number").value.trim();
    const expiryDate = document.getElementById("expiry-date").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    console.log('Payment details:', { cardName, cardNumber, expiryDate, cvv });

    // Validate payment fields
    const isValid = validatePaymentFields(cardName, cardNumber, expiryDate, cvv);
    console.log('Validation result:', isValid);

    if (isValid) {
        // Show loading state
        const checkoutBtn = document.querySelector('.checkout-btn');
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Processing...';

        // Mock payment processing (always succeeds)
        setTimeout(() => {
            try {
                console.log('Processing payment...');
                
                // Save order to history
                const orderData = {
                    id: generateOrderId(),
                    date: new Date().toISOString(),
                    status: 'Processing',
                    items: cart.map(item => ({
                        name: item.name,
                        size: item.size,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                };

                console.log('Order data:', orderData);

                // Add to order history
                let orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
                orderHistory.unshift(orderData);
                localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

                console.log('Order history saved');

                // Clear cart
                cart = [];
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCounts();

                console.log('Cart cleared');

                // Show success message
                showSuccessMessage();
                
                // Redirect to profile page after 3 seconds
                setTimeout(() => {
                    console.log('Redirecting to profile page');
                    window.location.href = "profile.html";
                }, 3000);
            } catch (error) {
                console.error('Error processing payment:', error);
                checkoutBtn.disabled = false;
                checkoutBtn.textContent = 'Submit Payment';
                document.getElementById("error-message").textContent = 'An error occurred. Please try again.';
                document.getElementById("error-message").style.display = "block";
            }
        }, 1000); // Mock processing delay
    } else {
        console.log('Validation failed');
        // Show error message if validation fails
        document.getElementById("error-message").style.display = "block";
        const checkoutBtn = document.querySelector('.checkout-btn');
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Submit Payment';
    }
}

function validatePaymentFields(cardName, cardNumber, expiryDate, cvv) {
    let isValid = true;
    const errorMessage = document.getElementById("error-message");

    if (!cardName.trim()) {
        showErrorMessage("Please enter your name.");
        isValid = false;
    } else if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length !== 16) {
        showErrorMessage("Please enter a 16-digit card number.");
        isValid = false;
    } else if (!expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
        showErrorMessage("Please enter a valid expiry date (MM/YY). ");
        isValid = false;
    } else if (!cvv.trim() || cvv.length !== 3) {
        showErrorMessage("Please enter a 3-digit CVV.");
        isValid = false;
    }

    errorMessage.style.display = isValid ? "none" : "block";
    return isValid;
}

function showErrorMessage(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

function showSuccessMessage() {
    const successMessage = document.createElement("div");
    successMessage.id = "success-message";
    successMessage.className = "success-message";
    successMessage.style.display = "block";

    // Show success message
    const successText = document.createElement("p");
    successText.textContent = "Your order has been successfully processed!";
    successText.className = "success-text";
    successMessage.appendChild(successText);

    // Add a spinner while processing
    const spinner = document.createElement("div");
    spinner.className = "spinner";
    spinner.innerHTML = `
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    successMessage.appendChild(spinner);

    // Add to the payment section
    const paymentSection = document.getElementById("payment-section");
    paymentSection.style.display = "none";
    paymentSection.appendChild(successMessage);
}

// Initialize the cart on page load
document.addEventListener('DOMContentLoaded', () => {
    checkLoginState();
    renderCart();
    updateCounts();
    
    // Update order history display if we're on the profile page
    if (window.location.pathname.includes('profile.html')) {
        loadOrderHistory();
    }
});
