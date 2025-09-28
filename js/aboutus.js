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
const observerOptions = {
threshold: 0.1,
rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('animate-in');
}
});
}, observerOptions);
document.querySelectorAll('section').forEach(section => {
observer.observe(section);
});
window.addEventListener('load', function() {
const loading = document.querySelector('.loading');
if (loading) {
loading.style.display = 'none';
}
});
