const fs = require('fs');
const path = require('path');

const shoesDir = path.join(__dirname, 'shoes');
const productPagesDir = path.join(__dirname, 'product_pages');

function slugify(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function getProductName(filename) {
    return filename.replace(/_converted\.jpg|\.jpg|\.jpeg|\.png|\.avif/gi, '').replace(/[-_]/g, ' ').toUpperCase();
}

let productsArray = [];

function generateProductPage(imageFile) {
    const productName = getProductName(imageFile);
    const slug = slugify(productName);
    const htmlFile = `product_${slug}.html`;
    const imagePath = `../shoes/${imageFile}`;
    const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${productName}</title>
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #fff;
            color: #111;
        }

        .container {
            display: flex;
            flex-wrap: wrap;
            padding: 20px;
            max-width: 1200px;
            margin: auto;
        }

        .image-section {
            flex: 1;
            min-width: 300px;
            padding: 10px;
        }

            .image-section img {
                width: 100%;
                border-radius: 10px;
            }

        .thumbnail-row {
            display: flex;
            gap: 10px;
            overflow-x: auto;
            margin-top: 10px;
        }

            .thumbnail-row img {
                height: 80px;
                width: 80px;
                border: 1px solid #ddd;
                border-radius: 5px;
                cursor: pointer;
            }

        .details-section {
            flex: 1;
            min-width: 300px;
            padding: 10px;
        }

        .title {
            font-size: 24px;
            font-weight: bold;
        }

        .price {
            font-size: 20px;
            margin: 10px 0;
        }

            .price del {
                color: gray;
                margin-left: 10px;
            }

        .discount {
            color: green;
            font-weight: bold;
            margin-left: 10px;
        }

        .sizes {
            margin: 20px 0;
        }

            .sizes button {
                margin: 5px;
                padding: 10px 15px;
                border: 1px solid #ccc;
                background-color: #f9f9f9;
                cursor: pointer;
                border-radius: 5px;
            }

                .sizes button.selected {
                    background-color: black;
                    color: white;
                }

        .add-to-cart {
            padding: 15px;
            background-color: #111;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
            margin-top: 20px;
        }

        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }

            .hamburger {
                display: flex;
            }
        }
        .colorways {
            margin: 20px 0;
        }

        .color-swatches {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }

        .swatch {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid #ccc;
            cursor: pointer;
            transition: transform 0.2s;
        }

            .swatch:hover {
                transform: scale(1.1);
            }
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #111;
            color: white;
            padding: 10px 20px;
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .logo img {
            height: 85px;
            cursor: pointer;
        }
        .hamburger {
            display: none;
            flex-direction: column;
            cursor: pointer;
        }

        .hamburger div {
            width: 25px;
            height: 3px;
            background-color: white;
            margin: 4px 0;
        }

        .nav-links a {
            display: flex;
            gap: 20px;
        }

        .nav-links a {
            color: white;
            text-decoration: none;
            font-weight: bold;
            transition: color 0.3s;
        }

            .nav-links a:hover {
                color: #ddd;
            }
            .mobile-menu {
            display: none;
            flex-direction: column;
            background-color: #111;
            position: absolute;
            top: 60px;
            right: 20px;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .mobile-menu a {
            color: white;
            text-decoration: none;
            padding: 10px 0;
            font-weight: bold;
            border-bottom: 1px solid #333;
        }

        .mobile-menu a:last-child {
            border-bottom: none;
        }

        .mobile-menu a:hover {
            color: #ffcc00;
        }
        .back-btn {
            margin: 20px;
            padding: 8px 16px;
            background-color: #eee;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

            .back-btn:hover {
                background-color: #838181;
            }
            #reviews {
        margin-top: 10px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f9f9f9;
    }

    .review-section {
        margin-top: 20px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f9f9f9;
    }

    #reviews {
        margin-top: 10px;
    }

    #reviews p {
        margin: 5px 0;
        font-size: 14px;
        color: #333;
    }

    .stars {
        display: flex;
        gap: 5px;
        font-size: 24px;
        cursor: pointer;
    }

    .stars span {
        color: #ccc;
        transition: color 0.3s;
    }

    .stars span.selected,
    .stars span:hover,
    .stars span:hover ~ span {
        color: gold;
    }

    #rating-input {
        margin-top: 10px;
    }

    #submitRating {
        margin-top: 10px;
        padding: 10px 15px;
        background-color: #111;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
    }

    #submitRating:hover {
        background-color: #333;
    }

    /* Review Section Styles */
    .reviews-section {
        margin-top: 40px;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 10px;
    }

    .review-form {
        margin-bottom: 30px;
    }

    .rating-input {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
    }

    .rating-input i {
        font-size: 24px;
        color: #ddd;
        cursor: pointer;
        transition: color 0.2s;
    }

    .rating-input i.active {
        color: #ffd700;
    }

    .review-input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 10px;
        min-height: 100px;
        resize: vertical;
    }

    .review-list {
        margin-top: 20px;
    }

    .review-item {
        padding: 15px;
        border-bottom: 1px solid #eee;
        margin-bottom: 15px;
    }

    .review-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .review-author {
        font-weight: bold;
    }

    .review-date {
        color: #666;
        font-size: 0.9em;
    }

    .review-rating {
        color: #ffd700;
        margin-bottom: 5px;
    }

    .average-rating {
        font-size: 1.2em;
        margin-bottom: 20px;
    }

    .average-rating i {
        color: #ffd700;
    }

    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Navbar -->
    <header class="navbar">
        <a href="../homepage.html" class="logo">
            <img src="../logo.png" alt="Logo">
        </a>
        <div class="nav-links">
            <a href="../homepage.html">Home</a>
            <a href="../profile.html">Profile 👤</a>
        </div>
        <div class="hamburger" onclick="toggleMenu()">
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div class="mobile-menu" id="mobileMenu">
            <a href="../homepage.html">Home</a>
            <a href="../profile.html">Profile 👤</a>
        </div>
    </header>
    <button onclick="history.back()" class="back-btn">←</button>

    <div class="container">
        <!-- Image Section -->
        <div class="image-section">
            <img id="main-image" src="${imagePath}" alt="${productName}">
            <div class="thumbnail-row">
                <img src="${imagePath}" alt="thumb" onclick="changeImage(this)">
            </div>
        </div>

        <!-- Details Section -->
        <div class="details-section">
            <div class="title">${productName}</div>
            <div class="price">₱9,999 <del>₱12,999</del> <span class="discount">23% off</span></div>

            <div class="colorways">
                <strong>Colorway:</strong> <span id="colorway-name">Default</span>
                <div class="color-swatches">
                    <div class="swatch" style="background: tan;" onclick="selectColorway('beige')"></div>
                    <div class="swatch" style="background: black;" onclick="selectColorway('black')"></div>
                    <div class="swatch" style="background: crimson;" onclick="selectColorway('red')"></div>
                </div>
            </div>

            <div class="sizes">
                <div>Select Size:</div>
                <button onclick="selectSize(this)">US M 7 / W 8.5</button>
                <button onclick="selectSize(this)">US M 8 / W 9.5</button>
                <button onclick="selectSize(this)">US M 9 / W 10.5</button>
            </div>

            <div class="productDescription">
                <strong>Description:</strong>
                <p>Placeholder description for ${productName}. This is a sample product page generated from the shoes folder image.</p>
            </div>

            <button class="add-to-cart" onclick="addToCart()">Add to Cart</button>
        </div>

        <!-- Reviews Section -->
        <div class="reviews-section">
            <h2>Customer Reviews</h2>
            <div class="average-rating">
                Average Rating: <span id="averageRating">0</span>
                <div id="averageStars"></div>
            </div>

            <!-- Review Form -->
            <div class="review-form">
                <h3>Write a Review</h3>
                <div class="rating-input">
                    <i class="fas fa-star" data-rating="1"></i>
                    <i class="fas fa-star" data-rating="2"></i>
                    <i class="fas fa-star" data-rating="3"></i>
                    <i class="fas fa-star" data-rating="4"></i>
                    <i class="fas fa-star" data-rating="5"></i>
                </div>
                <textarea class="review-input" placeholder="Write your review here..." required></textarea>
                <button class="btn btn-primary" onclick="submitReview()">Submit Review</button>
            </div>

            <!-- Reviews List -->
            <div class="review-list" id="reviewList"></div>
        </div>
    </div>

    <script>
        function changeImage(el) {
            const mainImage = document.getElementById('main-image');
            mainImage.src = el.src;
        }
        function selectSize(button) {
            const allButtons = document.querySelectorAll('.sizes button');
            allButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        }
        function selectColorway(variant) {
            // Placeholder: you can expand this logic if you want
            document.getElementById('colorway-name').innerText = variant.charAt(0).toUpperCase() + variant.slice(1);
        }
        function addToCart() {
            const sizeBtn = document.querySelector('.sizes button.selected');
            if (!sizeBtn) {
                alert('Please select a size first!');
                return;
            }
            const product = {
                name: '${productName}',
                price: 9999,
                originalPrice: 12999,
                size: sizeBtn.innerText,
                colorway: document.getElementById('colorway-name').innerText,
                image: '${imagePath}',
                quantity: 1
            };
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existing = cart.find(item =>
                item.name === product.name &&
                item.size === product.size &&
                item.colorway === product.colorway
            );
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push(product);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.href = '../cart.html';
        }
        document.addEventListener('DOMContentLoaded', function() {
            let selectedRating = 0;
            const slug = '${slug}';
            const reviewsKey = 'productReviews_' + slug;
            const reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];
            document.querySelectorAll('.rating-input i').forEach(star => {
                star.addEventListener('click', () => {
                    const rating = parseInt(star.dataset.rating);
                    selectedRating = rating;
                    document.querySelectorAll('.rating-input i').forEach((s, index) => {
                        s.classList.toggle('active', index < rating);
                    });
                });
            });
            window.submitReview = function() {
                const reviewText = document.querySelector('.review-input').value.trim();
                if (!selectedRating) {
                    alert('Please select a rating');
                    return;
                }
                if (!reviewText) {
                    alert('Please write a review');
                    return;
                }
                const review = {
                    id: Date.now(),
                    rating: selectedRating,
                    text: reviewText,
                    author: localStorage.getItem('username') || 'Anonymous',
                    date: new Date().toLocaleDateString()
                };
                reviews.push(review);
                localStorage.setItem(reviewsKey, JSON.stringify(reviews));
                displayReviews();
                document.querySelector('.review-input').value = '';
                selectedRating = 0;
                document.querySelectorAll('.rating-input i').forEach(star => {
                    star.classList.remove('active');
                });
            }
            function displayReviews() {
                const reviewList = document.getElementById('reviewList');
                const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0;
                document.getElementById('averageRating').textContent = averageRating.toFixed(1);
                const averageStars = document.getElementById('averageStars');
                averageStars.innerHTML = '';
                for (let i = 1; i <= 5; i++) {
                    const star = document.createElement('i');
                    star.className = 'fas fa-star';
                    if (i <= Math.round(averageRating)) {
                        star.style.color = '#ffd700';
                    }
                    averageStars.appendChild(star);
                }
                reviewList.innerHTML = reviews.map(review => \`
                    <div class=\"review-item\">
                        <div class=\"review-header\">
                            <span class=\"review-author\">\${review.author}</span>
                            <span class=\"review-date\">\${review.date}</span>
                        </div>
                        <div class=\"review-rating\">
                            \${Array(review.rating).fill('<i class=\"fas fa-star\"></i>').join('')}
                        </div>
                        <p>\${review.text}</p>
                    </div>
                \`).join('');
            }
            displayReviews();
        });
    </script>
</body>
</html>
`;

    // Add product info to productsArray
    productsArray.push({
        name: productName,
        image: `shoes/${imageFile}`,
        slug: slug,
        // You can add more fields here if you want (e.g., price, brand, etc.)
    });
    fs.writeFileSync(path.join(productPagesDir, htmlFile), template, 'utf8');
    console.log(`Created ${htmlFile}`);
}

// Step 1: Collect all valid slugs from current images
const imageFiles = fs.readdirSync(shoesDir).filter(file => /\.(jpg|jpeg|png|avif)$/i.test(file));
const validSlugs = new Set(imageFiles.map(file => slugify(getProductName(file))));

// Step 2: Delete orphaned product pages
fs.readdirSync(productPagesDir).forEach(file => {
    const match = file.match(/^product_(.+)\.html$/);
    if (match) {
        const slug = match[1];
        if (!validSlugs.has(slug)) {
            fs.unlinkSync(path.join(productPagesDir, file));
            console.log(`Deleted orphaned page: ${file}`);
        }
    }
});

// Main
imageFiles.forEach(file => {
    generateProductPage(file);
});

// After generating all pages, write products.json
fs.writeFileSync(
    path.join(__dirname, 'products.json'),
    JSON.stringify(productsArray, null, 2),
    'utf8'
);
console.log('Created products.json');