document.addEventListener('DOMContentLoaded', function() {

    const myEmail = 'sykodada3@gmail.com'; // IMPORTANT: REPLACE WITH YOUR EMAIL
    const myWhatsApp = '9779821183819'; // IMPORTANT: REPLACE WITH YOUR WHATSAPP NUMBER (include country code, no + or spaces)

    // --- General UI Functions ---

    // Header scroll effect
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

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navUl = document.querySelector('nav ul');
    if (mobileMenuBtn && navUl) {
        mobileMenuBtn.addEventListener('click', function() {
            navUl.classList.toggle('active');
        });
    }

    // Active Navigation Link Highlighter
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Dynamic Copyright Year
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }


    // --- Quick Order Modal Logic ---
    
    const orderModal = document.getElementById('order-modal');
    const orderNowButtons = document.querySelectorAll('.order-now-btn');
    const closeModalBtn = document.getElementById('close-modal');

    if (orderModal) {
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
        
        // Handle size option selection inside modal
        orderModal.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', function() {
                orderModal.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                this.querySelector('input').checked = true;
            });
        });
    }


    // --- Custom Cake Multi-Step Form Logic ---

    const customCakeForm = document.getElementById('custom-cake-form');
    if (customCakeForm) {
        // ... (The custom cake form logic remains the same as before)
        const customSteps = document.querySelectorAll('.step');
        const customForms = document.querySelectorAll('.custom-form');
        const nextButtons = document.querySelectorAll('.next-btn');
        const prevButtons = document.querySelectorAll('.prev-btn');

        let currentStep = 1;

        const updateCustomForm = () => {
            customSteps.forEach((step, index) => {
                step.classList.toggle('active', index + 1 <= currentStep);
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

        document.querySelectorAll('.size-option, .flavor-option').forEach(option => {
            option.addEventListener('click', function() {
                const input = this.querySelector('input');
                const groupName = input.name;
                
                document.querySelectorAll(`input[name="${groupName}"]`).forEach(radio => {
                    radio.closest('.size-option, .flavor-option').classList.remove('selected');
                });

                this.classList.add('selected');
                input.checked = true;
            });
        });

        const updateOrderSummary = () => {
            document.getElementById('summary-size').querySelector('span').textContent = document.querySelector('input[name="custom-cake-size"]:checked')?.value || 'N/A';
            document.getElementById('summary-flavor').querySelector('span').textContent = document.querySelector('input[name="cake-flavor"]:checked')?.value || 'N/A';
            document.getElementById('summary-filling').querySelector('span').textContent = document.querySelector('input[name="cake-filling"]:checked')?.value || 'N/A';
            document.getElementById('summary-occasion').querySelector('span').textContent = document.getElementById('custom-occasion')?.value || 'N/A';
            document.getElementById('summary-message').querySelector('span').textContent = document.getElementById('custom-message')?.value || 'None';
            document.getElementById('summary-colors').querySelector('span').textContent = document.getElementById('custom-colors')?.value || 'Default';
            document.getElementById('summary-decoration').querySelector('span').textContent = document.getElementById('custom-decoration')?.value || 'None';
            const basePrice = parseInt(document.querySelector('input[name="custom-cake-size"]:checked')?.dataset.price || 0);
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

        if (formId === 'contact-form') {
            subject = `Contact: ${form.querySelector('#contact-subject').value}`;
            message = `New Contact Form Submission:\n\n` +
                      `Name: ${form.querySelector('#contact-name').value}\n` +
                      `Email: ${form.querySelector('#contact-email').value}\n` +
                      `Phone: ${form.querySelector('#contact-phone').value}\n` +
                      `Subject: ${subject}\n` +
                      `Message: ${form.querySelector('#contact-message').value}`;
        
        } else if (formId === 'simple-order-form') {
            const cakeName = form.querySelector('#modal-cake-name').value;
            subject = `Quick Order: ${cakeName}`;
            message = `New Quick Order:\n\n`+
                      `Cake: ${cakeName}\n` +
                      `Size: ${form.querySelector('input[name="cake-size"]:checked').value}\n\n` +
                      `--- Customer Details ---\n` +
                      `Name: ${form.querySelector('#modal-customer-name').value}\n` +
                      `Phone: ${form.querySelector('#modal-customer-phone').value}\n` +
                      `Delivery Date: ${form.querySelector('#modal-delivery-date').value}`;

        } else if (formId === 'custom-cake-form') {
            subject = 'New Custom Cake Order';
            updateOrderSummary(); // Ensure summary is latest
            message = `New Custom Cake Order:\n\n` +
                      `Customer: ${form.querySelector('#custom-name').value}\n` +
                      `Phone: ${form.querySelector('#custom-phone').value}\n` +
                      `Email: ${form.querySelector('#custom-email').value}\n` +
                      `Delivery Date: ${form.querySelector('#custom-date').value}\n\n` +
                      `--- Cake Details ---\n` +
                      `Size: ${document.getElementById('summary-size').querySelector('span').textContent}\n` +
                      `Flavor: ${document.getElementById('summary-flavor').querySelector('span').textContent}\n` +
                      `Filling: ${document.getElementById('summary-filling').querySelector('span').textContent}\n` +
                      `Occasion: ${document.getElementById('summary-occasion').querySelector('span').textContent}\n` +
                      `Message on Cake: ${document.getElementById('summary-message').querySelector('span').textContent}\n` +
                      `Colors: ${document.getElementById('summary-colors').querySelector('span').textContent}\n` +
                      `Decoration: ${document.getElementById('summary-decoration').querySelector('span').textContent}\n\n` +
                      `Estimated Price: NPR ${document.getElementById('summary-price').textContent}`;
        }

        // 1. Send to WhatsApp
        const whatsappUrl = `https://wa.me/${myWhatsApp}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // 2. Send to Email
        const mailtoUrl = `mailto:${myEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        window.location.href = mailtoUrl;

        alert('Thank you! Your request has been prepared. Please complete the action in WhatsApp or your email client.');
        
        form.reset();
        if (formId === 'simple-order-form') {
            orderModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        if (formId === 'custom-cake-form') {
            currentStep = 1;
            updateCustomForm();
        }
    };

    // Attach the handler to all forms
    document.getElementById('contact-form')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('custom-cake-form')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('simple-order-form')?.addEventListener('submit', handleFormSubmit);

    // Animation on scroll
    // ... (This part remains the same as before) ...
    document.querySelectorAll('.section-title, .product-card, .service-card, .gallery-item, .about-content, .about-image').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.section-title, .product-card, .service-card, .gallery-item, .about-content, .about-image');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});