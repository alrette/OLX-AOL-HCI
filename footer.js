// footer.js

// This flag ensures the footer logic only runs once, preventing errors.
let footerInitialized = false;

function initFooter() {
    // If the footer code has already run, stop here.
    if (footerInitialized) {
        return;
    }

    console.log("Initializing footer logic...");

    // --- Scroll Animation using Intersection Observer ---
    const footerElement = document.querySelector('.olx-footer');
    if (footerElement) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the footer is visible
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footerElement.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once it's visible
                }
            });
        };

        const footerObserver = new IntersectionObserver(observerCallback, observerOptions);
        footerObserver.observe(footerElement);
    }

    // Set the flag to true so this code doesn't run again.
    footerInitialized = true;
}