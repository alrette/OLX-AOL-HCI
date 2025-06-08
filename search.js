// search.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Component Loading Logic ---
    function initNavbar() {
        if (typeof ProfessionalNavbar === 'function') new ProfessionalNavbar();
    }
    const loadHTML = async (elementId, filePath, callback) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Failed to fetch ${filePath}`);
            element.innerHTML = await response.text();
            if (callback) callback();
        } catch (error) { console.error(`Error loading content for #${elementId}:`, error); }
    };
    loadHTML('navbar-placeholder', 'navbar.html', initNavbar);
    loadHTML('footer-placeholder', 'footer.html', window.initFooter);
    
    class ProductStore {
        constructor() {
            this.products = [];
            this.currentFilter = 'terkait';
            this.init();
        }

        async init() {
            await this.loadProducts();
            this.setupEventListeners();
            this.renderProducts();
        }

        async loadProducts() {
            try {
                const response = await fetch('data.json');
                if (!response.ok) throw new Error('Network response was not ok.');
                const data = await response.json();
                this.products = data.products;
            } catch (error) {
                console.error('Error loading products:', error);
                this.showError();
            }
        }

        setupEventListeners() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentFilter = e.target.dataset.filter;
                    this.renderProducts();
                });
            });
        }

        sortProducts(products, filter) {
            let sorted = [...products];
            switch (filter) {
                case 'terkait': sorted.sort((a, b) => b.popularity - a.popularity); break;
                case 'terbaru': sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)); break;
                case 'terlaris': sorted.sort((a, b) => b.reviews - a.reviews); break;
            }
            const championIndex = sorted.findIndex(p => p.isChampion);
            if (championIndex > 0) {
                const champion = sorted.splice(championIndex, 1)[0];
                sorted.unshift(champion);
            }
            return sorted;
        }

        generateStars(rating) {
            let stars = '';
            for (let i = 1; i <= 5; i++) { stars += (i <= rating) ? '★' : '☆'; }
            return stars;
        }

        formatNumber(num) {
            if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'rb';
            return num.toString();
        }

        createProductCard(product) {
            const championClass = product.isChampion ? 'champion' : '';
            const originalPriceHtml = product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : '';

            // ✨ FIX: The href attribute is now always "product.html"
            return `
                <a href="product.html" class="product-card-link">
                    <div class="product-card ${championClass}">
                        <img src="${product.image}" alt="${product.name}" class="product-image" 
                             onerror="this.onerror=null; this.src='https://placehold.co/280x200/f5f5f5/cccccc?text=Image+Not+Found';">
                        <div class="product-info">
                            <h3 class="product-title">${product.name}</h3>
                            <div class="price-section">
                                <span class="current-price">${product.price}</span>
                                ${originalPriceHtml}
                            </div>
                            <div class="rating-section">
                                <span class="stars">${this.generateStars(product.rating)}</span>
                                <span class="rating-text">${product.rating}</span>
                                <span class="reviews-count">| Terjual ${this.formatNumber(product.reviews)}</span>
                            </div>
                        </div>
                    </div>
                </a>
            `;
        }

        renderProducts() {
            const grid = document.getElementById('productsGrid');
            const showingText = document.getElementById('showingText');
            if (this.products.length === 0) {
                grid.innerHTML = '<div class="loading">Loading products...</div>';
                return;
            }
            const sortedProducts = this.sortProducts(this.products, this.currentFilter);
            const filterNames = {
                'terkait': 'Switch Keyboard - Terkait',
                'terbaru': 'Switch Keyboard - Terbaru',
                'terlaris': 'Switch Keyboard - Terlaris'
            };
            showingText.textContent = `Menampilkan: ${filterNames[this.currentFilter]} (${sortedProducts.length} produk)`;
            grid.innerHTML = sortedProducts.map(product => this.createProductCard(product)).join('');
        }

        showError() {
            const grid = document.getElementById('productsGrid');
            grid.innerHTML = '<div class="no-products">Error: Could not load products. Please check if data.json exists and is valid.</div>';
        }
    }

    new ProductStore();
});