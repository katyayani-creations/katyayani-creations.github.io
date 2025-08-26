// Common JavaScript utilities for all pages

// Scroll products functionality for sliders
function scrollProducts(button, direction) {
    const container = button.closest('.products-container').querySelector('.products-grid');
    const scrollAmount = 300;
    
    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Page loading animation (used by all pages)
window.addEventListener('load', function() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = 'none';
    }
});

// Smooth scrolling for internal links (used by multiple pages)
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

// Handle scroll button clicks
function initScrollButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.scroll-button')) {
            const direction = e.target.dataset.direction;
            scrollProducts(e.target, direction);
        }
    });
}

// Handle product and category card clicks
function initCardClicks() {
    // document.addEventListener('click', function(e) {
    //     const card = e.target.closest('.product-card, .category-card');
    //     if (card) {
    //         const url = card.dataset.productUrl || card.dataset.categoryUrl;
    //         if (url) {
    //             window.location.href = url;
    //         } else {
    //         }
    //     }
    // });
}

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    initScrollButtons();
    initCardClicks();
});