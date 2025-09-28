function changeMainImage(imageUrl, thumbnailElement) {
const mainImage = document.getElementById('mainProductImage');
if (imageUrl === 'placeholder') {
return;
}
const productName = mainImage.dataset.productName || 'Product';
const productEmoji = mainImage.dataset.productEmoji || '✨';
mainImage.innerHTML = `
<img src="${imageUrl}" alt="${productName}"
style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;"
onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
<div class="placeholder-content" style="display: none;">
<div class="placeholder-icon">${productEmoji}</div>
<div class="placeholder-text">${productName}</div>
<div class="placeholder-subtext">Premium Quality ✨</div>
</div>
`;
const thumbnails = document.querySelectorAll('.thumbnail-placeholder');
thumbnails.forEach(thumb => thumb.classList.remove('active'));
if (thumbnailElement) {
thumbnailElement.classList.add('active');
}
}
function increaseQuantity() {
const quantityInput = document.getElementById('quantity');
const currentValue = parseInt(quantityInput.value);
const maxValue = parseInt(quantityInput.max);
if (currentValue < maxValue) {
quantityInput.value = currentValue  1;
}
}
function decreaseQuantity() {
const quantityInput = document.getElementById('quantity');
const currentValue = parseInt(quantityInput.value);
const minValue = parseInt(quantityInput.min);
if (currentValue > minValue) {
quantityInput.value = currentValue - 1;
}
}
document.addEventListener('DOMContentLoaded', function() {
const addToCartBtn = document.querySelector('.add-to-cart');
if (addToCartBtn) {
addToCartBtn.addEventListener('click', function() {
const quantity = document.getElementById('quantity').value;
alert(`Added ${quantity} item(s) to cart! ✨`);
});
}
const buyNowBtn = document.querySelector('.buy-now');
if (buyNowBtn) {
buyNowBtn.addEventListener('click', function() {
const url = buyNowBtn.getAttribute('data-href');
if (url) {
window.open(url, '_blank');
}
});
}
const wishlistBtn = document.querySelector('.btn-wishlist');
if (wishlistBtn) {
wishlistBtn.addEventListener('click', function() {
alert('Added to wishlist! 💖');
});
}
const loadMoreBtn = document.querySelector('.load-more-reviews');
if (loadMoreBtn) {
loadMoreBtn.addEventListener('click', function() {
alert('Loading more reviews... ⭐');
});
}
const increaseBtn = document.getElementById('increaseQty');
const decreaseBtn = document.getElementById('decreaseQty');
if (increaseBtn) {
increaseBtn.addEventListener('click', increaseQuantity);
}
if (decreaseBtn) {
decreaseBtn.addEventListener('click', decreaseQuantity);
}
document.querySelectorAll('.thumbnail-placeholder').forEach(thumb => {
thumb.addEventListener('click', function() {
const imageUrl = this.dataset.imageUrl;
changeMainImage(imageUrl, this);
});
});
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
if (prevBtn) {
prevBtn.addEventListener('click', () => slideImages('prev'));
}
if (nextBtn) {
nextBtn.addEventListener('click', () => slideImages('next'));
}
document.querySelectorAll('.btn-primary[data-product-url]').forEach(btn => {
btn.addEventListener('click', function(e) {
e.stopPropagation();
const url = this.dataset.productUrl;
if (url) {
window.location.href = url;
}
});
});
});
let currentSlide = 0;
let autoScrollInterval;
let isAutoScrolling = true;
function slideImages(direction) {
const wrapper = document.getElementById('sliderWrapper');
const thumbnails = wrapper.querySelectorAll('.thumbnail-placeholder:not(.empty)');
const totalImages = thumbnails.length;
if (totalImages <= 4) return;
const thumbnailWidth = 100 / 4; // Each thumbnail is 1/4 of container
const maxSlide = totalImages - 4;
if (direction === 'next') {
currentSlide++;
if (currentSlide > maxSlide) {
currentSlide = 0;
}
} else {
currentSlide--;
if (currentSlide < 0) {
currentSlide = maxSlide;
}
}
const transformValue = currentSlide * thumbnailWidth;
wrapper.style.transform = `translateX(-${transformValue}%)`;
stopAutoScroll();
startAutoScroll();
}
function startAutoScroll() {
const wrapper = document.getElementById('sliderWrapper');
if (!wrapper) return;
const thumbnails = wrapper.querySelectorAll('.thumbnail-placeholder:not(.empty)');
if (thumbnails.length <= 4) return;
stopAutoScroll();
autoScrollInterval = setInterval(() => {
if (isAutoScrolling) {
slideImages('next');
}
}, 3000); // Change image every 3 seconds
}
function stopAutoScroll() {
if (autoScrollInterval) {
clearInterval(autoScrollInterval);
autoScrollInterval = null;
}
}
document.addEventListener('DOMContentLoaded', function() {
const slider = document.getElementById('thumbnailSlider');
if (slider) {
slider.addEventListener('mouseenter', () => {
isAutoScrolling = false;
});
slider.addEventListener('mouseleave', () => {
isAutoScrolling = true;
});
startAutoScroll();
}
updateArrowButtons();
});
window.addEventListener('resize', function() {
currentSlide = 0;
const wrapper = document.getElementById('sliderWrapper');
if (wrapper) {
wrapper.style.transform = 'translateX(0)';
}
stopAutoScroll();
startAutoScroll();
});
function updateArrowButtons() {
const wrapper = document.getElementById('sliderWrapper');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
if (!wrapper || !prevBtn || !nextBtn) return;
const thumbnails = wrapper.querySelectorAll('.thumbnail-placeholder:not(.empty)');
const maxSlide = Math.max(0, thumbnails.length - 4);
prevBtn.disabled = false;
nextBtn.disabled = false;
}
window.addEventListener('load', function() {
const loading = document.querySelector('.loading');
if (loading) {
loading.style.display = 'none';
}
});
