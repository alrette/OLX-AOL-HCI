// product.js

document.addEventListener('DOMContentLoaded', () => {

    // This function is called after navbar.html is loaded.
    // It uses the class defined in navbar.js.
    function initNavbar() {
        new ProfessionalNavbar();
        console.log("Navbar HTML loaded and is now fully interactive.");
    }

    // This function loads HTML content into a placeholder.
    const loadHTML = async (elementId, filePath, callback) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Failed to fetch ${filePath}`);
            element.innerHTML = await response.text();
            if (callback) callback();
        } catch (error) {
            console.error(`Error loading content for #${elementId}:`, error);
        }
    };

    // This function sets up your product image gallery.
    function setupImageGallery() {
        const mainProductImage = document.getElementById('mainProductImage');
        const thumbnails = document.querySelectorAll('.thumbnail');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (!mainProductImage || thumbnails.length === 0) {
            console.error("Image gallery elements not found.");
            return;
        }

        const imageSources = Array.from(thumbnails)
            .map(thumb => thumb.dataset.src || thumb.src)
            .filter(src => src);

        let currentImageIndex = 0;

        function updateMainImage(index) {
            if (index < 0 || index >= imageSources.length) return;
            mainProductImage.style.opacity = '0';
            setTimeout(() => {
                mainProductImage.src = imageSources[index];
                mainProductImage.alt = thumbnails[index].alt;
                mainProductImage.style.opacity = '1';
            }, 200);
            thumbnails.forEach((thumb, i) => thumb.classList.toggle('active', i === index));
            currentImageIndex = index;
        }

        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => updateMainImage(index));
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const newIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
                updateMainImage(newIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const newIndex = (currentImageIndex + 1) % imageSources.length;
                updateMainImage(newIndex);
            });
        }
        
        updateMainImage(0);
    }

    // This function sets up your chat popup.
    function setupChatPopup() {
        const chatWithOwnerBtn = document.getElementById('chatWithOwnerBtn');
        const chatPopup = document.getElementById('chatPopup');
        const closeChatPopupBtn = document.getElementById('closeChatPopup');
        const chatMessagesContainer = document.querySelector('.chat-messages-container');
        const chatMessageInput = document.getElementById('chatMessageInput');
        const sendChatMessageBtn = document.getElementById('sendChatMessageBtn');
        
        if (!chatWithOwnerBtn || !chatPopup || !closeChatPopupBtn) {
            console.error("One or more chat elements not found.");
            return;
        }

        const openChat = () => {
            chatPopup.style.display = 'flex';
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        };
        
        const closeChat = () => {
            chatPopup.style.display = 'none';
        };

        const sendMessage = () => {
            const messageText = chatMessageInput.value.trim();
            if (messageText === '') return;
            const messageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const messageHTML = `<div class="chat-message user-message"><p>${messageText}</p><span class="message-time">${messageTime}</span></div>`;
            chatMessagesContainer.insertAdjacentHTML('beforeend', messageHTML);
            chatMessageInput.value = '';
            chatMessageInput.focus();
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        };
        
        chatWithOwnerBtn.addEventListener('click', openChat);
        closeChatPopupBtn.addEventListener('click', closeChat);
        sendChatMessageBtn.addEventListener('click', sendMessage);
        
        chatMessageInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
            }
        });
        
        chatPopup.addEventListener('click', (event) => {
            if (event.target === chatPopup) {
                closeChat();
            }
        });
    }

    // ✨ ADDED: This new function handles the "Buy Now" button click.
    function setupBuyNowButton() {
        // Find the button with the class '.buy-btn'
        const buyNowButton = document.querySelector('.buy-btn');

        // Check if the button exists on the page
        if (buyNowButton) {
            // Add a click event listener
            buyNowButton.addEventListener('click', () => {
                console.log('"Beli Sekarang" button clicked. Redirecting to checkout.html...');
                // Redirect the browser to checkout.html
                window.location.href = 'checkout.html';
            });
        } else {
            console.error("Buy Now button (.buy-btn) not found on the page.");
        }
    }


    // --- MAIN EXECUTION FLOW ---
    loadHTML('navbar-placeholder', 'navbar.html', initNavbar);
    // This call now correctly uses the initFooter function from footer.js
    loadHTML('footer-placeholder', 'footer.html', window.initFooter); 
    
    setupImageGallery();
    setupChatPopup();

    // ✨ ADDED: Call the new function to activate the button.
    setupBuyNowButton();
});