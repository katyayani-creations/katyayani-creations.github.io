function scrollProducts(button, direction) {
const container = button.closest('.products-container').querySelector('.products-grid');
const scrollAmount = 300;
if (direction === 'left') {
container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
} else {
container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}
}
function initMobileMenu() {
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
if (mobileMenuToggle && mobileNav) {
mobileMenuToggle.addEventListener('click', function() {
const isActive = this.classList.contains('active');
if (isActive) {
this.classList.remove('active');
mobileNav.classList.remove('active');
this.setAttribute('aria-expanded', 'false');
document.body.style.overflow = '';
} else {
this.classList.add('active');
mobileNav.classList.add('active');
this.setAttribute('aria-expanded', 'true');
document.body.style.overflow = 'hidden';
}
});
mobileNav.addEventListener('click', function(e) {
if (e.target.tagName === 'A') {
mobileMenuToggle.classList.remove('active');
mobileNav.classList.remove('active');
mobileMenuToggle.setAttribute('aria-expanded', 'false');
document.body.style.overflow = '';
}
});
document.addEventListener('click', function(e) {
if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
mobileMenuToggle.classList.remove('active');
mobileNav.classList.remove('active');
mobileMenuToggle.setAttribute('aria-expanded', 'false');
document.body.style.overflow = '';
}
});
window.addEventListener('resize', function() {
if (window.innerWidth > 768) {
mobileMenuToggle.classList.remove('active');
mobileNav.classList.remove('active');
mobileMenuToggle.setAttribute('aria-expanded', 'false');
document.body.style.overflow = '';
}
});
}
}
window.addEventListener('load', function() {
const loading = document.querySelector('.loading');
if (loading) {
loading.style.display = 'none';
}
});
function initSmoothScrolling() {
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
}
function initScrollButtons() {
document.addEventListener('click', function(e) {
if (e.target.matches('.scroll-button')) {
const direction = e.target.dataset.direction;
scrollProducts(e.target, direction);
}
});
}
function initCardClicks() {
}
document.addEventListener('DOMContentLoaded', function() {
initMobileMenu();
initSmoothScrolling();
initScrollButtons();
initCardClicks();
});
