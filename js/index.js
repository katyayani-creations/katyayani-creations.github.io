document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
e.preventDefault();
const target = document.querySelector(this.getAttribute('href'));
if (target) {
target.scrollIntoView({
behavior: 'smooth',
block: 'start'
});
}
});
});
window.addEventListener('scroll', () => {
const header = document.querySelector('header');
if (window.scrollY > 100) {
header.style.background = 'rgba(255, 107, 157, 0.95)';
} else {
header.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #f8b500 100%)';
}
});
window.addEventListener('load', () => {
setTimeout(() => {
document.querySelector('.loading').style.display = 'none';
}, 2000);
});
function scrollProducts(button, direction) {
const container = button.parentElement;
const productsGrid = container.querySelector('.products-grid');
const containerWidth = productsGrid.clientWidth;
const scrollAmount = containerWidth; // Scroll by full container width to show next 3 products
if (direction === 'left') {
productsGrid.scrollBy({
left: -scrollAmount,
behavior: 'smooth'
});
} else {
productsGrid.scrollBy({
left: scrollAmount,
behavior: 'smooth'
});
}
}
function updateScrollButtons() {
document.querySelectorAll('.products-grid').forEach(grid => {
const container = grid.parentElement;
const leftBtn = container.querySelector('.scroll-button.left');
const rightBtn = container.querySelector('.scroll-button.right');
if (leftBtn && rightBtn) {
leftBtn.style.opacity = grid.scrollLeft > 0 ? '1' : '0.5';
rightBtn.style.opacity =
grid.scrollLeft < (grid.scrollWidth - grid.clientWidth) ? '1' : '0.5';
}
});
}
let autoScrollIntervals = new Map();
function startAutoScroll(grid) {
if (grid.dataset.autoScroll === 'true') {
stopAutoScroll(grid);
const interval = setInterval(() => {
if (!grid.matches(':hover') && !grid.classList.contains('user-scrolling')) {
autoScrollNext(grid);
}
}, 4000);
autoScrollIntervals.set(grid, interval);
}
}
function stopAutoScroll(grid) {
const interval = autoScrollIntervals.get(grid);
if (interval) {
clearInterval(interval);
autoScrollIntervals.delete(grid);
}
}
function autoScrollNext(grid) {
const cardWidth = 352; // card width  gap
const currentScroll = grid.scrollLeft;
const maxScroll = grid.scrollWidth - grid.clientWidth;
grid.classList.add('auto-scrolling');
if (currentScroll >= maxScroll - 50) {
setTimeout(() => {
grid.scrollTo({
left: 0,
behavior: 'smooth'
});
setTimeout(() => {
grid.classList.remove('auto-scrolling');
}, 1000);
}, 100);
} else {
grid.scrollBy({
left: cardWidth,
behavior: 'smooth'
});
setTimeout(() => {
grid.classList.remove('auto-scrolling');
}, 1000);
}
}
function scrollProducts(button, direction) {
const container = button.parentElement;
const productsGrid = container.querySelector('.products-grid');
const containerWidth = productsGrid.clientWidth;
const currentScroll = productsGrid.scrollLeft;
const maxScroll = productsGrid.scrollWidth - productsGrid.clientWidth;
productsGrid.classList.add('user-scrolling');
stopAutoScroll(productsGrid);
if (direction === 'left') {
if (currentScroll <= 10) {
productsGrid.scrollTo({
left: maxScroll,
behavior: 'smooth'
});
} else {
productsGrid.scrollBy({
left: -containerWidth,
behavior: 'smooth'
});
}
} else {
if (currentScroll >= maxScroll - 10) {
productsGrid.scrollTo({
left: 0,
behavior: 'smooth'
});
} else {
productsGrid.scrollBy({
left: containerWidth,
behavior: 'smooth'
});
}
}
setTimeout(() => {
productsGrid.classList.remove('user-scrolling');
setTimeout(() => {
startAutoScroll(productsGrid);
}, 8000); // Wait 8 seconds before restarting auto-scroll
}, 1000);
}
document.addEventListener('DOMContentLoaded', () => {
document.querySelectorAll('.products-grid').forEach(grid => {
grid.addEventListener('scroll', updateScrollButtons);
setTimeout(() => {
startAutoScroll(grid);
}, 3000); // Wait 3 seconds before starting auto-scroll
grid.addEventListener('mouseenter', () => {
grid.classList.add('user-hovering');
stopAutoScroll(grid);
});
grid.addEventListener('mouseleave', () => {
grid.classList.remove('user-hovering');
setTimeout(() => {
if (!grid.classList.contains('user-scrolling')) {
startAutoScroll(grid);
}
}, 2000);
});
grid.addEventListener('scroll', () => {
if (!grid.classList.contains('auto-scrolling')) {
grid.classList.add('user-scrolling');
stopAutoScroll(grid);
clearTimeout(grid.scrollTimeout);
grid.scrollTimeout = setTimeout(() => {
grid.classList.remove('user-scrolling');
if (!grid.classList.contains('user-hovering')) {
startAutoScroll(grid);
}
}, 5000);
}
});
});
updateScrollButtons();
});
let currentBannerSlide = 0;
let bannerAutoSlideInterval;
function showBanner(index) {
const bannerTrack = document.getElementById('bannerTrack');
const dots = document.querySelectorAll('.banner-dot');
const totalBanners = dots.length;
if (!bannerTrack || totalBanners === 0) return;
if (index >= totalBanners) index = 0;
if (index < 0) index = totalBanners - 1;
currentBannerSlide = index;
const translateX = -index * 100;
bannerTrack.style.transform = `translateX(${translateX}%)`;
dots.forEach((dot, i) => {
dot.classList.toggle('active', i === index);
});
}
function changeBanner(direction) {
showBanner(currentBannerSlide  direction);
clearInterval(bannerAutoSlideInterval);
startBannerAutoSlide();
}
function currentBanner(index) {
showBanner(index - 1); // Convert to 0-based index
clearInterval(bannerAutoSlideInterval);
startBannerAutoSlide();
}
function nextBanner() {
showBanner(currentBannerSlide  1);
}
function startBannerAutoSlide() {
const dots = document.querySelectorAll('.banner-dot');
if (dots.length > 1) {
bannerAutoSlideInterval = setInterval(nextBanner, 5000); // Change slide every 5 seconds
}
}
document.addEventListener('DOMContentLoaded', () => {
showBanner(0);
setTimeout(startBannerAutoSlide, 3000);
const bannerSlider = document.querySelector('.banner-slider');
if (bannerSlider) {
bannerSlider.addEventListener('mouseenter', () => {
clearInterval(bannerAutoSlideInterval);
});
bannerSlider.addEventListener('mouseleave', () => {
startBannerAutoSlide();
});
}
});
