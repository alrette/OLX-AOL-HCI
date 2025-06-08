// index.js

document.addEventListener('DOMContentLoaded', function() {

    // ===================================================================
    // ✨ FIX: Feature 1 - Reusable component loading logic added
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
    // --- YOUR ORIGINAL CAROUSEL LOGIC (UNCHANGED) ---
    // ===================================================================

    // Hero Carousel Auto-rotation
    let currentHeroSlide = 0;
    const heroSlides = document.querySelectorAll('.hero-slide');

    function nextHeroSlide() {
        if (heroSlides.length === 0) return;
        heroSlides[currentHeroSlide].classList.remove('active');
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        heroSlides[currentHeroSlide].classList.add('active');
    }
    if (heroSlides.length > 0) {
        setInterval(nextHeroSlide, 3000);
    }

    // Promo Carousel Manual Controls
    let currentPromoIndex = 0;
    const promoCarousel = document.querySelector('.promo-carousel');
    const promoTrack = document.querySelector('.promo-track');
    const promoCards = promoTrack ? Array.from(promoTrack.children) : [];
    const promoPrevBtn = document.querySelector('.promo-section .prev-btn');
    const promoNextBtn = document.querySelector('.promo-section .next-btn');
    let promoCardStep = 0;

    function calculatePromoCardStep() {
        if (promoCards.length > 0) {
            const firstCardWidth = promoCards[0].offsetWidth;
            const trackStyle = window.getComputedStyle(promoTrack);
            const gap = parseFloat(trackStyle.gap) || 0;
            promoCardStep = firstCardWidth + gap;
        } else {
            promoCardStep = 0;
        }
    }

    function updatePromoCarousel() {
        if (!promoTrack || !promoCarousel || promoCards.length === 0 || promoCardStep === 0) return;
        const carouselVisibleWidth = promoCarousel.offsetWidth;
        const trackContentWidth = promoTrack.scrollWidth;
        const maxTranslateX = Math.min(0, -(trackContentWidth - carouselVisibleWidth));
        let targetTranslateX = -currentPromoIndex * promoCardStep;
        targetTranslateX = Math.max(targetTranslateX, maxTranslateX);
        targetTranslateX = Math.min(targetTranslateX, 0);
        promoTrack.style.transform = `translateX(${targetTranslateX}px)`;
        if (promoCardStep > 0) {
            currentPromoIndex = Math.round(Math.abs(targetTranslateX) / promoCardStep);
        }
    }

    function nextPromo() {
        if (!promoTrack || !promoCarousel || promoCards.length === 0 || promoCardStep === 0) return;
        const carouselVisibleWidth = promoCarousel.offsetWidth;
        const cardsVisible = Math.floor(carouselVisibleWidth / promoCardStep);
        const maxScrollIndex = Math.max(0, promoCards.length - cardsVisible);
        currentPromoIndex = Math.min(currentPromoIndex + 1, maxScrollIndex);
        updatePromoCarousel();
    }

    function prevPromo() {
        if (!promoTrack || !promoCarousel || promoCards.length === 0 || promoCardStep === 0) return;
        currentPromoIndex = Math.max(currentPromoIndex - 1, 0);
        updatePromoCarousel();
    }
    if(promoPrevBtn) promoPrevBtn.addEventListener('click', prevPromo);
    if(promoNextBtn) promoNextBtn.addEventListener('click', nextPromo);

    // Products Carousel Drag Functionality
    const productsCarousel = document.getElementById('productsCarousel');
    const productsTrack = productsCarousel ? productsCarousel.querySelector('.products-track') : null;

    if (productsCarousel && productsTrack) {
        let isDraggingProducts = false, startXProducts = 0, currentTranslateXProducts = 0;
        const stopDragging = () => {
            if (isDraggingProducts) {
                isDraggingProducts = false;
                productsCarousel.style.cursor = 'grab';
                productsTrack.style.transition = 'transform 0.3s ease';
            }
        };
        productsCarousel.addEventListener('mousedown', (e) => {
            isDraggingProducts = true;
            startXProducts = e.pageX - productsCarousel.offsetLeft;
            currentTranslateXProducts = getTransformValue(productsTrack);
            productsCarousel.style.cursor = 'grabbing';
            productsTrack.style.transition = 'none';
        });
        productsCarousel.addEventListener('mouseleave', stopDragging);
        productsCarousel.addEventListener('mouseup', stopDragging);
        productsCarousel.addEventListener('mousemove', (e) => {
            if (!isDraggingProducts) return;
            e.preventDefault();
            const x = e.pageX - productsCarousel.offsetLeft;
            const walk = (x - startXProducts) * 1.5;
            const maxScroll = 0;
            const minScroll = -(productsTrack.scrollWidth - productsCarousel.offsetWidth);
            let newTransform = currentTranslateXProducts + walk;
            newTransform = Math.max(minScroll, Math.min(maxScroll, newTransform));
            productsTrack.style.transform = `translateX(${newTransform}px)`;
        });
        productsCarousel.addEventListener('touchstart', (e) => {
            isDraggingProducts = true;
            startXProducts = e.touches[0].pageX - productsCarousel.offsetLeft;
            currentTranslateXProducts = getTransformValue(productsTrack);
            productsTrack.style.transition = 'none';
        }, { passive: false });
        productsCarousel.addEventListener('touchmove', (e) => {
            if (!isDraggingProducts) return;
            e.preventDefault();
            const x = e.touches[0].pageX - productsCarousel.offsetLeft;
            const walk = (x - startXProducts) * 1.5;
            const maxScroll = 0;
            const minScroll = -(productsTrack.scrollWidth - productsCarousel.offsetWidth);
            let newTransform = currentTranslateXProducts + walk;
            newTransform = Math.max(minScroll, Math.min(maxScroll, newTransform));
            productsTrack.style.transform = `translateX(${newTransform}px)`;
        });
        productsCarousel.addEventListener('touchend', stopDragging);
    }

    function getTransformValue(element) {
        if (!element) return 0;
        const style = window.getComputedStyle(element);
        const matrix = style.transform || style.webkitTransform || style.mozTransform;
        if (matrix === 'none' || typeof matrix === 'undefined') return 0;
        const matrixValues = matrix.match(/matrix.*\((.+)\)/);
        if (!matrixValues || !matrixValues[1]) return 0;
        const values = matrixValues[1].split(', ');
        return matrix.includes('3d') ? parseFloat(values[12]) : parseFloat(values[4]);
    }

    // Infinite Scroll JS
    function setupInfiniteScrollJS(trackSelector, speed = 1) {
        const track = document.querySelector(trackSelector);
        if (!track || track.children.length === 0) return;
        const originalItems = Array.from(track.children);
        originalItems.forEach(item => track.appendChild(item.cloneNode(true)));
        let oneSetWidth = track.scrollWidth / 2;
        let currentPosition = 0;
        let animationFrameId;
        function animateScroll() {
            currentPosition -= speed;
            if (Math.abs(currentPosition) >= oneSetWidth) currentPosition = 0;
            track.style.transform = `translateX(${currentPosition}px)`;
            animationFrameId = requestAnimationFrame(animateScroll);
        }
        track.style.animation = 'none';
        animateScroll();
        track.addEventListener('mouseenter', () => cancelAnimationFrame(animationFrameId));
        track.addEventListener('mouseleave', () => animationFrameId = requestAnimationFrame(animateScroll));
    }

    // Initialize carousels and scrolls on load
    calculatePromoCardStep();
    updatePromoCarousel();
    setupInfiniteScrollJS('.categories-grid', 0.5);
    setupInfiniteScrollJS('.payment-track', 0.75);
    setupInfiniteScrollJS('.delivery-track', 0.6);

    // Responsive adjustments
    window.addEventListener('resize', () => {
        calculatePromoCardStep();
        updatePromoCarousel();
    });

    // ===================================================================
    // ✨ FIX: New function to handle all requested click behaviors
    // ===================================================================
    function setupClickableElements() {
        
        // Feature 2: Make Product Cards clickable
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => window.location.href = 'product.html');
        });

        // Feature 3: Make "View All" button clickable
        const viewAllBtn = document.querySelector('.view-all-btn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'search.html';
            });
        }

        // Feature 4: Make Category items clickable
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => window.location.href = 'search.html');
        });

        // Feature 5: Make Hero Banners clickable
        document.querySelectorAll('.hero-slide').forEach(slide => {
            slide.addEventListener('click', () => window.location.href = 'promodankupon.html');
        });
    }

    // Call the new function to activate all links
    setupClickableElements();
});