// Product Page JavaScript

// Product image functionality
function changeMainImage(imageUrl, thumbnailElement) {
    const mainImage = document.getElementById('mainProductImage');
    
    if (imageUrl === 'placeholder') {
        // Keep placeholder content as is for fallback
        return;
    }
    
    // Replace main image content with actual image
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
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail-placeholder');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    if (thumbnailElement) {
        thumbnailElement.classList.add('active');
    }
}

// Quantity controls
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    const maxValue = parseInt(quantityInput.max);
    
    if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1;
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

// Add to cart functionality
document.addEventListener('DOMContentLoaded', function() {
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = document.getElementById('quantity').value;
            alert(`Added ${quantity} item(s) to cart! ✨`);
        });
    }

    // Buy now functionality
    const buyNowBtn = document.querySelector('.buy-now');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            const url = buyNowBtn.getAttribute('data-href');
            if (url) {
                window.open(url, '_blank');
            }
        });
    }

    // Wishlist functionality
    const wishlistBtn = document.querySelector('.btn-wishlist');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            alert('Added to wishlist! 💖');
        });
    }

    // Load more reviews
    const loadMoreBtn = document.querySelector('.load-more-reviews');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            alert('Loading more reviews... ⭐');
        });
    }

    // Quantity controls
    const increaseBtn = document.getElementById('increaseQty');
    const decreaseBtn = document.getElementById('decreaseQty');
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', increaseQuantity);
    }
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', decreaseQuantity);
    }

    // Thumbnail click handlers
    document.querySelectorAll('.thumbnail-placeholder').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const imageUrl = this.dataset.imageUrl;
            changeMainImage(imageUrl, this);
        });
    });

    // Slider arrow handlers
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => slideImages('prev'));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => slideImages('next'));
    }

    // View Details button handler
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

// Image slider functionality
let currentSlide = 0;
let autoScrollInterval;
let isAutoScrolling = true;

function slideImages(direction) {
    const wrapper = document.getElementById('sliderWrapper');
    const thumbnails = wrapper.querySelectorAll('.thumbnail-placeholder:not(.empty)');
    const totalImages = thumbnails.length;
    
    // Only scroll if more than 4 images
    if (totalImages <= 4) return;
    
    // Calculate the width of one thumbnail plus gap
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
    
    // Calculate transform based on thumbnail width
    const transformValue = currentSlide * thumbnailWidth;
    wrapper.style.transform = `translateX(-${transformValue}%)`;
    
    // Reset auto-scroll when user interacts
    stopAutoScroll();
    startAutoScroll();
}

function startAutoScroll() {
    const wrapper = document.getElementById('sliderWrapper');
    if (!wrapper) return;
    
    const thumbnails = wrapper.querySelectorAll('.thumbnail-placeholder:not(.empty)');
    
    // Only auto-scroll if more than 4 images
    if (thumbnails.length <= 4) return;
    
    // Clear any existing interval
    stopAutoScroll();
    
    // Start auto-scrolling
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

// Pause auto-scroll on hover
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('thumbnailSlider');
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            isAutoScrolling = false;
        });
        
        slider.addEventListener('mouseleave', () => {
            isAutoScrolling = true;
        });
        
        // Start auto-scroll
        startAutoScroll();
    }
    
    // Initialize arrow button states
    updateArrowButtons();
});

// Handle window resize
window.addEventListener('resize', function() {
    // Reset position on resize
    currentSlide = 0;
    const wrapper = document.getElementById('sliderWrapper');
    if (wrapper) {
        wrapper.style.transform = 'translateX(0)';
    }
    
    // Restart auto-scroll with new dimensions
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
    
    // Always enable both buttons for infinite scroll
    prevBtn.disabled = false;
    nextBtn.disabled = false;
}

// Page loading animation
window.addEventListener('load', function() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = 'none';
    }
});