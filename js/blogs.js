function handleCategoryFilter(select) {
    const category = select.value;
    const url = new URL(window.location);
    if (category) {
        url.searchParams.set('category', category);
    } else {
        url.searchParams.delete('category');
    }
    window.location.href = url.toString();
}

// Sort functionality
document.addEventListener('DOMContentLoaded', function() {
    const sortSelect = document.getElementById('sort-filter');
    const blogGrid = document.querySelector('.blog-grid');
    
    if (sortSelect && blogGrid) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const blogCards = Array.from(blogGrid.querySelectorAll('.blog-card'));
            
            blogCards.sort((a, b) => {
                const titleA = a.querySelector('.blog-title').textContent;
                const titleB = b.querySelector('.blog-title').textContent;
                const dateA = a.querySelector('.blog-date').textContent;
                const dateB = b.querySelector('.blog-date').textContent;
                
                switch (sortValue) {
                    case 'title':
                        return titleA.localeCompare(titleB);
                    case 'date-old':
                        return new Date(dateA) - new Date(dateB);
                    case 'date-new':
                    default:
                        return new Date(dateB) - new Date(dateA);
                }
            });
            
            // Re-append sorted elements
            blogCards.forEach(card => blogGrid.appendChild(card));
        });
    }
});