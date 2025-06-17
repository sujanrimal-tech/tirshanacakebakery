// FINAL SCRIPT - DEFINITIVE FIX FOR MULTI-STEP FORM
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
    const navUl = document.querySelector('nav ul');
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
        const customSteps = customCakeForm.querySelectorAll('.step');
        const customForms = customCakeForm.querySelectorAll('.custom-form');
        const nextButtons = customCakeForm.querySelectorAll('.next-btn');
        const prevButtons = customCakeForm.querySelectorAll('.prev-btn');
        let currentStep = 1;

        const updateOrderSummary = () => {
            const getCheckedVal = (name) => {
                const checked = customCakeForm.querySelector(`input[name="${name}"]:checked`);
                return checked ? checked.value : 'N/A';
            };
            const getElVal = (id) => {
                const el = document.getElementById(id);
                return el ? el.value : 'N/A';
            };
            document.getElementById('summary-size').querySelector('span').textContent = getCheckedVal('custom-cake-size');
            document.getElementById('summary-flavor').querySelector('span').textContent = getCheckedVal('cake-flavor');
            document.getElementById('summary-filling').querySelector('span').textContent = getCheckedVal('cake-filling');
            document.getElementById('summary-occasion').querySelector('span').textContent = getElVal('custom-occasion');
            document.getElementById('summary-message').querySelector('span').textContent = getElVal('custom-message') || 'None';
            document.getElementById('summary-colors').querySelector('span').textContent = getElVal('custom-colors') || 'Default';
            document.getElementById('summary-decoration').querySelector('span').textContent = getElVal('custom-decoration') || 'None';
            const checkedSize = customCakeForm.querySelector('input[name="custom-cake-size"]:checked');
            const basePrice = checkedSize ? parseInt(checkedSize.dataset.price || 0) : 0;
            document.getElementById('summary-price').textContent = basePrice;
        };

        const updateCustomForm = () => {
            customSteps.forEach((step, index) => {
                step.classList.toggle('active', index + 1 === currentStep);
            });
            customForms.forEach(form => {
                form.classList.toggle('active', parseInt(form.dataset.step) === currentStep);
            });
            if (currentStep === 4) {
                updateOrderSummary();
            }
        };

        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                 alert("The 'Next' button was clicked!"); 
                if (currentStep < customSteps.length) {
                    currentStep++;
                    updateCustomForm();
                }
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep > 1) {
                    currentStep--;
                    updateCustomForm();
                }
            });
        });
        
        // ** THIS WAS THE BUGGY SECTION - IT IS NOW FIXED **
        const formOptions = customCakeForm.querySelectorAll('.size-option, .flavor-option');
        formOptions.forEach(option => {
            option.addEventListener('click', function(event) {
                // This prevents the click from bubbling up and causing issues
                event.stopPropagation(); 
                
                const input = this.querySelector('input[type="radio"]');
                if (!input) return;

                // Deselect all other options in the same group
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
        
        updateCustomForm(); // Initial call to set the view
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
            const deliveryTime = form.querySelector('#modal-delivery-time')?.value;
            const deliveryDate = form.querySelector('#modal-delivery-date')?.value;
            subject = `Quick Order: ${cakeName}`;
            message = `New Quick Order:\n\nCake: ${cakeName}\nSize: ${form.querySelector('input[name="cake-size"]:checked').value}\n\n--- Customer Details ---\nName: ${form.querySelector('#modal-customer-name').value}\nPhone: ${form.querySelector('#modal-customer-phone').value}\nDelivery Date (BS): ${deliveryDate}`;
            if (deliveryTime) message += `\nPreferred Time: ${deliveryTime}`;
        } else if (formId === 'custom-cake-form') {
            subject = 'New Custom Cake Order';
            const deliveryTime = document.getElementById('custom-time')?.value;
            const deliveryDate = document.getElementById('custom-date')?.value;
            updateOrderSummary();
            message = `New Custom Cake Order:\n\nCustomer: ${document.getElementById('custom-name').value}\nPhone: ${document.getElementById('custom-phone').value}\nEmail: ${document.getElementById('custom-email').value}\nDelivery Date (BS): ${deliveryDate}`;
            if (deliveryTime) message += `\nPreferred Time: ${deliveryTime}`;
            message += `\n\n--- Cake Details ---\nSize: ${document.getElementById('summary-size').querySelector('span').textContent}\nFlavor: ${document.getElementById('summary-flavor').querySelector('span').textContent}\nFilling: ${document.getElementById('summary-filling').querySelector('span').textContent}\nOccasion: ${document.getElementById('summary-occasion').querySelector('span').textContent}\nMessage on Cake: ${document.getElementById('summary-message').querySelector('span').textContent}\nColors: ${document.getElementById('summary-colors').querySelector('span').textContent}\nDecoration: ${document.getElementById('summary-decoration').querySelector('span').textContent}\n\nEstimated Price: NPR ${document.getElementById('summary-price').textContent}`;
        }
        if (message) {
            const whatsappUrl = `https://wa.me/${myWhatsApp}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            const mailtoUrl = `mailto:${myEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
            window.location.href = mailtoUrl;
            alert('Thank you! Your request has been prepared. Please complete the action in WhatsApp or your email client.');
            form.reset();
            if (formId === 'simple-order-form' && orderModal) {
                orderModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            if (formId === 'custom-cake-form') window.location.reload();
        }
    };
    const contactForm = document.getElementById('contact-form');
    if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);
    const simpleOrderForm = document.getElementById('simple-order-form');
    if (simpleOrderForm) simpleOrderForm.addEventListener('submit', handleFormSubmit);
    if (customCakeForm) customCakeForm.addEventListener('submit', handleFormSubmit);
});
