// FILE: ../js/script.js
// This is the complete, final, and corrected script.

document.addEventListener('DOMContentLoaded', function() {

    const myWhatsApp = '9779821183819';

    // --- General UI Functions (Run on all pages) ---
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

    // --- Quick Order Modal Logic (for products.html) ---
    const orderModal = document.getElementById('order-modal');
    if (orderModal) { // This "if" statement is a guard clause
        const orderNowButtons = document.querySelectorAll('.order-now-btn');
        const closeModalBtn = document.getElementById('close-modal');

        orderNowButtons.forEach(button => {
            button.addEventListener('click', function() {
                const cakeName = this.dataset.cakeName;
                document.getElementById('modal-cake-title').textContent = `Order: ${cakeName}`;
                document.getElementById('modal-cake-name').value = cakeName;
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
            orderModal.addEventListener('click', (e) => {
                if (e.target === orderModal) closeModal();
            });
        }
    } // <-- *** The 'if (orderModal)' block now correctly closes here ***

    // --- Custom Cake Multi-Step Form Logic (for custom-order.html) ---
    const customCakeForm = document.getElementById('custom-cake-form');
    if (customCakeForm) { // This "if" statement is a guard clause
        const stepIndicators = document.querySelectorAll('.custom-steps .step');
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
        
        const updateOrderSummary = () => {
            const getCheckedVal = (name) => customCakeForm.querySelector(`input[name="${name}"]:checked`)?.value || 'N/A';
            const getElVal = (id) => document.getElementById(id)?.value || 'N/A';
            document.querySelector('#summary-size span').textContent = getCheckedVal('custom-cake-size');
            document.querySelector('#summary-flavor span').textContent = getCheckedVal('cake-flavor');
            document.querySelector('#summary-filling span').textContent = getCheckedVal('cake-filling');
            document.querySelector('#summary-occasion span').textContent = getElVal('custom-occasion');
            document.querySelector('#summary-message span').textContent = getElVal('custom-message') || 'None';
            document.querySelector('#summary-colors span').textContent = getElVal('custom-colors') || 'Default';
            document.querySelector('#summary-decoration span').textContent = getElVal('custom-decoration') || 'None';
            const checkedSize = customCakeForm.querySelector('input[name="custom-cake-size"]:checked');
            const basePrice = checkedSize ? parseInt(checkedSize.dataset.price || 0) : 0;
            document.getElementById('summary-price').textContent = basePrice.toLocaleString();
        };

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
                if (currentStep > 1) {
                    currentStep--;
                    updateCustomFormView();
                }
            });
        });
        
        customCakeForm.querySelectorAll('.size-option, .flavor-option').forEach(option => {
            option.addEventListener('click', function() {
                const input = this.querySelector('input[type="radio"]');
                if (input) {
                    input.checked = true;
                    const groupName = input.name;
                    customCakeForm.querySelectorAll(`input[name="${groupName}"]`).forEach(radio => {
                        radio.closest('.size-option, .flavor-option')?.classList.remove('selected');
                    });
                    this.classList.add('selected');
                }
            });
        });
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                customCakeForm.reset();
                currentStep = 1;
                updateCustomFormView();
            });
        }
        
        customCakeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateOrderSummary();
            let message = `*New Custom Cake Order:*\n\n*Customer:*\nName: ${document.getElementById('custom-name').value}\nPhone: ${document.getElementById('custom-phone').value}\nEmail: ${document.getElementById('custom-email').value}\n\n*Delivery Details:*\nDate (BS): ${document.getElementById('custom-date')?.value || 'Not specified'}\nTime: ${document.getElementById('custom-time')?.value || 'Not specified'}\n\n*Cake Details:*\nSize: ${document.querySelector('#summary-size span').textContent}\nFlavor: ${document.querySelector('#summary-flavor span').textContent}\nFilling: ${document.querySelector('#summary-filling span').textContent}\nOccasion: ${document.querySelector('#summary-occasion span').textContent}\nMessage: ${document.querySelector('#summary-message span').textContent}\nColors: ${document.querySelector('#summary-colors span').textContent}\nDecoration: ${document.querySelector('#summary-decoration span').textContent}\n\n*Est. Price: NPR ${document.getElementById('summary-price').textContent}*`;
            const whatsappUrl = `https://wa.me/${myWhatsApp}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            currentStep = 5;
            updateCustomFormView();
        });
        
        updateCustomFormView();
    } // <-- And the 'if (customCakeForm)' block correctly closes here.

    // --- UNIFIED FORM SUBMISSION HANDLER for other forms ---
    const handleOtherForms = (e) => {
        e.preventDefault();
        const form = e.target;
        let message = '';

        if (form.id === 'simple-order-form') {
            const cakeName = form.querySelector('#modal-cake-name').value;
            const cakeSize = form.querySelector('#modal-cake-size').value;
            const cakeMessage = form.querySelector('#modal-message-on-cake').value || 'None';
            const allergies = form.querySelector('#modal-allergies').value || 'None';
            message = `*New Quick Order:*\n\n🎂 Cake: ${cakeName}\n📏 Size: ${cakeSize}\n✍️ Message on Cake: ${cakeMessage}\n⚠️ Allergies/Instructions: ${allergies}\n\n*--- Customer Details ---*\n👤 Name: ${form.querySelector('#modal-customer-name').value}\n📞 Phone: ${form.querySelector('#modal-customer-phone').value}\n📅 Delivery Date: ${form.querySelector('#modal-delivery-date')?.value || 'Not specified'}\n⏰ Preferred Time: ${form.querySelector('#modal-delivery-time')?.value || 'Not specified'}`;
        } else if (form.id === 'contact-form') {
             message = `*New Contact Form Submission:*\n\nName: ${form.querySelector('#contact-name').value}\nEmail: ${form.querySelector('#contact-email').value}\nPhone: ${form.querySelector('#contact-phone').value}\nSubject: ${form.querySelector('#contact-subject').value}\nMessage: ${form.querySelector('#contact-message').value}`;
        }

        if (message) {
            const whatsappUrl = `https://wa.me/${myWhatsApp}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            alert('Thank you! Your request has been prepared for WhatsApp. Please press send to confirm.');
            form.reset();
            if (form.id === 'simple-order-form' && orderModal) {
                orderModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    };
    
    // Add listeners using guard clauses
    const contactForm = document.getElementById('contact-form');
    if (contactForm) contactForm.addEventListener('submit', handleOtherForms);
    
    const simpleOrderForm = document.getElementById('simple-order-form');
    if (simpleOrderForm) simpleOrderForm.addEventListener('submit', handleOtherForms);

});
