// feedback.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Component Loading ---
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

    // --- Feedback Form Logic ---
    const form = document.getElementById('feedbackForm');
    if (!form) return;

    const submitBtn = document.getElementById('submitBtn');
    const popup = document.getElementById('thankYouPopup');
    const countdownEl = document.getElementById('countdown');

    // Star Rating Interaction
    document.querySelectorAll('.star-rating').forEach(ratingContainer => {
        const stars = ratingContainer.querySelectorAll('.star');
        const hiddenInput = ratingContainer.nextElementSibling;
        
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const value = star.dataset.value;
                hiddenInput.value = value;
                stars.forEach((s, i) => s.classList.toggle('active', i < value));
            });
            star.addEventListener('mouseenter', () => {
                const hoverValue = star.dataset.value;
                stars.forEach((s, i) => s.classList.toggle('hover', i < hoverValue));
            });
            star.addEventListener('mouseleave', () => {
                stars.forEach(s => s.classList.remove('hover'));
            });
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });

    function validateForm() {
        let isValid = true;
        // Basic validation: Check if required fields have a value
        document.querySelectorAll('[required]').forEach(input => {
            const field = input.closest('.input-field') || input.closest('.rating-group');
            const errorEl = field.querySelector('.error-message');
            if (!input.value) {
                isValid = false;
                errorEl.textContent = 'This field is required.';
            } else {
                errorEl.textContent = '';
            }
        });
        return isValid;
    }

    function submitForm() {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            popup.classList.add('show');
            let timeLeft = 3;
            countdownEl.textContent = timeLeft;

            const timer = setInterval(() => {
                timeLeft--;
                countdownEl.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    window.location.href = 'index.html';
                }
            }, 1000);
        }, 1500);
    }
});