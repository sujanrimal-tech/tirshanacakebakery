// FILE: ../js/script.js
// This is the complete, final script with all features correctly merged.

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

  const orderModal = document.getElementById('order-modal');
if (orderModal) {
    const orderNowButtons = document.querySelectorAll('.order-now-btn');
    const closeModalBtn = document.getElementById('close-modal');

    orderNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cakeName = this.dataset.cakeName;
            document.getElementById('modal-cake-title').textContent = `Order: ${cakeName}`;
            document.getElementById('modal-cake-name').value = cakeName;
            
            orderModal.classList.add('active'); // This line shows the modal
            document.body.style.overflow = 'hidden';
        });
    });


    if (closeModalBtn) {
        const closeModal = () => {
            orderModal.classList.remove('active'); // This line hides it
            document.body.style.overflow = 'auto';
        };
        closeModalBtn.addEventListener('click', closeModal);
        orderModal.addEventListener('click', (e) => {
            if (e.target === orderModal) closeModal();
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

    // --- Custom Cake Multi-Step Form Logic (with Confirmation Step) ---
    const customCakeForm = document.getElementById('custom-cake-form');
    if (customCakeForm) {
       const stepIndicators = document.querySelectorAll('.custom-steps .step');
        const formSteps = customCakeForm.querySelectorAll('.custom-form');
        const nextButtons = customCakeForm.querySelectorAll('.next-btn');
        const prevButtons = customCakeForm.querySelectorAll('.prev-btn');
        const resetBtn = document.getElementById('reset-form-btn');
        let currentStep = 1;

        const updateCustomFormView = () => {
            formSteps.forEach(form => {
                form.classList.toggle('active', parseInt(form.dataset.step) === currentStep);
            });
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
                if (currentStep < 4) { // Only advance up to step 4
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
                if (!input) return;
                const groupName = input.name;
                customCakeForm.querySelectorAll(`input[name="${groupName}"]`).forEach(radio => {
                    radio.closest('.size-option, .flavor-option').classList.remove('selected');
                });
                this.classList.add('selected');
                input.checked = true;
            });
        });
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                customCakeForm.reset();
                customCakeForm.querySelectorAll('.size-option, .flavor-option').forEach(opt => opt.classList.remove('selected'));
                document.getElementById('custom-size-small').checked = true;
                document.getElementById('custom-size-small').closest('.size-option').classList.add('selected');
                document.getElementById('flavor-vanilla').checked = true;
                document.getElementById('flavor-vanilla').closest('.flavor-option').classList.add('selected');
                document.getElementById('filling-vanilla').checked = true;
                document.getElementById('filling-vanilla').closest('.flavor-option').classList.add('selected');
                currentStep = 1;
                updateCustomFormView();
            });
        }
        
        customCakeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateOrderSummary();
            let message = `New Custom Cake Order:\n\nCustomer: ${document.getElementById('custom-name').value}\nPhone: ${document.getElementById('custom-phone').value}\nEmail: ${document.getElementById('custom-email').value}\nDelivery Date (BS): ${document.getElementById('custom-date')?.value || 'Not specified'}\nPreferred Time: ${document.getElementById('custom-time')?.value || 'Not specified'}\n\n--- Cake Details ---\nSize: ${document.querySelector('#summary-size span').textContent}\nFlavor: ${document.querySelector('#summary-flavor span').textContent}\nFilling: ${document.querySelector('#summary-filling span').textContent}\nOccasion: ${document.querySelector('#summary-occasion span').textContent}\nMessage on Cake: ${document.querySelector('#summary-message span').textContent}\nColors: ${document.querySelector('#summary-colors span').textContent}\nDecoration: ${document.querySelector('#summary-decoration span').textContent}\n\nEstimated Price: NPR ${document.getElementById('summary-price').textContent}`;
            const whatsappUrl = `https://wa.me/${myWhatsApp}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            currentStep = 5;
            updateCustomFormView();
        });
        
        updateCustomFormView();
    }

    // --- UNIFIED FORM SUBMISSION HANDLER for other forms ---
    const handleOtherForms = (e) => {
        e.preventDefault();
        const form = e.target;
        const formId = form.id;
        let subject = 'New Inquiry from Website';
        let message = '';

        if (formId === 'contact-form') {
            subject = `Contact: ${form.querySelector('#contact-subject').value}`;
            message = `New Contact Form Submission:\n\nName: ${form.querySelector('#contact-name').value}\nEmail: ${form.querySelector('#contact-email').value}\nPhone: ${form.querySelector('#contact-phone').value}\nSubject: ${subject}\nMessage: ${form.querySelector('#contact-message').value}`;
       } else if (formId === 'simple-order-form') {
            const cakeName = form.querySelector('#modal-cake-name').value;
            subject = `Quick Order: ${cakeName}`;
            
            // Get values from the new and updated fields
            const cakeSize = form.querySelector('#modal-cake-size').value;
            const cakeMessage = form.querySelector('#modal-message-on-cake').value || 'None';
            const allergies = form.querySelector('#modal-allergies').value || 'None';

            // Construct the new, more detailed message
            message = `New Quick Order:\n\n` +
                      `🎂 Cake: ${cakeName}\n` +
                      `📏 Size: ${cakeSize}\n` +
                      `✍️ Message on Cake: ${cakeMessage}\n` +
                      `⚠️ Allergies/Instructions: ${allergies}\n\n` +
                      `--- Customer Details ---\n` +
                      `👤 Name: ${form.querySelector('#modal-customer-name').value}\n` +
                      `📞 Phone: ${form.querySelector('#modal-customer-phone').value}\n` +
                      `📅 Delivery Date: ${form.querySelector('#modal-delivery-date')?.value || 'Not specified'}\n` +
                      `⏰ Preferred Time: ${form.querySelector('#modal-delivery-time')?.value || 'Not specified'}`;
        }

        if (message) {
            const whatsappUrl = `https://wa.me/${myWhatsApp}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            alert('Thank you! Your request has been prepared for WhatsApp. Please press send to confirm.');
            form.reset();
            if (formId === 'simple-order-form' && orderModal) {
                orderModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    };
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) contactForm.addEventListener('submit', handleOtherForms);
    
    const simpleOrderForm = document.getElementById('simple-order-form');
    if (simpleOrderForm) simpleOrderForm.addEventListener('submit', handleOtherForms);
});
