const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Parse JSON payloads
app.use(express.json());

// Handle HTML file routes without extension
app.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'cart.html'));
});

app.get('/favorites', (req, res) => {
    res.sendFile(path.join(__dirname, 'favorites.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Root route - redirect to homepage
app.get('/', (req, res) => {
    res.redirect('/homepage');
});

// Product pages route handler
app.get('/product_pages/:product', (req, res) => {
    const productPath = path.join(__dirname, 'product_pages', req.params.product);
    // Try with .html extension if file doesn't exist
    if (!path.extname(productPath)) {
        res.sendFile(productPath + '.html', (err) => {
            if (err) {
                res.status(404).send('Product not found');
            }
        });
    } else {
        res.sendFile(productPath, (err) => {
            if (err) {
                res.status(404).send('Product not found');
            }
        });
    }
});

// Handle 404s by redirecting to homepage
app.use((req, res) => {
    res.redirect('/homepage');
});

function startServer(port) {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
}

// Try to start on port 3000, but will automatically increment if busy
startServer(3000);