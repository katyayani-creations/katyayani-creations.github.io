// Global Search with Autocomplete Functionality
class GlobalSearch {
    constructor() {
        this.searchInput = document.getElementById('global-search');
        this.suggestionsContainer = document.getElementById('search-suggestions');
        this.searchBtn = document.querySelector('.search-btn');
        
        this.debounceTimer = null;
        this.currentIndex = -1;
        this.suggestions = [];
        
        this.init();
    }
    
    init() {
        if (!this.searchInput || !this.suggestionsContainer) return;
        
        // Event listeners
        this.searchInput.addEventListener('input', this.handleInput.bind(this));
        this.searchInput.addEventListener('keydown', this.handleKeydown.bind(this));
        this.searchInput.addEventListener('focus', this.handleFocus.bind(this));
        this.searchInput.addEventListener('blur', this.handleBlur.bind(this));
        
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', this.handleSearch.bind(this));
        }
        
        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.suggestionsContainer.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }
    
    handleInput(e) {
        const query = e.target.value.trim();
        
        // Clear previous timer
        clearTimeout(this.debounceTimer);
        
        if (query.length < 1) {
            this.hideSuggestions();
            return;
        }
        
        // Debounce search requests
        this.debounceTimer = setTimeout(() => {
            this.fetchSuggestions(query);
        }, 300);
    }
    
    handleKeydown(e) {
        const items = this.suggestionsContainer.querySelectorAll('.suggestion-item');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.currentIndex = Math.min(this.currentIndex + 1, items.length - 1);
                this.updateSelection(items);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.currentIndex = Math.max(this.currentIndex - 1, -1);
                this.updateSelection(items);
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.currentIndex >= 0 && items[this.currentIndex]) {
                    this.selectSuggestion(this.suggestions[this.currentIndex]);
                } else {
                    this.handleSearch();
                }
                break;
                
            case 'Escape':
                this.hideSuggestions();
                this.searchInput.blur();
                break;
        }
    }
    
    handleFocus() {
        const query = this.searchInput.value.trim();
        if (query.length === 0) {
            // Show popular suggestions when focused with empty input
            this.fetchSuggestions('');
        } else if (query.length >= 1) {
            // Show suggestions for any query length on focus
            this.fetchSuggestions(query);
        }
    }
    
    handleBlur() {
        // Delay hiding to allow click on suggestions
        setTimeout(() => {
            this.hideSuggestions();
        }, 200);
    }
    
    handleSearch() {
        const query = this.searchInput.value.trim();
        if (query) {
            window.location.href = `products.php?search=${encodeURIComponent(query)}`;
        }
    }
    
    fetchSuggestions(query) {
        // Check if availableTags is loaded
        if (typeof availableTags === 'undefined' || !availableTags.length) {
            this.hideSuggestions();
            return;
        }
        
        if (query === '') {
            this.hideSuggestions();
            return;
        }
        
        // Filter tags that match the query
        const lowerQuery = query.toLowerCase();
        this.suggestions = availableTags
            .filter(tag => 
                tag.label.toLowerCase().includes(lowerQuery) ||
                tag.value.toLowerCase().includes(lowerQuery) ||
                tag.sku.toLowerCase().includes(lowerQuery)
            )
            .sort((a, b) => {
                // Prioritize exact value matches
                const aExact = a.value.toLowerCase().startsWith(lowerQuery) ? 0 : 1;
                const bExact = b.value.toLowerCase().startsWith(lowerQuery) ? 0 : 1;
                return aExact - bExact;
            })
            .slice(0, 10);
        
        if (this.suggestions.length > 0) {
            this.renderSuggestions();
            this.showSuggestions();
        } else {
            this.hideSuggestions();
        }
    }
    
    renderSuggestions() {
        if (this.suggestions.length === 0) {
            this.suggestionsContainer.innerHTML = `
                <div class="no-results">
                    <span class="no-results-icon">😔</span>
                    <span>No results found</span>
                </div>
            `;
            return;
        }
        
        const html = this.suggestions.map((suggestion, index) => {
            return `
                <div class="suggestion-item" data-index="${index}">
                    <div class="suggestion-content">
                        <div class="suggestion-text">
                            <div class="suggestion-title">
                                ${suggestion.value}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        this.suggestionsContainer.innerHTML = html;
        
        // Add click handlers
        this.suggestionsContainer.querySelectorAll('.suggestion-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.selectSuggestion(this.suggestions[index]);
            });
        });
    }
    
    
    updateSelection(items) {
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.currentIndex);
        });
        
        // Scroll to selected item
        if (this.currentIndex >= 0 && items[this.currentIndex]) {
            items[this.currentIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }
    
    selectSuggestion(suggestion) {
        this.hideSuggestions();
        this.searchInput.value = suggestion.value;
        
        // Navigate to the product page
        if (suggestion.url) {
            window.location.href = suggestion.url;
        }
    }
    
    showSuggestions() {
        this.suggestionsContainer.classList.remove('hidden');
        this.currentIndex = -1;
    }
    
    hideSuggestions() {
        this.suggestionsContainer.classList.add('hidden');
        this.currentIndex = -1;
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GlobalSearch();
});