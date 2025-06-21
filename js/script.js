// FILE: js/script.js
// This is the complete, final, and corrected script for the entire website.

document.addEventListener('DOMContentLoaded', function() {

    const myWhatsApp = '9779845883222';

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

    // --- Quick Order Modal Logic ---
    const orderModal = document.getElementById('order-modal');
    if (orderModal) {
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
        
        // --- Place Quick Order Form Submission Logic ---
        const simpleOrderForm = document.getElementById('simple-order-form');
        if (simpleOrderForm) {
            simpleOrderForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const form = e.target;
                
                const getFieldValue = (selector) => form.querySelector(selector)?.value || 'N/A';
                
                const cakeName = getFieldValue('#modal-cake-name');
                const cakeSize = getFieldValue('#modal-cake-size');
                const cakeMessage = getFieldValue('#modal-message-on-cake') || 'None';
                const allergies = getFieldValue('#modal-allergies') || 'None';
                const customerName = getFieldValue('#modal-customer-name');
                const customerPhone = getFieldValue('#modal-customer-phone');
                const deliveryDate = getFieldValue('#modal-delivery-date') || 'Not specified';
                const deliveryTime = getFieldValue('#modal-delivery-time') || 'Not specified';
                
                const checkedTypeElement = form.querySelector('input[name="cake-type"]:checked');
                const cakeType = checkedTypeElement ? checkedTypeElement.value : 'Veg (Eggless)';

                const message = `*New Quick Order:*\n\n` +
                                `🎂 Cake: *${cakeName}*\n` +
                                `⭐ Type: *${cakeType}*\n` +
                                `📏 Size: *${cakeSize}*\n` +
                                `✍️ Message on Cake: ${cakeMessage}\n` +
                                `⚠️ Allergies/Instructions: ${allergies}\n\n` +
                                `*--- Customer Details ---*\n` +
                                `👤 Name: ${customerName}\n` +
                                `📞 Phone: ${customerPhone}\n` +
                                `📅 Delivery Date: ${deliveryDate}\n` +
                                `⏰ Preferred Time: ${deliveryTime}`;

                const whatsappUrl = `https://wa.me/${myWhatsApp}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                
                alert('Thank you! Your request has been received. Please continue in WhatsApp to send the message.');
                
                form.reset();
                closeModal(); // Use the function we already defined
            });
        }
    }

   // --- Custom Cake Multi-Step Form Logic ---
    const customCakeForm = document.getElementById('custom-cake-form');
    if (customCakeForm) {
        const stepIndicators = document.querySelectorAll('.custom-steps .step');
        const formSteps = customCakeForm.querySelectorAll('.custom-form');
        const nextButtons = customCakeForm.querySelectorAll('.next-btn');
        const prevButtons = customCakeForm.querySelectorAll('.prev-btn');
        const resetBtn = document.getElementById('reset-form-btn');
        let currentStep = 1;

        const customOptions = customCakeForm.querySelectorAll('.size-option, .type-option, .flavor-option, .filling-option');

        customOptions.forEach(option => {
            option.addEventListener('click', function() {
                const siblings = this.parentElement.children;
                for (const sibling of siblings) {
                    sibling.classList.remove('selected');
                }
                this.classList.add('selected');
                const radioInput = this.querySelector('input[type="radio"]');
                if (radioInput) {
                    radioInput.checked = true;
                }
            });
        });

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
            document.querySelector('#summary-type span').textContent = getCheckedVal('cake-type');
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
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                customCakeForm.reset();
                currentStep = 1;
                customOptions.forEach(option => option.classList.remove('selected'));
                document.querySelector('.size-option input:checked').parentElement.classList.add('selected');
                document.querySelector('.type-option input:checked').parentElement.classList.add('selected');
                document.querySelector('.flavor-option input:checked').parentElement.classList.add('selected');
                document.querySelector('.filling-option input:checked').parentElement.classList.add('selected');
                updateCustomFormView();
            });
        }
        
        customCakeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateOrderSummary();
            let message = `*New Custom Cake Order:*\n\n` +
                          `*Customer:*\nName: ${document.getElementById('custom-name').value}\n` +
                          `Phone: ${document.getElementById('custom-phone').value}\n` +
                          `Email: ${document.getElementById('custom-email').value}\n\n` +
                          `*Delivery Details:*\n` +
                          `Date : ${document.getElementById('custom-date')?.value || 'Not specified'}\n` +
                          `Time: ${document.getElementById('custom-time')?.value || 'Not specified'}\n\n` +
                          `*Cake Details:*\n` +
                          `Size: ${document.querySelector('#summary-size span').textContent}\n` +
                          `Type: ${document.querySelector('#summary-type span').textContent}\n` +
                          `Flavor: ${document.querySelector('#summary-flavor span').textContent}\n` +
                          `Filling: ${document.querySelector('#summary-filling span').textContent}\n` +
                          `Occasion: ${document.querySelector('#summary-occasion span').textContent}\n` +
                          `Message: ${document.querySelector('#summary-message span').textContent}\n` +
                          `Colors: ${document.querySelector('#summary-colors span').textContent}\n` +
                          `Decoration: ${document.querySelector('#summary-decoration span').textContent}\n\n` +
                          `*Est. Price: NPR ${document.getElementById('summary-price').textContent}*`;

            const whatsappUrl = `https://wa.me/${myWhatsApp}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            currentStep = 5;
            updateCustomFormView();
        });
        
        updateCustomFormView();
    }

    // --- AJAX Contact Form Logic (This section is unchanged) ---
    const ajaxContactForm = document.getElementById('contact-form-ajax');
    if (ajaxContactForm) {
        const formStatus = document.getElementById('form-status-message');
        const submitButton = ajaxContactForm.querySelector('button[type="submit"]');

        ajaxContactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const formAction = this.action;

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }
            if (formStatus) formStatus.style.display = 'none';

            fetch(formAction, {
                method: 'POST',
                body: formData,
            })
            .then(response => {
                if (response.ok) {
                    if (formStatus) {
                        formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                        formStatus.className = 'success';
                        formStatus.style.display = 'block';
                    }
                    ajaxContactForm.reset();
                } else {
                    throw new Error('Server responded with an error.');
                }
            })
            .catch(error => {
                if (formStatus) {
                    formStatus.textContent = 'Oops! Something went wrong. Please try again.';
                    formStatus.className = 'error';
                    formStatus.style.display = 'block';
                }
            })
            .finally(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
            });
        });
    }

    // --- Simple Order Form Submission (WhatsApp Redirect) ---
    const simpleOrderForm = document.getElementById('simple-order-form');
    if (simpleOrderForm) {
        simpleOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const form = e.target;
            
            const cakeName = form.querySelector('#modal-cake-name').value;

            // ** THE FIX IS HERE: The duplicate line has been removed. **
            const checkedTypeElement = form.querySelector('input[name="cake-type"]:checked');
            const cakeType = checkedTypeElement ? checkedTypeElement.value : 'Not Selected';
            
            const cakeSize = form.querySelector('#modal-cake-size').value;
            const cakeMessage = form.querySelector('#modal-message-on-cake').value || 'None';
            const allergies = form.querySelector('#modal-allergies').value || 'None';
            const customerName = form.querySelector('#modal-customer-name').value;
            const customerPhone = form.querySelector('#modal-customer-phone').value;
            const deliveryDate = form.querySelector('#modal-delivery-date')?.value || 'Not specified';
            const deliveryTime = form.querySelector('#modal-delivery-time')?.value || 'Not specified';

            const message = `*New Quick Order:*\n\n` +
                            `🎂 Cake: *${cakeName}*\n` +
                            `⭐ Type: *${cakeType}*\n` +
                            `📏 Size: *${cakeSize}*\n` +
                            `✍️ Message on Cake: ${cakeMessage}\n` +
                            `⚠️ Allergies/Instructions: ${allergies}\n\n` +
                            `*--- Customer Details ---*\n` +
                            `👤 Name: ${customerName}\n` +
                            `📞 Phone: ${customerPhone}\n` +
                            `📅 Delivery Date: ${deliveryDate}\n` +
                            `⏰ Preferred Time: ${deliveryTime}`;

            const whatsappUrl = `https://wa.me/${myWhatsApp}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            alert('Thank you! Your request has been received. Please continue in WhatsApp to send the message.');
            
            form.reset();
            
            if (orderModal) {
                orderModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

});
