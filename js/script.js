// FILE: ../js/script.js
// This is the complete, corrected script for your entire site.

document.addEventListener('DOMContentLoaded', function() {

    const myEmail = 'sykodada3@gmail.com';
    const myWhatsApp = '9779821183819';

    // --- General UI Functions ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('header nav ul'); // Corrected selector for header nav
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
                const cakeImg = this.dataset.cakeImg;
                document.getElementById('modal-cake-title').textContent = `Order: ${cakeName}`;
                document.getElementById('modal-cake-image').src = cakeImg;
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
        let currentStep = 1;

        const updateOrderSummary = () => {
            const getCheckedVal = (name) => {
                const checked = customCakeForm.querySelector(`input[name="${name}"]:checked`);
                return checked ? checked.value : 'N/A';
            };
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

        const updateCustomFormView = () => {
            // Update the form step content
            formSteps.forEach(form => {
                form.classList.toggle('active', parseInt(form.dataset.step) === currentStep);
            });
            // Update the step indicators at the top
            stepIndicators.forEach(step => {
                const stepNum = parseInt(step.dataset.step);
                step.classList.remove('active', 'completed'); // Reset classes
                if (stepNum < currentStep) {
                    step.classList.add('completed');
                }
                if (stepNum === currentStep) {
                    step.classList.add('active');
                }
            });
            // If on the final step, refresh the summary
            if (currentStep === 4) {
                updateOrderSummary();
            }
        };

        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep < formSteps.length) {
                    currentStep++;
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
        
        // Handle clicking on size/flavor options
        const formOptions = customCakeForm.querySelectorAll('.size-option, .flavor-option');
        formOptions.forEach(option => {
            option.addEventListener('click', function() {
                const input = this.querySelector('input[type="radio"]');
                if (!input) return;

                // Deselect all other options in the same group (e.g., all 'cake-flavor' options)
                const groupName = input.name;
                const optionsInGroup = customCakeForm.querySelectorAll(`input[name="${groupName}"]`);
                optionsInGroup.forEach(radio => {
                    radio.closest('.size-option, .flavor-option').classList.remove('selected');
                });
                
                // Select the clicked option
                this.classList.add('selected');
                input.checked = true;
            });
        });
        
        updateCustomFormView(); // Initial call to set the correct view on page load
    }

    // --- UNIFIED FORM SUBMISSION HANDLER ---
    const handleFormSubmit = (e) => {
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
            message = `New Quick Order:\n\nCake: ${cakeName}\nSize: ${form.querySelector('input[name="cake-size"]:checked').value}\n\n--- Customer Details ---\nName: ${form.querySelector('#modal-customer-name').value}\nPhone: ${form.querySelector('#modal-customer-phone').value}\nDelivery Date (BS): ${form.querySelector('#modal-delivery-date')?.value || 'Not specified'}\nPreferred Time: ${form.querySelector('#modal-delivery-time')?.value || 'Not specified'}`;
        } else if (formId === 'custom-cake-form') {
            subject = 'New Custom Cake Order';
            updateOrderSummary(); // Make sure summary is up-to-date before sending
            message = `New Custom Cake Order:\n\nCustomer: ${document.getElementById('custom-name').value}\nPhone: ${document.getElementById('custom-phone').value}\nEmail: ${document.getElementById('custom-email').value}\nDelivery Date (BS): ${document.getElementById('custom-date')?.value || 'Not specified'}\nPreferred Time: ${document.getElementById('custom-time')?.value || 'Not specified'}\n\n--- Cake Details ---\nSize: ${document.querySelector('#summary-size span').textContent}\nFlavor: ${document.querySelector('#summary-flavor span').textContent}\nFilling: ${document.querySelector('#summary-filling span').textContent}\nOccasion: ${document.querySelector('#summary-occasion span').textContent}\nMessage on Cake: ${document.querySelector('#summary-message span').textContent}\nColors: ${document.querySelector('#summary-colors span').textContent}\nDecoration: ${document.querySelector('#summary-decoration span').textContent}\n\nEstimated Price: NPR ${document.getElementById('summary-price').textContent}`;
        }

        if (message) {
            const whatsappUrl = `https://wa.me/${myWhatsApp}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            // Optional: You can also keep the mailto link if you want both
            // const mailtoUrl = `mailto:${myEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
            // window.location.href = mailtoUrl;

            alert('Thank you! Your order has been prepared for WhatsApp. Please press send to confirm.');
            form.reset();

            // Handle post-submission UI changes
            if (formId === 'simple-order-form' && orderModal) {
                orderModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            if (formId === 'custom-cake-form') {
                // Reset to the first step after submission
                currentStep = 1;
                updateCustomFormView();
            }
        }
    };

    // Attach the single handler to all relevant forms
    const contactForm = document.getElementById('contact-form');
    if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);

    const simpleOrderForm = document.getElementById('simple-order-form');
    if (simpleOrderForm) simpleOrderForm.addEventListener('submit', handleFormSubmit);
    
    if (customCakeForm) customCakeForm.addEventListener('submit', handleFormSubmit);
});
