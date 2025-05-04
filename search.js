// search.js - Reusable search bar logic for all pages

(function() {
  // Find search bar elements (by ID, fallback to class for flexibility)
  const searchInput = document.getElementById('searchInput') || document.querySelector('.search-input');
  const searchSuggestions = document.getElementById('searchSuggestions') || document.querySelector('.suggestions');
  if (!searchInput || !searchSuggestions) return;

  let products = [];
  let suggestionsVisible = false;

  // Fetch products.json
  fetch('products.json')
    .then(res => res.json())
    .then(data => {
      products = data;
    });

  // Helper: check if query matches any field
  function matchesProduct(product, query) {
    query = query.toLowerCase();
    // Check name, brand, style, description, tags
    if (product.name && product.name.toLowerCase().includes(query)) return true;
    if (product.brand && product.brand.toLowerCase().includes(query)) return true;
    if (product.style && product.style.toLowerCase().includes(query)) return true;
    if (product.description && product.description.toLowerCase().includes(query)) return true;
    if (product.tags && Array.isArray(product.tags)) {
      for (const tag of product.tags) {
        if (tag.toLowerCase().includes(query)) return true;
      }
    }
    return false;
  }

  // Show suggestions
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      searchSuggestions.style.display = 'none';
      searchSuggestions.innerHTML = '';
      suggestionsVisible = false;
      return;
    }
    const matches = products.filter(p => matchesProduct(p, query)).slice(0, 8);
    if (!matches.length) {
      searchSuggestions.innerHTML = '<div class="suggestion-item">No results found.</div>';
      searchSuggestions.style.display = 'block';
      suggestionsVisible = true;
      return;
    }
    searchSuggestions.innerHTML = matches.map(product => `
      <div class="suggestion-item" data-slug="${product.slug}">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='placeholder.png'">
        <div>
          <strong>${product.name}</strong>
          <p>${product.brand || ''} ${product.style ? '· ' + product.style : ''}</p>
        </div>
      </div>
    `).join('');
    searchSuggestions.style.display = 'block';
    suggestionsVisible = true;
  });

  // Hide suggestions on blur (with delay for click)
  searchInput.addEventListener('blur', function() {
    setTimeout(() => {
      searchSuggestions.style.display = 'none';
      suggestionsVisible = false;
    }, 150);
  });
  searchInput.addEventListener('focus', function() {
    if (searchSuggestions.innerHTML && searchInput.value) {
      searchSuggestions.style.display = 'block';
      suggestionsVisible = true;
    }
  });

  // Handle click on suggestion
  searchSuggestions.addEventListener('mousedown', function(e) {
    const item = e.target.closest('.suggestion-item');
    if (!item) return;
    const slug = item.getAttribute('data-slug');
    if (!slug) return;
    // Find product and navigate
    const product = products.find(p => p.slug === slug);
    if (product) {
      // Navigate to product page using slug
      window.location.href = `product_pages/${product.slug}.html`;
    }
  });

  // Optional: handle Enter key to go to first suggestion
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && suggestionsVisible) {
      const first = searchSuggestions.querySelector('.suggestion-item[data-slug]');
      if (first) {
        const slug = first.getAttribute('data-slug');
        if (slug) {
          window.location.href = `product_pages/${slug}.html`;
        }
      }
    }
  });
})(); 