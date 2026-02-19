// Product Data
const productDatabase = {
  1: { id: 1, name: 'IQOO Neo 10R', price: 19.99, image: './assets/phone.jpg', rating: 4.5, description: 'Latest flagship smartphone with 5G connectivity and AI camera.', specs: ['Snapdragon 8 Gen 2', '12GB RAM', '256GB Storage', 'AMOLED Display', '120Hz Refresh Rate'] },
  2: { id: 2, name: 'Gaming Laptop', price: 29.99, image: './assets/laptop.jfif', rating: 4.8, description: 'Powerful gaming laptop with RTX 4060 graphics card.', specs: ['Intel i7-13th Gen', 'RTX 4060', '16GB RAM', '512GB SSD', '144Hz Display'] },
  3: { id: 3, name: 'Wireless Airpods', price: 39.99, image: './assets/airdropes.jpg', rating: 4.6, description: 'Premium wireless earbuds with noise cancellation.', specs: ['Active Noise Cancellation', '6-hour Battery', 'Wireless Charging Case', 'IPX4 Water Resistant', 'Spatial Audio'] },
  4: { id: 4, name: '4K Camera', price: 49.99, image: './assets/camera.jpg', rating: 4.7, description: 'Professional 4K camera for content creators.', specs: ['4K @ 60fps', '20MP Sensor', 'Image Stabilization', 'WiFi Enabled', 'Touchscreen LCD'] },
  5: { id: 5, name: 'Bluetooth Speaker', price: 39.99, image: './assets/sound.jpg', rating: 4.4, description: 'Portable speaker with 360° surround sound.', specs: ['360° Sound', '12-hour Battery', 'Waterproof (IPX7)', 'Bluetooth 5.0', 'Built-in Microphone'] },
  6: { id: 6, name: 'Smartwatch Pro', price: 39.99, image: './assets/watch.jpg', rating: 4.5, description: 'Advanced smartwatch with health tracking features.', specs: ['Heart Rate Monitor', 'Sleep Tracking', '7-day Battery', 'Water Resistant', '50+ Watch Faces'] },
  7: { id: 7, name: 'Tablet Max', price: 44.99, image: './assets/laptop.jfif', rating: 4.7, description: 'Large screen tablet perfect for multimedia.', specs: ['10.5\" Display', '128GB Storage', '8GB RAM', '8MP Camera', 'All-day Battery'] },
  8: { id: 8, name: 'USB-C Hub', price: 24.99, image: './assets/phone.jpg', rating: 4.3, description: 'Multi-port USB-C hub for connectivity.', specs: ['7 USB Ports', 'Aluminum Design', 'Fast Data Transfer', 'Compact Form Factor', 'Universal Compatible'] },
  9: { id: 9, name: 'Mechanical Keyboard', price: 34.99, image: './assets/watch.jpg', rating: 4.6, description: 'RGB mechanical gaming keyboard with tactile switches.', specs: ['RGB Backlight', 'Mechanical Switches', '104 Keys', 'Programmable Keys', 'USB Wired'] },
  10: { id: 10, name: 'Wireless Mouse', price: 19.99, image: './assets/camera.jpg', rating: 4.2, description: 'Wireless mouse with precision tracking.', specs: ['2.4GHz Wireless', '3200 DPI', 'Long Battery Life', 'Ergonomic Design', '6 Programmable Buttons'] },
  11: { id: 11, name: 'Webcam HD', price: 29.99, image: './assets/sound.jpg', rating: 4.5, description: '1080p HD webcam for streaming and video calls.', specs: ['1080p @ 30fps', 'Auto Focus', 'Wide Angle Lens', 'Built-in Microphone', 'USB Plug & Play'] },
  12: { id: 12, name: 'Phone Stand', price: 14.99, image: './assets/phone.jpg', rating: 4.1, description: 'Universal phone stand for desk and table.', specs: ['Adjustable Angle', 'Non-Slip Base', 'Aluminum Build', 'Fits All Sizes', 'Portable Design'] }
};

// Sample Reviews Data
const reviewsDatabase = {
  1: [
    { author: 'John Doe', rating: 5, text: 'Excellent phone! Great camera quality and fast processor.' },
    { author: 'Jane Smith', rating: 4, text: 'Very good, battery could be better.' },
    { author: 'Mike Johnson', rating: 5, text: 'Perfect device for my needs!' }
  ],
  2: [
    { author: 'Alex Turner', rating: 5, text: 'Amazing gaming performance!' },
    { author: 'Sara Connor', rating: 5, text: 'Best laptop ever.' },
    { author: 'Tom Hardy', rating: 4, text: 'Good, but runs hot.' }
  ],
  3: [
    { author: 'Emma Watson', rating: 5, text: 'Sound quality is incredible.' },
    { author: 'Chris Evans', rating: 4, text: 'Good noise cancellation.' }
  ]
};

const CART_STORAGE_KEY = 'amazon_cart_items';
const WISHLIST_STORAGE_KEY = 'amazon_wishlist_items';

// Cart functionality
class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.cartCountEl = document.getElementById('cartCount');
    this.initializeButtons();
    this.updateCartCount();
  }

  loadCart() {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) {
      return [];
    }

    try {
      const parsedCart = JSON.parse(storedCart);
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.warn('Invalid cart data. Resetting cart.');
      return [];
    }
  }

  saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
  }

  initializeButtons() {
    const cartButtons = document.querySelectorAll('.add-to-cart');
    const productCards = document.querySelectorAll('.product-card');
    const cartIndicator = document.querySelector('.cart-indicator');

    cartButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleAddToCart(e));
    });

    productCards.forEach(card => {
      card.addEventListener('click', (e) => this.handleCardClick(e, card));
    });

    // Add click handler to cart indicator
    if (cartIndicator) {
      cartIndicator.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Cart indicator clicked, navigating to order page');
        window.location.href = './order.html';
      });
      cartIndicator.style.cursor = 'pointer';
      console.log('Cart indicator found and click handler attached');
    } else {
      console.warn('Cart indicator not found');
    }
  }

  handleCardClick(event, card) {
    if (event.target.closest('.add-to-cart')) {
      return;
    }

    const productId = card.dataset.productId;
    if (!productId) {
      return;
    }

    window.location.href = `product-details.html?id=${productId}`;
  }

  handleAddToCart(event) {
    event.stopPropagation();
    const button = event.target;
    const productCard = button.closest('.product-card');
    if (!productCard) {
      return;
    }

    const productId = parseInt(productCard.dataset.productId, 10);
    const productName = productCard.dataset.productName || 'Product';
    const productPrice = parseFloat(productCard.dataset.price) || 0;
    const productImage = productCard.querySelector('img')?.getAttribute('src') || '';

    const existingItem = this.cart.find(cartItem => cartItem.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
      });
    }

    this.saveCart();
    this.updateCartCount();
    this.updateUI(button);
  }

  updateCartCount() {
    if (!this.cartCountEl) {
      console.warn('Cart count element not found');
      return;
    }

    const totalCount = this.cart.reduce((total, item) => total + item.quantity, 0);
    console.log('Updating cart count to:', totalCount);
    this.cartCountEl.textContent = totalCount;
    
    // Also update any other cart count elements
    const allCartCounts = document.querySelectorAll('#cartCount');
    allCartCounts.forEach(el => {
      el.textContent = totalCount;
    });
  }

  updateUI(button) {
    // Provide visual feedback
    const originalText = button.textContent;
    button.textContent = 'Added to Cart';
    button.style.backgroundColor = '#28a745';
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '';
      button.disabled = false;
    }, 2000);
  }

  getTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  }

  getCartItems() {
    return this.cart;
  }
}

// Wishlist functionality
class WishlistManager {
  constructor() {
    this.wishlist = this.loadWishlist();
    this.wishlistCountEl = document.getElementById('wishlistCount');
    this.initializeWishlistButtons();
    this.updateWishlistCount();
  }

  loadWishlist() {
    const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!storedWishlist) {
      return [];
    }

    try {
      const parsedWishlist = JSON.parse(storedWishlist);
      return Array.isArray(parsedWishlist) ? parsedWishlist : [];
    } catch (error) {
      console.warn('Invalid wishlist data. Resetting wishlist.');
      return [];
    }
  }

  saveWishlist() {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlist));
  }

  initializeWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
    const wishlistIndicator = document.querySelector('.wishlist-indicator');

    wishlistButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleAddToWishlist(e));
    });

    // Add click handler to wishlist indicator
    if (wishlistIndicator) {
      wishlistIndicator.addEventListener('click', () => {
        window.location.href = './wishlist.html';
      });
      wishlistIndicator.style.cursor = 'pointer';
    }
  }

  handleAddToWishlist(event) {
    event.stopPropagation();
    const button = event.target;
    const productCard = button.closest('.product-card');
    if (!productCard) {
      return;
    }

    const productId = parseInt(productCard.dataset.productId, 10);
    const productName = productCard.dataset.productName || 'Product';
    const productPrice = parseFloat(productCard.dataset.price) || 0;
    const productImage = productCard.querySelector('img')?.getAttribute('src') || '';

    const existingItem = this.wishlist.find(item => item.id === productId);
    if (existingItem) {
      // Remove from wishlist if already exists
      this.wishlist = this.wishlist.filter(item => item.id !== productId);
      button.textContent = 'Add to Wishlist';
      button.style.backgroundColor = '';
    } else {
      // Add to wishlist
      this.wishlist.push({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage
      });
      button.textContent = 'In Wishlist';
      button.style.backgroundColor = '#28a745';
    }

    this.saveWishlist();
    this.updateWishlistCount();
  }

  updateWishlistCount() {
    if (!this.wishlistCountEl) {
      return;
    }

    this.wishlistCountEl.textContent = this.wishlist.length;
    
    // Update all wishlist count elements
    const allWishlistCounts = document.querySelectorAll('#wishlistCount');
    allWishlistCounts.forEach(el => {
      el.textContent = this.wishlist.length;
    });
  }

  getWishlistItems() {
    return this.wishlist;
  }

  removeFromWishlist(productId) {
    this.wishlist = this.wishlist.filter(item => item.id !== productId);
    this.saveWishlist();
    this.updateWishlistCount();
  }
}

// Categories functionality
function initializeCategories() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const category = button.dataset.category;
      filterByCategory(category);
    });
  });
}

function filterByCategory(category) {
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const productCategory = card.dataset.category || 'electronics';
    
    if (category === 'all' || productCategory === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
  
  // Apply current filters if any
  applyCurrentFilters();
}

// Filters functionality
function initializeFilters() {
  const priceFilter = document.getElementById('price-filter');
  const ratingFilter = document.getElementById('rating-filter');
  const clearFiltersBtn = document.querySelector('.clear-filters-btn');
  
  if (priceFilter) {
    priceFilter.addEventListener('change', applyCurrentFilters);
  }
  
  if (ratingFilter) {
    ratingFilter.addEventListener('change', applyCurrentFilters);
  }
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', clearAllFilters);
  }
}

function applyCurrentFilters() {
  const priceFilter = document.getElementById('price-filter');
  const ratingFilter = document.getElementById('rating-filter');
  const selectedPrice = priceFilter ? priceFilter.value : 'all';
  const selectedRating = ratingFilter ? ratingFilter.value : 'all';
  
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    if (card.style.display === 'none') return; // Skip if hidden by category
    
    const price = parseFloat(card.dataset.price) || 0;
    const rating = parseFloat(card.dataset.rating) || 0;
    
    let showByPrice = selectedPrice === 'all';
    let showByRating = selectedRating === 'all';
    
    // Price filter logic
    if (selectedPrice === '0-25' && price < 25) showByPrice = true;
    if (selectedPrice === '25-35' && price >= 25 && price <= 35) showByPrice = true;
    if (selectedPrice === '35-50' && price >= 35 && price <= 50) showByPrice = true;
    if (selectedPrice === '50+' && price > 50) showByPrice = true;
    
    // Rating filter logic
    if (selectedRating === '4.5+' && rating >= 4.5) showByRating = true;
    if (selectedRating === '4+' && rating >= 4) showByRating = true;
    if (selectedRating === '3+' && rating >= 3) showByRating = true;
    
    // Show/hide based on filters
    if (showByPrice && showByRating) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function clearAllFilters() {
  const priceFilter = document.getElementById('price-filter');
  const ratingFilter = document.getElementById('rating-filter');
  const categoryButtons = document.querySelectorAll('.category-btn');
  
  if (priceFilter) priceFilter.value = 'all';
  if (ratingFilter) ratingFilter.value = 'all';
  
  categoryButtons.forEach(btn => btn.classList.remove('active'));
  document.querySelector('[data-category="all"]').classList.add('active');
  
  displayAllProducts();
}

// Search functionality
function initializeSearch() {
  const searchInput = document.querySelector('.search-bar input');
  const searchButton = document.querySelector('.search-bar button');
  
  if (searchInput && searchButton) {
    // Search on button click
    searchButton.addEventListener('click', performSearch);
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
}

function performSearch() {
  const searchInput = document.querySelector('.search-bar input');
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  if (!searchTerm) {
    displayAllProducts();
    return;
  }
  
  const productCards = document.querySelectorAll('.product-card');
  let foundProducts = 0;
  
  productCards.forEach(card => {
    const productName = card.dataset.productName?.toLowerCase() || '';
    const productPrice = card.dataset.price || '';
    
    if (productName.includes(searchTerm) || productPrice.includes(searchTerm)) {
      card.style.display = 'flex';
      foundProducts++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Show message if no products found
  const productsContainer = document.querySelector('.products');
  const existingMessage = document.querySelector('.no-results');
  
  if (existingMessage) {
    existingMessage.remove();
  }
  
  if (foundProducts === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #666;">
        <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px;"></i>
        <h3>No products found for "${searchTerm}"</h3>
        <p>Try different keywords or browse our categories</p>
      </div>
    `;
    productsContainer.appendChild(noResults);
  }
}

function displayAllProducts() {
  const productCards = document.querySelectorAll('.product-card');
  const noResults = document.querySelector('.no-results');
  
  productCards.forEach(card => {
    card.style.display = 'flex';
  });
  
  if (noResults) {
    noResults.remove();
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart
  window.cartManager = new CartManager();
  
  // Initialize wishlist
  window.wishlistManager = new WishlistManager();
  
  // Initialize search
  window.searchManager = new SearchManager();
  
  // Initialize categories
  initializeCategories();
  
  // Initialize filters
  initializeFilters();
  
  // Initialize search (legacy)
  initializeSearch();
});