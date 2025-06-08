// checkout.js

document.addEventListener('DOMContentLoaded', function() {

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


    // --- State Variable for Voucher ---
    let appliedVoucher = null;

    // --- Element Selectors ---
    const checkoutBtn = document.getElementById('checkoutBtn');
    // Modals
    const paymentModal = document.getElementById('paymentModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const successModal = document.getElementById('successModal');
    const voucherModal = document.getElementById('voucherModal');
    const addressModal = document.getElementById('addressModal');
    const processingModal = document.getElementById('processingModal');

    // --- Helper Functions ---
    const formatCurrency = (amount) => `Rp${amount.toLocaleString('id-ID')}`;
    const showModal = (modal) => { if (modal) modal.classList.add('active'); document.body.style.overflow = 'hidden'; };
    const closeModal = (modal) => { if (modal) modal.classList.remove('active'); if (!document.querySelector('.modal-overlay.active')) document.body.style.overflow = '';};

    // --- Core Update Function ---
    function updateTotal() {
        const checkedItems = document.querySelectorAll('.cart-item .item-checkbox:checked');
        let subtotal = 0;
        
        checkedItems.forEach(checkbox => {
            const item = checkbox.closest('.cart-item');
            const price = parseInt(item.querySelector('.current-price').dataset.price) || 0;
            const quantity = parseInt(item.querySelector('.quantity').value) || 0;
            subtotal += price * quantity;
        });
        
        const deliveryCost = parseInt(document.getElementById('deliveryType').value) || 0;
        const serviceFee = 1000;
        let total = subtotal + deliveryCost + serviceFee;

        // Apply voucher discount
        const voucherDiscountRow = document.querySelector('.voucher-discount-row');
        if (appliedVoucher) {
            let discountAmount = 0;
            if (appliedVoucher.type === 'percent') {
                const maxDiscount = 10000;
                discountAmount = Math.min(Math.round(subtotal * (appliedVoucher.value / 100)), maxDiscount);
            } else {
                discountAmount = appliedVoucher.value;
            }
            total = Math.max(0, total - discountAmount);
            
            document.getElementById('summaryVoucherDiscount').textContent = `-${formatCurrency(discountAmount)}`;
            voucherDiscountRow.style.display = 'flex';
        } else {
            voucherDiscountRow.style.display = 'none';
        }

        // Update UI
        document.getElementById('summaryItemCount').textContent = checkedItems.length;
        document.getElementById('cartItemCount').textContent = `${checkedItems.length} items`;
        document.getElementById('summarySubtotal').textContent = formatCurrency(subtotal);
        document.getElementById('summaryShippingCost').textContent = formatCurrency(deliveryCost);
        document.getElementById('summaryTotal').textContent = formatCurrency(total);
    }

    // --- Event Listeners (Direct Binding) ---

    // General Page Controls
    document.querySelectorAll('.checkbox, #deliveryType').forEach(el => el.addEventListener('change', updateTotal));
    
    // Quantity buttons and direct input
    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity');
            let quantity = parseInt(input.value);
            if (this.classList.contains('plus')) {
                quantity++;
            } else if (this.classList.contains('minus') && quantity > 1) {
                quantity--;
            }
            input.value = quantity;
            updateTotal();
        });
    });
    document.querySelectorAll('input.quantity').forEach(input => {
        input.addEventListener('input', () => {
            if (input.value < 1) input.value = 1;
            updateTotal();
        });
    });

    // Main Checkout Button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (document.querySelectorAll('.cart-item .item-checkbox:checked').length === 0) return alert('Please select an item to checkout.');
            showModal(paymentModal);
        });
    }

    // Modal Close Buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay')));
    });

    // Voucher Modal Buttons
    const useVoucherBtn = document.getElementById('useVoucherBtn');
    if (useVoucherBtn) useVoucherBtn.addEventListener('click', () => showModal(voucherModal));
    
    const applyVoucherBtn = document.getElementById('applyVoucherBtn');
    if(applyVoucherBtn) {
        applyVoucherBtn.addEventListener('click', () => {
            const selectedVoucherEl = document.querySelector('input[name="voucher"]:checked');
            if (selectedVoucherEl) {
                appliedVoucher = {
                    type: selectedVoucherEl.dataset.type,
                    value: parseInt(selectedVoucherEl.dataset.value)
                };
                useVoucherBtn.innerHTML = `<span>Voucher Applied!</span><span class="arrow" style="color:green;">✓</span>`;
            } else {
                appliedVoucher = null;
                useVoucherBtn.innerHTML = `<span>Use Voucher for savings!</span><span class="arrow">></span>`;
            }
            updateTotal();
            closeModal(voucherModal);
        });
    }

    // Address Modal Buttons
    const changeAddressBtn = document.querySelector('.change-address-btn');
    if (changeAddressBtn) {
        changeAddressBtn.addEventListener('click', () => {
            document.getElementById('inputRecipientName').value = document.getElementById('recipientName').textContent;
            document.getElementById('inputRecipientPhone').value = document.getElementById('recipientPhone').textContent;
            document.getElementById('inputRecipientAddress').value = document.getElementById('recipientAddress').textContent.trim();
            showModal(addressModal);
        });
    }

    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('recipientName').textContent = document.getElementById('inputRecipientName').value;
            document.getElementById('recipientPhone').textContent = document.getElementById('inputRecipientPhone').value;
            document.getElementById('recipientAddress').textContent = document.getElementById('inputRecipientAddress').value;
            closeModal(addressModal);
        });
    }

    // --- Payment Flow Buttons ---
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', () => {
            const selectedPayment = document.querySelector('input[name="payment_method"]:checked');
            if (!selectedPayment) {
                return alert('Please select a payment method.');
            }

            // ✨ FIX: This is the new logic that was added.
            // 1. Get the data from the page.
            const totalAmountText = document.getElementById('summaryTotal').textContent;
            const paymentMethodLabel = selectedPayment.closest('.payment-option').querySelector('.payment-label span').textContent;

            // 2. Populate the confirmation modal with the data.
            document.getElementById('confirmationTotal').textContent = `Total: ${totalAmountText}`;
            document.getElementById('confirmationPaymentMethod').textContent = `Using: ${paymentMethodLabel}`;
            // --- End of Fix ---

            // 3. Now, show the populated modal.
            closeModal(paymentModal);
            showModal(confirmationModal);
        });
    }

    const cancelFinalPaymentBtn = document.getElementById('cancelFinalPaymentBtn');
    if(cancelFinalPaymentBtn) cancelFinalPaymentBtn.addEventListener('click', () => closeModal(confirmationModal));

    const confirmFinalPaymentBtn = document.getElementById('confirmFinalPaymentBtn');
    if (confirmFinalPaymentBtn) {
        confirmFinalPaymentBtn.addEventListener('click', () => {
            closeModal(confirmationModal);
            showModal(processingModal);

            // Simulate a 2.5 second processing delay
            setTimeout(() => {
                closeModal(processingModal);
                showModal(successModal);
            }, 2500);
        });
    }

    // --- Initial Calculation on Page Load ---
    updateTotal();
});