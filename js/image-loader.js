/**
* Image Loader with CORS and Fallback Support
* Handles CDN image loading with automatic fallback to local images
*/
class ImageLoader {
constructor() {
this.retryAttempts = 2;
this.retryDelay = 1000; // 1 second
this.lazyObserver = null;
this.initLazyLoading();
}
/**
* Initialize lazy loading with IntersectionObserver
*/
initLazyLoading() {
if (!window.IntersectionObserver) {
this.loadAllImages();
return;
}
const options = {
root: null,
rootMargin: '50px 0px', // Start loading 50px before element enters viewport
threshold: 0.01
};
this.lazyObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
const target = entry.target;
if (target.tagName.toLowerCase() === 'picture') {
const img = target.querySelector('img');
const originalSrc = target.getAttribute('data-original-src');
if (img && originalSrc) {
img.src = originalSrc;
target.removeAttribute('data-original-src');
}
this.lazyObserver.unobserve(target);
}
else if (target.tagName.toLowerCase() === 'img') {
if (target.getAttribute('data-cdn-src')) {
this.loadImage(target);
}
else if (target.getAttribute('data-src')) {
this.loadRegularImage(target);
}
this.lazyObserver.unobserve(target);
}
}
});
}, options);
}
/**
* Load a single image (either eager or lazy)
* @param {HTMLImageElement} img - Image element to load
*/
loadImage(img) {
const cdnUrl = img.getAttribute('data-cdn-src');
const fallbackUrl = img.getAttribute('data-fallback-src') || img.src;
if (cdnUrl) {
this.loadImageWithFallback(
img,
cdnUrl,
fallbackUrl,
(url, isFallback) => {
img.classList.add(isFallback ? 'loaded-fallback' : 'loaded-cdn');
img.classList.remove('lazy-loading');
},
(url, attempts) => {
img.classList.add('load-failed');
img.classList.remove('lazy-loading');
}
);
}
}
/**
* Fallback for browsers without IntersectionObserver
*/
loadAllImages() {
const images = document.querySelectorAll('img[data-cdn-src]');
images.forEach(img => this.loadImage(img));
}
/**
* Load image with fallback mechanism
* @param {HTMLImageElement} imgElement - The image element to load
* @param {string} cdnUrl - Primary CDN URL
* @param {string} fallbackUrl - Fallback local URL
* @param {Function} onLoad - Success callback
* @param {Function} onError - Error callback
*/
loadImageWithFallback(imgElement, cdnUrl, fallbackUrl, onLoad = null, onError = null) {
let attempts = 0;
const tryLoad = (url, isFallback = false) => {
imgElement.onerror = null;
imgElement.onload = null;
imgElement.onload = () => {
if (onLoad) onLoad(url, isFallback);
console.log(`Image loaded successfully: ${url}`);
};
imgElement.onerror = () => {
attempts++;
console.warn(`Failed to load image (attempt ${attempts}): ${url}`);
if (!isFallback && fallbackUrl) {
console.log(`Trying fallback: ${fallbackUrl}`);
setTimeout(() => tryLoad(fallbackUrl, true), this.retryDelay);
} else if (attempts < this.retryAttempts && !isFallback) {
setTimeout(() => tryLoad(url, false), this.retryDelay * attempts);
} else {
console.error(`All attempts failed for image: ${cdnUrl}`);
if (onError) onError(url, attempts);
imgElement.style.display = 'none';
const parent = imgElement.parentNode;
if (parent && parent.querySelector('.placeholder-content')) {
parent.querySelector('.placeholder-content').style.display = 'block';
}
}
};
if (!isFallback) {
imgElement.crossOrigin = 'anonymous';
} else {
imgElement.removeAttribute('crossorigin');
}
imgElement.src = url;
};
tryLoad(cdnUrl);
}
/**
* Initialize all images on the page with lazy loading support
* Handles both regular img tags and picture elements
*/
initializeImages() {
const images = document.querySelectorAll('img');
images.forEach(img => {
const loading = img.getAttribute('loading');
const cdnUrl = img.getAttribute('data-cdn-src');
const isInPicture = img.parentElement && img.parentElement.tagName.toLowerCase() === 'picture';
if (loading === 'eager' || img.getAttribute('fetchpriority') === 'high') {
if (cdnUrl) {
this.loadImage(img);
}
} else if (loading === 'lazy' || !loading) {
if (cdnUrl) {
img.classList.add('lazy-loading');
if (this.lazyObserver) {
this.lazyObserver.observe(img);
} else {
this.loadImage(img);
}
} else {
if (this.lazyObserver && loading === 'lazy') {
const originalSrc = img.src;
if (isInPicture) {
const picture = img.parentElement;
if (!picture.hasAttribute('data-observed')) {
picture.setAttribute('data-observed', 'true');
picture.setAttribute('data-original-src', originalSrc);
img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
this.lazyObserver.observe(picture);
}
} else {
img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
img.setAttribute('data-src', originalSrc);
this.lazyObserver.observe(img);
}
}
}
}
});
}
/**
* Handle regular lazy loaded images (non-CDN)
* @param {HTMLImageElement} img - Image element
*/
loadRegularImage(img) {
const dataSrc = img.getAttribute('data-src');
if (dataSrc) {
img.src = dataSrc;
img.removeAttribute('data-src');
}
}
/**
* Preload critical images
* @param {Array} imageUrls - Array of {cdn, fallback} objects
*/
preloadImages(imageUrls) {
imageUrls.forEach(urls => {
const img = new Image();
this.loadImageWithFallback(img, urls.cdn, urls.fallback);
});
}
}
window.ImageLoader = new ImageLoader();
document.addEventListener('DOMContentLoaded', function() {
window.ImageLoader.initializeImages();
});
const observer = new MutationObserver(function(mutations) {
mutations.forEach(function(mutation) {
mutation.addedNodes.forEach(function(node) {
if (node.nodeType === 1) { // Element node
const images = node.querySelectorAll ? node.querySelectorAll('img[data-cdn-src]') : [];
images.forEach(img => {
const cdnUrl = img.getAttribute('data-cdn-src');
const fallbackUrl = img.getAttribute('data-fallback-src') || img.src;
if (cdnUrl) {
window.ImageLoader.loadImageWithFallback(img, cdnUrl, fallbackUrl);
}
});
}
});
});
});
observer.observe(document.body, {
childList: true,
subtree: true
});
