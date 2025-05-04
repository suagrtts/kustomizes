let shoeDatabase = [];

const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

let currentQuestion = 0;
let userResponses = {};
let quizActive = false;

const faqs = [
  { keywords: ["shipping", "deliver", "ship"], answer: "We offer free shipping for orders over ₱5,000. Standard delivery takes 3-5 business days." },
  { keywords: ["return", "refund"], answer: "You can return items within 30 days of purchase. Items must be unworn and in original packaging." },
  { keywords: ["payment", "pay", "method"], answer: "We accept all major credit cards, GCash, and PayPal for secure payments." },
  { keywords: ["size", "sizing", "fit"], answer: "Our size guide is available on each product page. If you need help, contact our support team." },
  { keywords: ["stock", "available", "availability"], answer: "All items shown are in stock unless marked as 'Out of Stock'. We update inventory in real-time." },
];

const questions = [
    {
        key: 'name',
        text: "Good day! What's your name?",
        inputType: 'text'
    },
    {
        key: 'type',
        text: "Nice to meet you, {name}! What type of shoe are you looking for?",
        inputType: 'options',
        options: ['Running', 'Walking', 'Basketball', 'Casual', 'Formal']
    },
    {
        key: 'purpose',
        text: "What will you mainly use them for?",
        inputType: 'options',
        options: ['Racing', 'Training', 'Everyday Wear']
    },
    {
        key: 'cushioning',
        text: "What level of cushioning do you prefer? (low, medium, high)",
        inputType: 'options',
        options: ["low", "medium", "high"]
    },
    {
        key: 'weight',
        text: "Do you prefer light, medium, or heavy shoes?",
        inputType: 'options',
        options: ["light", "medium", "heavy"]
    },
    {
        key: 'budget',
        text: "What's your budget?",
        inputType: 'options',
        options: ["under ₱1000", "₱1000-₱1500", "₱1500-₱2000", "over ₱2000"]
    }
];

function appendMessage(text, sender = 'bot') {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;
    msgDiv.textContent = text;
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function appendHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function createOptions(options) {
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    options.forEach(option => {
        const btn = document.createElement('div');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => processAnswer(option);
        optionsDiv.appendChild(btn);
    });
    chatContainer.appendChild(optionsDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function handleUserInput() {
    const input = userInput.value.trim();
    if (!input) return;
    processUserMessage(input);
    userInput.value = '';
}

function processUserMessage(message) {
    appendMessage(message, 'user');
    if (quizActive) {
        processAnswer(message);
        return;
    }
    // 1. FAQ detection
    const lower = message.toLowerCase();
    for (const faq of faqs) {
        if (faq.keywords.some(k => lower.includes(k))) {
            showTyping().then(() => appendMessage(faq.answer));
            return;
        }
    }
    // 2. Product search intent
    if (shoeDatabase && shoeDatabase.length > 0) {
        // Try to extract price
        let priceMatch = lower.match(/under ?₱?(\d+)/) || lower.match(/below ?₱?(\d+)/);
        let maxPrice = priceMatch ? parseInt(priceMatch[1]) : null;
        // Try to extract type/style/brand
        let typeMatch = null;
        const types = ['running', 'walking', 'basketball', 'casual', 'formal', 'sports', 'kids', 'men', 'women'];
        for (const t of types) {
            if (lower.includes(t)) { typeMatch = t; break; }
        }
        let brandMatch = null;
        // Try to find a brand in the message
        for (const product of shoeDatabase) {
            if (product.brand && lower.includes(product.brand.toLowerCase())) {
                brandMatch = product.brand;
                break;
            }
        }
        // Try to find a specific product by name
        let productMatch = null;
        for (const product of shoeDatabase) {
            if (product.name && lower.includes(product.name.toLowerCase())) {
                productMatch = product;
                break;
            }
        }
        // If specific product found
        if (productMatch) {
            showTyping().then(() => {
                appendMessage(`Here's what I found for "${productMatch.name}":`);
                appendHTML(productCardHTML(productMatch));
            });
            return;
        }
        // Otherwise, filter products
        let filtered = shoeDatabase.filter(p => {
            let ok = true;
            if (maxPrice !== null && p.price > maxPrice) ok = false;
            if (typeMatch && p.style && !p.style.toLowerCase().includes(typeMatch)) ok = false;
            if (brandMatch && p.brand && p.brand !== brandMatch) ok = false;
            return ok;
        });
        if (filtered.length > 0) {
            showTyping().then(() => {
                appendMessage(`Here ${filtered.length === 1 ? 'is' : 'are'} ${filtered.length === 1 ? 'a product' : 'some products'} that match your request:`);
                filtered.slice(0, 3).forEach(p => appendHTML(productCardHTML(p)));
            });
            return;
        }
    }
    // 3. Quiz intent
    if (lower.includes('quiz') || lower.includes('recommend') || lower.includes('help me choose')) {
        quizActive = true;
        currentQuestion = 0;
        userResponses = {};
        showTyping().then(() => askQuestion());
        return;
    }
    // 4. Fallback
    showTyping().then(() => {
        appendMessage("I'm sorry, I didn't understand. You can ask about shipping, returns, or type 'quiz' for a guided recommendation.");
    });
}

async function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'message bot-message';
    typing.innerHTML = `<div class="typing-indicator">
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                        </div>`;
    chatContainer.appendChild(typing);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    await new Promise(resolve => setTimeout(resolve, 800));
    typing.remove();
}

async function processAnswer(answer) {
    const q = questions[currentQuestion];
    userResponses[q.key] = answer;

    appendMessage(answer, 'user');
    await showTyping();
    nextStep();
}

function nextStep() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        askQuestion();
    } else {
        showResult();
        quizActive = false;
    }
}

function askQuestion() {
    const q = questions[currentQuestion];
    let text = q.text.replace(/{(\w+)}/g, (_, key) => userResponses[key] || '');
    appendMessage(text);
    if (q.inputType === 'options') {
        createOptions(q.options);
    }
}

function calculateScore(shoe) {
    let score = 0;
    const prefs = userResponses;
    if (shoe.style && prefs.type && shoe.style.toLowerCase() === prefs.type.toLowerCase()) score += 30;
    if (shoe.description && prefs.purpose && shoe.description.toLowerCase().includes(prefs.purpose.toLowerCase())) score += 25;
    // For cushioning/weight, if you have such fields in products.json, add logic here
    // For now, skip unless you add those fields
    const price = typeof shoe.price === 'string' ? parseFloat(shoe.price.replace(/[^\d.]/g, '')) : shoe.price;
    if (prefs.budget === "under ₱1000" && price < 1000) score += 5;
    if (prefs.budget === "₱1000-₱1500" && price >= 1000 && price <= 1500) score += 5;
    if (prefs.budget === "₱1500-₱2000" && price > 1500 && price <= 2000) score += 5;
    if (prefs.budget === "over ₱2000" && price > 2000) score += 5;
    return score;
}

function showResult() {
    if (!shoeDatabase || shoeDatabase.length === 0) {
        appendMessage("Sorry, I couldn't load the product data. Please try again later.");
        return;
    }
    const best = shoeDatabase.map(shoe => ({ shoe, score: calculateScore(shoe) }))
        .sort((a, b) => b.score - a.score)
        .map(entry => entry.shoe);
    if (!best.length) {
        appendMessage("Sorry, no good matches found!");
        return;
    }
    appendMessage(`Based on your choices, I recommend the following:`);
    best.slice(0, 3).forEach(top => appendHTML(productCardHTML(top)));
}

function productCardHTML(product) {
    return `
    <div class="result-card">
        <h3 class="shoe-title">${product.name} (${typeof product.price === 'number' ? '₱' + product.price : product.price})</h3>
        <img src="${product.image || 'placeholder.png'}" alt="${product.name}">
        <ul style="text-align:left; margin:0 auto; max-width:90%;">
            <li><b>Brand:</b> ${product.brand || 'N/A'}</li>
            <li><b>Style:</b> ${product.style || 'N/A'}</li>
            <li>${product.description || ''}</li>
        </ul>
    </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(res => res.json())
        .then(data => {
            shoeDatabase = data;
            if (chatContainer && userInput && sendBtn) {
                chatContainer.innerHTML = '';
                appendMessage("Hi! 👋 How can I help you? You can ask about shipping, returns, or type 'quiz' for a guided recommendation.");
                sendBtn.addEventListener('click', handleUserInput);
                userInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') handleUserInput();
                });
            }
        })
        .catch(() => {
            appendMessage("Sorry, I couldn't load the product data. Please try again later.");
        });
});
