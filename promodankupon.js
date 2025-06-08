// promodankupon.js

document.addEventListener('DOMContentLoaded', function() {

    // ===================================================================
    // Standard component loading logic
    // ===================================================================
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


    // ===================================================================
    // --- Page-specific logic begins here ---
    // ===================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(targetTab + '-content').classList.add('active');
            filterItems(searchInput.value.toLowerCase(), categoryFilter.value, discountFilter.value);
        });
    });

    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const discountFilter = document.getElementById('discountFilter');

    searchInput.addEventListener('input', function() {
        filterItems(this.value.toLowerCase(), categoryFilter.value, discountFilter.value);
    });

    categoryFilter.addEventListener('change', function() {
        filterItems(searchInput.value.toLowerCase(), this.value, discountFilter.value);
    });

    discountFilter.addEventListener('change', function() {
        filterItems(searchInput.value.toLowerCase(), categoryFilter.value, this.value);
    });

    function filterItems(searchTerm = '', category = '', discount = '') {
        const activeTab = document.querySelector('.tab-content.active');
        if (!activeTab) return;
        const cards = activeTab.querySelectorAll('.promo-card, .product-card');

        cards.forEach(card => {
            let show = true;
            const cardText = card.textContent.toLowerCase();
            const cardCategory = card.dataset.category;
            const cardDiscount = card.dataset.discount || card.dataset.discountMin;

            if (searchTerm && !cardText.includes(searchTerm)) show = false;
            if (category && cardCategory !== category) show = false;
            if (discount && (!cardDiscount || parseInt(cardDiscount) < parseInt(discount))) show = false;

            card.style.display = show ? 'block' : 'none';
        });
    }

    document.addEventListener('click', function(e) {
        if (e.target.closest('.wishlist-btn')) {
            const icon = e.target.closest('.wishlist-btn').querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            icon.style.color = icon.classList.contains('fas') ? '#e74c3c' : '#666';
        }

        if (e.target.closest('.promo-btn')) {
            const promoBtn = e.target.closest('.promo-btn');
            const originalText = promoBtn.innerHTML;
            promoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> MEMPROSES...';
            promoBtn.disabled = true;
            setTimeout(() => {
                promoBtn.innerHTML = '<i class="fas fa-check"></i> BERHASIL!';
                promoBtn.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
                setTimeout(() => {
                    promoBtn.innerHTML = originalText;
                    promoBtn.style.background = 'linear-gradient(135deg, #1A5276 0%, #2980B9 100%)';
                    promoBtn.disabled = false;
                }, 2000);
            }, 1500);
        }

        if (e.target.closest('.view-all-btn')) {
            e.preventDefault();
            const nextGrid = e.target.closest('section').querySelector('.product-grid, .promo-grid');
            if (nextGrid) {
                nextGrid.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // ✨ FIX: This new code block makes all product cards clickable.
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (event) => {
            // This check prevents the redirect if the wishlist heart is clicked.
            if (event.target.closest('.wishlist-btn')) {
                return;
            }
            // Redirect to the product page.
            window.location.href = 'product.html';
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.promo-card, .product-card').forEach(card => observer.observe(card));
});