// NEW, MORE ROBUST script.js
document.addEventListener('DOMContentLoaded', function() {

    const myEmail = 'sykodada3@gmail.com'; // IMPORTANT: REPLACE WITH YOUR EMAIL
    const myWhatsApp = '9779821183819'; // IMPORTANT: REPLACE WITH YOUR WHATSAPP NUMBER

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

                const modalTitle = document.getElementById('modal-cake-title');
                const modalImage = document.getElementById('modal-cake-image');
                const modalCakeNameInput = document.getElementById('modal-cake-name');
                const modalDateInput = document.getElementById('modal-delivery-date');

                if (modalTitle) modalTitle.textContent = `Order: ${cakeName}`;
                if (modalImage) modalImage.src = cakeImg;
                if (modalCakeNameInput) modalCakeNameInput.value = cakeName;

                if (modalDateInput && typeof modalDateInput.nepaliDatePicker === 'function') {
                    modalDateInput.nepaliDatePicker();
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
            orderModal.addEventListener('click', (e) => {
                if (e.target === orderModal) {
                    closeModal();
                }
            });
        }
        
        const sizeOptions = orderModal.querySelectorAll('.size-option');
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                sizeOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                const radio = this.querySelector('input');
                if(radio) radio.checked = true;
            });
        });
    }

    // --- Custom Cake Multi-Step Form Logic ---
    const customCakeForm = document.getElementById('custom-cake-form');
    if (customCakeForm) {
        const customDateInput = document.getElementById('custom-date');
        if (customDateInput && typeof customDateInput.nepaliDatePicker === 'function') {
            customDateInput.nepaliDatePicker();
        }

        const customSteps = customCakeForm.querySelectorAll('.step');
        const customForms = customCakeForm.querySelectorAll('.custom-form');
        const nextButtons = customCakeForm.querySelectorAll('.next-btn');
        const prevButtons = customCakeForm.querySelectorAll('.prev-btn');
        
        let currentStep = 1;

        const updateCustomForm = () => {
            customSteps.forEach((step, index) => {
                step.classList.toggle('active', index + 1 <= currentStep);
            });
            customForms.forEach(form => {
                form.classList.toggle('active', parseInt(form.dataset.step) === currentStep);
            });
            if (currentStep === 4) updateOrderSummary();
        };

        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
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
        
        const allOptions = customCakeForm.querySelectorAll('.size-option, .flavor-option');
        allOptions.forEach(option => {
            option.addEventListener('click', function() {
                const input = this.querySelector('input');
                if (!input) return;
                const groupName = input.name;
                
                customCakeForm.querySelectorAll(`input[name="${groupName}"]`).forEach(radio => {
                    const parentOption = radio.closest('.size-option, .flavor-option');
                    if (parentOption) parentOption.classList.remove('selected');
                });

                this.classList.add('selected');
                input.checked = true;
            });
        });

        const updateOrderSummary = () => {
            // Helper function to safely get values
            const getElVal = (selector) => document.querySelector(selector) ? document.querySelector(selector).value : 'N/A';
            const getElText = (selector) => document.querySelector(selector) ? document.querySelector(selector).textContent : 'N/A';
            const getCheckedVal = (name) => document.querySelector(`input[name="${name}"]:checked`) ? document.querySelector(`input[name="${name}"]:checked`).value : 'N/A';
            
            const summarySizeEl = document.getElementById('summary-size span');
            if (summarySizeEl) summarySizeEl.textContent = getCheckedVal('custom-cake-size');

            document.getElementById('summary-size').querySelector('span').textContent = getCheckedVal('custom-cake-size');
            document.getElementById('summary-flavor').querySelector('span').textContent = getCheckedVal('cake-flavor');
            document.getElementById('summary-filling').querySelector('span').textContent = getCheckedVal('cake-filling');
            document.getElementById('summary-occasion').querySelector('span').textContent = getElVal('#custom-occasion');
            document.getElementById('summary-message').querySelector('span').textContent = getElVal('#custom-message') || 'None';
            document.getElementById('summary-colors').querySelector('span').textContent = getElVal('#custom-colors') || 'Default';
            document.getElementById('summary-decoration').querySelector('span').textContent = getElVal('#custom-decoration') || 'None';
            
            const checkedSize = document.querySelector('input[name="custom-cake-size"]:checked');
            const basePrice = checkedSize ? parseInt(checkedSize.dataset.price || 0) : 0;
            document.getElementById('summary-price').textContent = basePrice;
        };
        
        updateCustomForm();
    }

    // --- UNIFIED FORM SUBMISSION HANDLER ---
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formId = form.id;
        let subject = 'New Inquiry from Website';
        let message = '';
        
        if (formId === 'simple-order-form') {
            const cakeName = form.querySelector('#modal-cake-name').value;
            const deliveryTime = form.querySelector('#modal-delivery-time').value;
            subject = `Quick Order: ${cakeName}`;
            
            message = `New Quick Order:\n\n` +
                      `Cake: ${cakeName}\n` +
                      `Size: ${form.querySelector('input[name="cake-size"]:checked').value}\n\n` +
                      `--- Customer Details ---\n` +
                      `Name: ${form.querySelector('#modal-customer-name').value}\n` +
                      `Phone: ${form.querySelector('#modal-customer-phone').value}\n` +
                      `Delivery Date (BS): ${form.querySelector('#modal-delivery-date').value}`;
            if (deliveryTime) message += `\nPreferred Time: ${deliveryTime}`;

        } else if (formId === 'custom-cake-form') {
            subject = 'New Custom Cake Order';
            const deliveryTime = form.querySelector('#custom-time').value;
            updateOrderSummary();
            
            message = `New Custom Cake Order:\n\n` +
                      `Customer: ${form.querySelector('#custom-name').value}\n` +
                      `Phone: ${form.querySelector('#custom-phone').value}\n` +
                      `Email: ${form.querySelector('#custom-email').value}\n` +
                      `Delivery Date (BS): ${form.querySelector('#custom-date').value}`;
            if (deliveryTime) message += `\nPreferred Time: ${deliveryTime}`;
                      
            message += `\n\n--- Cake Details ---\n` +
                      `Size: ${document.getElementById('summary-size').querySelector('span').textContent}\n` +
                      `Flavor: ${document.getElementById('summary-flavor').querySelector('span').textContent}\n` +
                      `Filling: ${document.getElementById('summary-filling').querySelector('span').textContent}\n` +
                      `Occasion: ${document.getElementById('summary-occasion').querySelector('span').textContent}\n` +
                      `Message on Cake: ${document.getElementById('summary-message').querySelector('span').textContent}\n` +
                      `Colors: ${document.getElementById('summary-colors').querySelector('span').textContent}\n` +
                      `Decoration: ${document.getElementById('summary-decoration').querySelector('span').textContent}\n\n` +
                      `Estimated Price: NPR ${document.getElementById('summary-price').textContent}`;
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
            if (formId === 'custom-cake-form') {
                currentStep = 1;
                updateCustomForm();
            }
        }
    };
    
    // Attach handler only to forms that exist on the page
    const simpleOrderForm = document.getElementById('simple-order-form');
    if(simpleOrderForm) simpleOrderForm.addEventListener('submit', handleFormSubmit);

    // The custom form is already checked for existence above
    if(customCakeForm) customCakeForm.addEventListener('submit', handleFormSubmit);
    
});
