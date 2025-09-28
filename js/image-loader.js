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
        // Check for IntersectionObserver support
        if (!window.IntersectionObserver) {
            // Fallback for older browsers - load all images immediately
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
                    
                    // Handle picture elements
                    if (target.tagName.toLowerCase() === 'picture') {
                        const img = target.querySelector('img');
                        const originalSrc = target.getAttribute('data-original-src');
                        if (img && originalSrc) {
                            img.src = originalSrc;
                            target.removeAttribute('data-original-src');
                        }
                        this.lazyObserver.unobserve(target);
                    }
                    // Handle img elements
                    else if (target.tagName.toLowerCase() === 'img') {
                        // Handle CDN images
                        if (target.getAttribute('data-cdn-src')) {
                            this.loadImage(target);
                        }
                        // Handle regular lazy images
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
            // Reset any previous error handlers
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
                    // Try fallback URL
                    console.log(`Trying fallback: ${fallbackUrl}`);
                    setTimeout(() => tryLoad(fallbackUrl, true), this.retryDelay);
                } else if (attempts < this.retryAttempts && !isFallback) {
                    // Retry CDN URL
                    setTimeout(() => tryLoad(url, false), this.retryDelay * attempts);
                } else {
                    // All attempts failed
                    console.error(`All attempts failed for image: ${cdnUrl}`);
                    if (onError) onError(url, attempts);
                    
                    // Set a placeholder or hide the image
                    imgElement.style.display = 'none';
                    
                    // Try to show a placeholder if parent has placeholder content
                    const parent = imgElement.parentNode;
                    if (parent && parent.querySelector('.placeholder-content')) {
                        parent.querySelector('.placeholder-content').style.display = 'block';
                    }
                }
            };
            
            // Set crossorigin for CORS support
            if (!isFallback) {
                imgElement.crossOrigin = 'anonymous';
            } else {
                imgElement.removeAttribute('crossorigin');
            }
            
            // Load the image
            imgElement.src = url;
        };
        
        // Start with CDN URL
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
            
            // Handle images with loading="eager" or fetchpriority="high"
            if (loading === 'eager' || img.getAttribute('fetchpriority') === 'high') {
                // Load immediately for above-the-fold images
                if (cdnUrl) {
                    this.loadImage(img);
                }
            } else if (loading === 'lazy' || !loading) {
                // Set up lazy loading for other images
                if (cdnUrl) {
                    img.classList.add('lazy-loading');
                    if (this.lazyObserver) {
                        this.lazyObserver.observe(img);
                    } else {
                        // Fallback if no observer support
                        this.loadImage(img);
                    }
                } else {
                    // For regular images without CDN, still apply lazy loading
                    if (this.lazyObserver && loading === 'lazy') {
                        const originalSrc = img.src;
                        
                        // Handle picture elements differently
                        if (isInPicture) {
                            // For images inside picture elements, observe the picture element
                            const picture = img.parentElement;
                            if (!picture.hasAttribute('data-observed')) {
                                picture.setAttribute('data-observed', 'true');
                                picture.setAttribute('data-original-src', originalSrc);
                                
                                // Replace src with placeholder
                                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                                
                                this.lazyObserver.observe(picture);
                            }
                        } else {
                            // Use transparent 1x1 pixel as placeholder
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

// Global instance
window.ImageLoader = new ImageLoader();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.ImageLoader.initializeImages();
});

// Handle dynamically added images
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