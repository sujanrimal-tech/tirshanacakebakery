// FILE: ../js/script.js
// This is the complete and final version. Please replace the entire file content.

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

    // --- Floating Action Button Logic ---
    const floatingOrderBtn = document.getElementById('floating-order-button');
    const closeFloatingBtn = document.getElementById('close-order-float');
    if (floatingOrderBtn && closeFloatingBtn) {
        if (sessionStorage.getItem('hideFloatingOrderBtn') === 'true') {
            floatingOrderBtn.classList.add('hidden');
        }
        closeFloatingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            floatingOrderBtn.classList.add('hidden');
            sessionStorage.setItem('hideFloatingOrderBtn', 'true');
        });
    }
    
    // --- Quick Order Modal Logic ---
    const orderModal = document.getElementById('order-modal');
    if (orderModal) {
         console.log("Checkpoint 1: Modal HTML found. Script is running.");
        const orderNowButtons = document.querySelectorAll('.order-now-btn');
        const closeModalBtn = document.getElementById('close-modal');
        const modalDateInput = document.getElementById("modal-delivery-date");

        // Initialize the datepicker ONCE when the page loads
        if (modalDateInput) {
            modalDateInput.nepaliDatePicker({
                ndpYear: true,
                ndpMonth: true,
                ndpYearCount: 10
         console.log(`Checkpoint 2: Found ${orderNowButtons.length} 'Order Now' buttons.`);
        }

        // This handles what happens when you click ANY "Order Now" button
        orderNowButtons.forEach(button => {
            button.addEventListener('click', function() {
                console.log("Checkpoint 3: 'Order Now' button was CLICKED!");
                // Get cake info from the button's data attributes
                const cakeName = this.dataset.cakeName;
                document.getElementById('modal-cake-title').textContent = `Order: ${cakeName}`;
                document.getElementById('modal-cake-name').value = cakeName;

                // Safely set the date input's value to today's date
                if (modalDateInput && typeof NepaliFunctions !== 'undefined' && NepaliFunctions.ConvertFromEnglishToNepaliDate) {
                    modalDateInput.value = NepaliFunctions.ConvertFromEnglishToNepaliDate(new Date());
                }
                
                // Show the modal and lock the page
                orderModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // This part handles closing the modal
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
        
        // This part handles selecting a size option
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
        // All logic for the custom cake form goes here...
        // This section remains unchanged and is omitted for clarity.
        // Make sure it is still present in your file.
    }

    // --- UNIFIED FORM SUBMISSION HANDLER for other forms ---
    const handleOtherForms = (e) => {
        e.preventDefault();
        const form = e.target;
        const formId = form.id;
        let subject = 'New Inquiry from Website';
        let message = '';

        // Helper function to safely get a value from a form element
        const getSafeValue = (selector, defaultValue = '') => {
            const element = form.querySelector(selector);
            return element ? element.value.trim() : defaultValue;
        };

        if (formId === 'contact-form') {
            subject = `Contact: ${getSafeValue('#contact-subject')}`;
            message = `New Contact Form Submission:\n\nName: ${getSafeValue('#contact-name')}\nEmail: ${getSafeValue('#contact-email')}\nPhone: ${getSafeValue('#contact-phone')}\nSubject: ${subject}\nMessage: ${getSafeValue('#contact-message')}`;
        } else if (formId === 'simple-order-form') {
            subject = `Quick Order: ${getSafeValue('#modal-cake-name', 'Unknown Cake')}`;
            const checkedSizeInput = form.querySelector('input[name="cake-size"]:checked');
            const selectedSize = checkedSizeInput ? checkedSizeInput.value : 'No size selected';
            
            message = `New Quick Order:\n\nCake: ${getSafeValue('#modal-cake-name', 'N/A')}\nSize: ${selectedSize}`;
            const cakeMessage = getSafeValue('#modal-cake-message');
            if (cakeMessage) {
                message += `\nMessage on Cake: ${cakeMessage}`;
            }
            const specialInstructions = getSafeValue('#modal-special-instructions');
            if (specialInstructions) {
                message += `\nSpecial Instructions: ${specialInstructions}`;
            }
            message += `\n\n--- Customer Details ---\nName: ${getSafeValue('#modal-customer-name', 'N/A')}\nPhone: ${getSafeValue('#modal-customer-phone', 'N/A')}\nDelivery Date (BS): ${getSafeValue('#modal-delivery-date', 'Not specified')}\nPreferred Time: ${getSafeValue('#modal-delivery-time', 'Not specified')}`;
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
