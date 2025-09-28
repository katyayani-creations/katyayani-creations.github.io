document.getElementById('contactForm').addEventListener('submit', function(e) {
e.preventDefault();
const formData = new FormData(this);
const formObject = {};
formData.forEach((value, key) => {
formObject[key] = value;
});
showMessage('Thank you for your message! We\'ll get back to you soon. ✨', 'success');
this.reset();
});
document.querySelectorAll('.faq-question').forEach(question => {
question.addEventListener('click', function() {
const faqItem = this.parentElement;
const answer = faqItem.querySelector('.faq-answer');
const icon = this.querySelector('.faq-icon');
faqItem.classList.toggle('active');
icon.textContent = faqItem.classList.contains('active') ? '−' : '+';
});
});
function showMessage(text, type) {
const message = document.createElement('div');
message.className = `form-message ${type}`;
message.textContent = text;
const form = document.getElementById('contactForm');
form.appendChild(message);
setTimeout(() => {
message.remove();
}, 5000);
}
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
window.addEventListener('load', function() {
const loading = document.querySelector('.loading');
if (loading) {
loading.style.display = 'none';
}
});
document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea').forEach(field => {
field.addEventListener('blur', function() {
if (this.hasAttribute('required') && !this.value.trim()) {
this.classList.add('error');
} else {
this.classList.remove('error');
}
});
field.addEventListener('input', function() {
if (this.classList.contains('error') && this.value.trim()) {
this.classList.remove('error');
}
});
});
