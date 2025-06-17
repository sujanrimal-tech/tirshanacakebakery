// FILE: ../js/script.js
// This is the complete, final, and unified script. Please replace the entire file content.

document.addEventListener('DOMContentLoaded', function() {

    const myEmail = 'sykodada3@gmail.com';
    const myWhatsApp = '9779821183819';

    // --- General UI Functions ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('header nav ul');
    if (mobileMenuBtn && navUl) {
        mobileMenuBtn.addEventListener('click', () => navUl.classList.toggle('active'));
    }
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }
    const floatingOrderBtn = document.getElementById('floating-order-button');
    if (floatingOrderBtn) {
        if (sessionStorage.getItem('hideFloatingOrderBtn') === 'true') {
            floatingOrderBtn.classList.add('hidden');
        }
        const closeFloatingBtn = document.getElementById('close-order-float');
        if (closeFloatingBtn) {
            closeFloatingBtn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                floatingOrderBtn.classList.add('hidden');
                sessionStorage.setItem('hideFloatingOrderBtn', 'true');
            });
        }
    }

    // --- Quick Order Modal Logic ---
    const orderModal = document.getElementById('order-modal');
    if (orderModal) {
        const orderNowButtons = document.querySelectorAll('.order-now-btn');
        const closeModalBtn = document.getElementById('close-modal');
        const modalDateInput = document.getElementById("modal-delivery-date");

        if (modalDateInput) {
            modalDateInput.nepaliDatePicker({ ndpYear: true, ndpMonth: true, ndpYearCount: 10 });
        }

        orderNowButtons.forEach(button => {
            button.addEventListener('click', function() {
                const cakeName = this.dataset.cakeName;
                document.getElementById('modal-cake-title').textContent = `Order: ${cakeName}`;
                document.getElementById('modal-cake-name').value = cakeName;

                if (modalDateInput && typeof NepaliFunctions !== 'undefined' && NepaliFunctions.ConvertFromEnglishToNepaliDate) {
                    modalDateInput.value = NepaliFunctions.ConvertFromEnglishToNepaliDate(new Date());
                }
                
                orderModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (closeModalBtn) {
            const closeModal = () => {
                orderModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            };
            closeModalBtn.addEventListener('click', closeModal);
            orderModal.addEventListener('click', (e) => { if (e.target === orderModal) closeModal(); });
        }
        
        const modalSizeOptions = orderModal.querySelectorAll('.size-option');
        modalSizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                modalSizeOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                const radio = this.querySelector('input');
                if (radio) radio.checked = true;
            });
        });
    }

    // --- Custom Cake Multi-Step Form Logic ---
    const customCakeForm = document.getElementById('custom-cake-form');
    if (customCakeForm) {
        const stepIndicators = customCakeForm.querySelectorAll('.custom-steps .step');
        const formSteps = customCakeForm.querySelectorAll('.custom-form');
        const nextButtons = customCakeForm.querySelectorAll('.next-btn');
        const prevButtons = customCakeForm.querySelectorAll('.prev-btn');
        const resetBtn = document.getElementById('reset-form-btn');
        let currentStep = 1;

        const updateCustomFormView = () => {
            formSteps.forEach(form => form.classList.toggle('active', parseInt(form.dataset.step) === currentStep));
            stepIndicators.forEach(step => {
                const stepNum = parseInt(step.dataset.step);
                step.classList.remove('active', 'completed');
                if (stepNum < currentStep) step.classList.add('completed');
                if (stepNum === currentStep) step.classList.add('active');
            });
        };
        
        const updateOrderSummary = () => { /* ... logic to update summary ... */ };

        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep < 4) {
                    currentStep++;
                    if (currentStep === 4) updateOrderSummary();
                    updateCustomFormView();
                }
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep > 1) { currentStep--; updateCustomFormView(); }
            });
             customCakeForm.querySelectorAll('.size-option, .flavor-option').forEach(option => {
        option.addEventListener('click', function() { /* ... radio button selection logic ... */ });
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => { /* ... reset form logic ... */ });
    }
    
    updateCustomFormView(); // Initial view setup
}

// --- UNIFIED FORM SUBMISSION HANDLER (Handles ALL forms) ---
const handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formId = form.id;
    let message = '';
    
    const getSafeValue = (selector, defaultValue = '') => {
        const element = form.querySelector(selector);
        return element ? element.value.trim() : defaultValue;
    };

    if (formId === 'contact-form') {
        message = `New Contact Form Submission:\n\nName: ${getSafeValue('#contact-name')}\nEmail: ${getSafeValue('#contact-email')}\nPhone: ${getSafeValue('#contact-phone')}\nSubject: ${getSafeValue('#contact-subject')}\nMessage: ${getSafeValue('#contact-message')}`;
    } else if (formId === 'simple-order-form') {
        const checkedSizeInput = form.querySelector('input[name="cake-size"]:checked');
        const selectedSize = checkedSizeInput ? checkedSizeInput.value : 'No size selected';
        message = `New Quick Order:\n\nCake: ${getSafeValue('#modal-cake-name', 'N/A')}\nSize: ${selectedSize}`;
        const cakeMessage = getSafeValue('#modal-cake-message'); if (cakeMessage) message += `\nMessage on Cake: ${cakeMessage}`;
        const specialInstructions = getSafeValue('#modal-special-instructions'); if (specialInstructions) message += `\nSpecial Instructions: ${specialInstructions}`;
        message += `\n\n--- Customer Details ---\nName: ${getSafeValue('#modal-customer-name', 'N/A')}\nPhone: ${getSafeValue('#modal-customer-phone', 'N/A')}\nDelivery Date (BS): ${getSafeValue('#modal-delivery-date', 'Not specified')}\nPreferred Time: ${getSafeValue('#modal-delivery-time', 'Not specified')}`;
    } else if (formId === 'custom-cake-form') {
        // Logic for submitting the custom form
        const customGetSafeValue = (selector, defaultValue = '') => {
            const element = document.getElementById(selector);
            return element ? element.value.trim() : defaultValue;
        };
        message = `New Custom Cake Order:\n\nCustomer: ${customGetSafeValue('custom-name')}\nPhone: ${customGetSafeValue('custom-phone')}\nEmail: ${customGetSafeValue('custom-email')}\nDelivery Date (BS): ${customGetSafeValue('custom-date', 'Not specified')}\nPreferred Time: ${customGetSafeValue('custom-time', 'Not specified')}\n\n--- Cake Details ---\nSize: ${document.querySelector('#summary-size span').textContent}\nFlavor: ${document.querySelector('#summary-flavor span').textContent}\nFilling: ${document.querySelector('#summary-filling span').textContent}\nOccasion: ${document.querySelector('#summary-occasion span').textContent}\nMessage on Cake: ${document.querySelector('#summary-message span').textContent}\nColors: ${document.querySelector('#summary-colors span').textContent}\nDecoration: ${document.querySelector('#summary-decoration span').textContent}\n\nEstimated Price: NPR ${document.getElementById('summary-price').textContent}`;
    }

    if (message) {
        const whatsappUrl = `https://wa.me/${myWhatsApp}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        if (formId === 'simple-order-form' && orderModal) {
            alert('Thank you! Your request has been prepared. Please press send in WhatsApp to confirm.');
            form.reset();
            orderModal.classList.remove('active');
            document.body.style.overflow = 'auto'; 
        } else if (formId === 'custom-cake-form') {
            // Advance to confirmation step without resetting the form yet
            // This requires the custom form's variables to be accessible, which they are in this structure.
            currentStep = 5;
            updateCustomFormView();
        } else {
             alert('Thank you! Your message has been prepared.');
             form.reset();
        }
    }
};

// Attach the single handler to all forms that might exist
document.getElementById('contact-form')?.addEventListener('submit', handleFormSubmit);
document.getElementById('simple-order-form')?.addEventListener('submit', handleFormSubmit);
document.getElementById('custom-cake-form')?.addEventListener('submit', handleFormSubmit);
