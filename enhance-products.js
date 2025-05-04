console.log('Script started');
const fs = require('fs');

// Load your current products.json
const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

// Helper to guess brand/style from name (very basic, you can improve this)
function guessBrand(name) {
  if (/nike/i.test(name)) return 'Nike';
  if (/jordan/i.test(name)) return 'Jordan';
  if (/adidas/i.test(name)) return 'Adidas';
  if (/lebron/i.test(name)) return 'LeBron';
  if (/kobe/i.test(name)) return 'Kobe';
  return 'Generic';
}
function guessStyle(name) {
  if (/force/i.test(name)) return 'Force';
  if (/pegasus/i.test(name)) return 'Pegasus';
  if (/cortez/i.test(name)) return 'Cortez';
  if (/dunk/i.test(name)) return 'Dunk';
  if (/max/i.test(name)) return 'Max';
  if (/superfly/i.test(name)) return 'Superfly';
  if (/spizike/i.test(name)) return 'Spizike';
  if (/hustle/i.test(name)) return 'Hustle';
  return 'Sneaker';
}

// Enhance each product
const enhanced = products.map(p => ({
  ...p,
  brand: p.brand || guessBrand(p.name),
  style: p.style || guessStyle(p.name),
  description: p.description || `A stylish ${guessBrand(p.name)} ${guessStyle(p.name)} shoe.`,
  tags: p.tags || [
    ...(p.name ? p.name.split(' ') : []),
    guessBrand(p.name),
    guessStyle(p.name)
  ].map(t => t.toLowerCase()),
  price: p.price || Math.floor(Math.random() * 4000) + 2000 // Random price ₱2000-₱6000
}));

// Save to a new file (or overwrite the old one)
fs.writeFileSync('products-enhanced.json', JSON.stringify(enhanced, null, 2));
console.log('Enhanced products saved to products-enhanced.json');