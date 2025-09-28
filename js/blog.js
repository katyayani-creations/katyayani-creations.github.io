// Share functions
function shareOnFacebook() {
    const url = encodeURIComponent(blogData.url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
    const url = encodeURIComponent(blogData.url);
    const text = encodeURIComponent(blogData.title + ' - Check out this amazing blog post!');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
}

function shareOnWhatsApp() {
    const text = encodeURIComponent(blogData.title + ' - ' + blogData.url);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(blogData.url).then(function() {
        // Show success message
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✓ Link Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
        // Fallback for older browsers
        const input = document.createElement('input');
        input.value = blogData.url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        
        // Show success message
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✓ Link Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    });
}

// Add smooth scroll for anchor links within blog content
document.addEventListener('DOMContentLoaded', function() {
    // Handle anchor links in blog content
    const blogContent = document.querySelector('.blog-content');
    if (blogContent) {
        const anchorLinks = blogContent.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Add reading progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', updateReadingProgress);
    
    function updateReadingProgress() {
        const article = document.querySelector('.blog-content-section');
        if (!article) return;
        
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        const progress = Math.max(0, Math.min(100, 
            ((scrollY - articleTop + windowHeight) / articleHeight) * 100
        ));
        
        progressBar.style.width = progress + '%';
    }
    
    // Initialize progress
    updateReadingProgress();
    
    // Highlight code blocks if any
    const codeBlocks = document.querySelectorAll('.blog-content pre code');
    codeBlocks.forEach(block => {
        block.classList.add('code-highlight');
    });
    
    // Make images in blog content responsive
    const blogImages = document.querySelectorAll('.blog-content img');
    blogImages.forEach(img => {
        if (!img.classList.contains('emoji') && !img.classList.contains('icon')) {
            img.classList.add('blog-content-image');
            
            // Add click to view full size
            img.addEventListener('click', function() {
                const overlay = document.createElement('div');
                overlay.className = 'image-overlay';
                
                const fullImage = document.createElement('img');
                fullImage.src = this.src;
                fullImage.alt = this.alt;
                
                overlay.appendChild(fullImage);
                document.body.appendChild(overlay);
                
                overlay.addEventListener('click', function() {
                    this.remove();
                });
            });
        }
    });
});