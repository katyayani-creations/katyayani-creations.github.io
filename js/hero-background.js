class HeroBackgroundRotator {
constructor() {
this.heroSection = document.querySelector('.hero[data-dynamic-bg="true"]');
if (!this.heroSection) return;
this.layer1 = this.heroSection.querySelector('.hero-bg-1');
this.layer2 = this.heroSection.querySelector('.hero-bg-2');
this.titleElement = document.getElementById('hero-title');
this.subtitleElement = document.getElementById('hero-subtitle');
try {
const bannersData = this.heroSection.dataset.banners;
this.banners = bannersData ? JSON.parse(bannersData) : [];
} catch (error) {
this.banners = [];
}
this.currentIndex = 0;
this.rotationInterval = 3000; // 3 seconds for testing
this.intervalId = null;
this.init();
}
init() {
if (this.banners.length > 1) {
this.startRotation();
} else {
}
}
setBackground(layer, banner) {
if (!layer || !banner) return;
const imageUrl = banner.image_url || 'images/hero-background.png';
const baseColor = banner.background_color || '#667eea';
layer.style.background = `linear-gradient(135deg, ${baseColor}CC 0%, ${baseColor}99 100%), url('${imageUrl}') center/cover no-repeat`;
layer.style.backgroundAttachment = 'scroll';
}
startRotation() {
if (this.banners.length <= 1) return;
if (this.intervalId) {
clearInterval(this.intervalId);
}
this.intervalId = setInterval(() => {
this.rotateBackground();
}, this.rotationInterval);
}
rotateBackground() {
if (this.banners.length === 0) return;
this.currentIndex = (this.currentIndex  1) % this.banners.length;
const nextBanner = this.banners[this.currentIndex];
const activeLayer = this.layer1.classList.contains('active') ? this.layer1 : this.layer2;
const inactiveLayer = activeLayer === this.layer1 ? this.layer2 : this.layer1;
this.setBackground(inactiveLayer, nextBanner);
this.updateHeroContent(nextBanner);
setTimeout(() => {
activeLayer.classList.remove('active');
inactiveLayer.classList.add('active');
}, 50);
}
updateHeroContent(banner) {
if (!banner) return;
if (this.titleElement) {
this.titleElement.style.opacity = '0.7';
this.titleElement.style.transform = 'translateY(10px)';
}
if (this.subtitleElement) {
this.subtitleElement.style.opacity = '0.7';
this.subtitleElement.style.transform = 'translateY(10px)';
}
setTimeout(() => {
if (this.titleElement && banner.title) {
this.titleElement.textContent = banner.title;
}
if (this.subtitleElement && banner.subtitle) {
this.subtitleElement.textContent = banner.subtitle;
}
if (this.titleElement) {
this.titleElement.style.opacity = '1';
this.titleElement.style.transform = 'translateY(0)';
}
if (this.subtitleElement) {
this.subtitleElement.style.opacity = '1';
this.subtitleElement.style.transform = 'translateY(0)';
}
}, 300);
}
stopRotation() {
if (this.intervalId) {
clearInterval(this.intervalId);
this.intervalId = null;
}
}
next() {
this.rotateBackground();
this.stopRotation();
this.startRotation();
}
goTo(index) {
if (index >= 0 && index < this.banners.length) {
this.currentIndex = index - 1; // Subtract 1 because rotateBackground will increment
this.rotateBackground();
this.stopRotation();
this.startRotation();
}
}
}
document.addEventListener('DOMContentLoaded', () => {
const heroRotator = new HeroBackgroundRotator();
window.heroBackgroundRotator = heroRotator;
setTimeout(() => {
if (heroRotator.banners.length > 1) {
heroRotator.rotateBackground();
}
}, 2000);
document.addEventListener('visibilitychange', () => {
if (document.hidden) {
heroRotator.stopRotation();
} else {
heroRotator.startRotation();
}
});
});
