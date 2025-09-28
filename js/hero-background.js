// Dynamic Hero Background Rotation
class HeroBackgroundRotator {
    constructor() {
        this.heroSection = document.querySelector('.hero[data-dynamic-bg="true"]');
        if (!this.heroSection) return;
        
        this.layer1 = this.heroSection.querySelector('.hero-bg-1');
        this.layer2 = this.heroSection.querySelector('.hero-bg-2');
        this.titleElement = document.getElementById('hero-title');
        this.subtitleElement = document.getElementById('hero-subtitle');
        
        // Get banners from data attribute
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
        
        // Start rotation if we have more than one banner
        if (this.banners.length > 1) {
            this.startRotation();
        } else {
        }
    }
    
    setBackground(layer, banner) {
        if (!layer || !banner) return;
        
        
        // Build the background style
        const imageUrl = banner.image_url || 'images/hero-background.png';
        const baseColor = banner.background_color || '#667eea';
        
        // Apply the background with semi-transparent gradient
        layer.style.background = `linear-gradient(135deg, ${baseColor}CC 0%, ${baseColor}99 100%), url('${imageUrl}') center/cover no-repeat`;
        layer.style.backgroundAttachment = 'scroll';
        
    }
    
    
    startRotation() {
        // Don't start if only one banner
        if (this.banners.length <= 1) return;
        
        // Clear any existing interval
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        
        // Start the rotation interval
        this.intervalId = setInterval(() => {
            this.rotateBackground();
        }, this.rotationInterval);
    }
    
    rotateBackground() {
        if (this.banners.length === 0) return;
        
        // Calculate next index
        this.currentIndex = (this.currentIndex + 1) % this.banners.length;
        const nextBanner = this.banners[this.currentIndex];
        
        
        // Determine which layer is active and which is inactive
        const activeLayer = this.layer1.classList.contains('active') ? this.layer1 : this.layer2;
        const inactiveLayer = activeLayer === this.layer1 ? this.layer2 : this.layer1;
        
        
        // Set the new background on the inactive layer
        this.setBackground(inactiveLayer, nextBanner);
        
        // Update hero content with smooth transition
        this.updateHeroContent(nextBanner);
        
        // Trigger the transition
        setTimeout(() => {
            activeLayer.classList.remove('active');
            inactiveLayer.classList.add('active');
        }, 50);
    }
    
    updateHeroContent(banner) {
        if (!banner) return;
        
        // Add fade out effect
        if (this.titleElement) {
            this.titleElement.style.opacity = '0.7';
            this.titleElement.style.transform = 'translateY(10px)';
        }
        if (this.subtitleElement) {
            this.subtitleElement.style.opacity = '0.7';
            this.subtitleElement.style.transform = 'translateY(10px)';
        }
        
        // Update content after short delay
        setTimeout(() => {
            if (this.titleElement && banner.title) {
                this.titleElement.textContent = banner.title;
            }
            if (this.subtitleElement && banner.subtitle) {
                this.subtitleElement.textContent = banner.subtitle;
            }
            
            // Fade back in
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
    
    // Public method to manually trigger rotation
    next() {
        this.rotateBackground();
        // Reset the interval
        this.stopRotation();
        this.startRotation();
    }
    
    // Public method to go to specific banner
    goTo(index) {
        if (index >= 0 && index < this.banners.length) {
            this.currentIndex = index - 1; // Subtract 1 because rotateBackground will increment
            this.rotateBackground();
            // Reset the interval
            this.stopRotation();
            this.startRotation();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const heroRotator = new HeroBackgroundRotator();
    
    // Expose to global scope for debugging/manual control if needed
    window.heroBackgroundRotator = heroRotator;
    
    // Add manual test trigger (remove after testing)
    setTimeout(() => {
        if (heroRotator.banners.length > 1) {
            heroRotator.rotateBackground();
        }
    }, 2000);
    
    // Pause rotation when page is not visible, resume when visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            heroRotator.stopRotation();
        } else {
            heroRotator.startRotation();
        }
    });
});