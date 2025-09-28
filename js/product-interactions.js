class ProductInteractions {
constructor() {
this.wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
this.init();
}
init() {
this.bindEvents();
this.updateWishlistUI();
this.loadQuickViewModal();
}
bindEvents() {
document.addEventListener('click', this.handleClick.bind(this));
document.addEventListener('click', (e) => {
if (e.target.closest('.action-btn')) {
e.stopPropagation();
}
});
document.addEventListener('keydown', this.handleKeydown.bind(this));
}
handleClick(e) {
const target = e.target.closest('.action-btn, .product-card');
if (!target) return;
if (target.classList.contains('quick-view')) {
this.handleQuickView(target);
} else if (target.classList.contains('wishlist')) {
this.handleWishlist(target);
} else if (target.classList.contains('add-to-cart')) {
this.handleAddToCart(target);
} else if (target.classList.contains('product-card') && !target.closest('.action-btn')) {
this.handleProductClick(target);
}
}
handleKeydown(e) {
if (e.key === 'Escape') {
this.closeQuickView();
}
}
handleProductClick(card) {
const url = card.dataset.productUrl;
if (url) {
card.style.transform = 'scale(0.98)';
setTimeout(() => {
window.location.href = url;
}, 100);
}
}
handleQuickView(button) {
const productId = button.dataset.productId;
this.showQuickView(productId);
}
handleWishlist(button) {
const productId = button.dataset.productId;
button.classList.add('loading');
setTimeout(() => {
if (this.wishlistItems.includes(productId)) {
this.removeFromWishlist(productId);
this.showToast('Removed from wishlist', 'warning');
} else {
this.addToWishlist(productId);
this.showToast('Added to wishlist ❤️', 'success');
}
button.classList.remove('loading');
this.updateWishlistUI();
}, 500);
}
handleAddToCart(button) {
const productId = button.dataset.productId;
const productCard = button.closest('.product-card');
const productName = productCard.querySelector('h3')?.textContent || 'Product';
button.classList.add('loading');
setTimeout(() => {
this.addToCart(productId);
button.classList.remove('loading');
button.classList.add('success');
this.showToast(`${productName} added to cart! 🛒`, 'success');
setTimeout(() => {
button.classList.remove('success');
}, 2000);
}, 800);
}
addToWishlist(productId) {
if (!this.wishlistItems.includes(productId)) {
this.wishlistItems.push(productId);
localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
}
}
removeFromWishlist(productId) {
this.wishlistItems = this.wishlistItems.filter(id => id !== productId);
localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
}
addToCart(productId) {
const existingItem = this.cartItems.find(item => item.id === productId);
if (existingItem) {
existingItem.quantity = 1;
} else {
this.cartItems.push({ id: productId, quantity: 1 });
}
localStorage.setItem('cart', JSON.stringify(this.cartItems));
this.updateCartCount();
}
updateWishlistUI() {
document.querySelectorAll('.wishlist').forEach(button => {
const productId = button.dataset.productId;
if (this.wishlistItems.includes(productId)) {
button.classList.add('active');
button.title = 'Remove from Wishlist';
} else {
button.classList.remove('active');
button.title = 'Add to Wishlist';
}
});
}
updateCartCount() {
const cartCount = this.cartItems.reduce((total, item) => total  item.quantity, 0);
const cartBadges = document.querySelectorAll('.cart-count');
cartBadges.forEach(badge => {
badge.textContent = cartCount;
if (cartCount > 0) {
badge.style.display = 'block';
}
});
}
showQuickView(productId) {
const modal = document.getElementById('quickViewModal');
if (!modal) {
console.error('Quick view modal not found');
return;
}
const modalContent = modal.querySelector('.quick-view-content');
modalContent.innerHTML = `
<div style="padding: 40px; text-align: center;">
<div style="display: inline-block; width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #ff6b6b; border-radius: 50%; animation: spin 1s linear infinite;"></div>
<p style="margin-top: 16px; color: #666;">Loading product details...</p>
</div>
`;
modal.classList.add('active');
document.body.style.overflow = 'hidden';
setTimeout(() => {
this.loadQuickViewContent(productId, modalContent);
}, 1000);
}
loadQuickViewContent(productId, container) {
container.innerHTML = `
<button class="quick-view-close" onclick="productInteractions.closeQuickView()">×</button>
<div style="padding: 24px;">
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start;">
<div>
<img src="https://via.placeholder.com/300x300" alt="Product" style="width: 100%; border-radius: 8px;">
</div>
<div>
<h2 style="margin: 0 0 16px 0; color: #333;">Product Name</h2>
<div style="margin-bottom: 16px;">
<span style="font-size: 1.5em; font-weight: bold; color: #e74c3c;">₹1,350</span>
<span style="text-decoration: line-through; color: #999; margin-left: 8px;">₹1,500</span>
<span style="background: #2ecc71; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; margin-left: 8px;">10% OFF</span>
</div>
<p style="color: #666; line-height: 1.6; margin-bottom: 24px;">
This is a beautiful product with amazing features that will enhance your home decor.
</p>
<div style="display: flex; gap: 12px;">
<button onclick="productInteractions.addToCart('${productId}')" style="flex: 1; background: #2ecc71; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
Add to Cart
</button>
<button onclick="productInteractions.goToProduct('${productId}')" style="flex: 1; background: #3498db; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
View Details
</button>
</div>
</div>
</div>
</div>
`;
}
closeQuickView() {
const modal = document.getElementById('quickViewModal');
if (modal) {
modal.classList.remove('active');
document.body.style.overflow = '';
}
}
goToProduct(productId) {
const productCard = document.querySelector(`[data-product-id="${productId}"]`);
if (productCard && productCard.dataset.productUrl) {
window.location.href = productCard.dataset.productUrl;
}
}
loadQuickViewModal() {
if (!document.getElementById('quickViewModal')) {
const modal = document.createElement('div');
modal.id = 'quickViewModal';
modal.className = 'quick-view-modal';
modal.innerHTML = '<div class="quick-view-content"></div>';
document.body.appendChild(modal);
modal.addEventListener('click', (e) => {
if (e.target === modal) {
this.closeQuickView();
}
});
}
}
showToast(message, type = 'success') {
const existingToast = document.querySelector('.toast-notification');
if (existingToast) {
existingToast.remove();
}
const toast = document.createElement('div');
toast.className = `toast-notification ${type}`;
toast.textContent = message;
document.body.appendChild(toast);
setTimeout(() => toast.classList.add('show'), 100);
setTimeout(() => {
toast.classList.remove('show');
setTimeout(() => toast.remove(), 300);
}, 3000);
}
}
document.addEventListener('DOMContentLoaded', () => {
window.productInteractions = new ProductInteractions();
});
window.ProductInteractions = ProductInteractions;
