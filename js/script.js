document.addEventListener("DOMContentLoaded", () => {
    // --- Section 1: Load all HTML parts into the main page ---

    const sections = [
        { id: 'header-container', path: 'header/header.html' },
        { id: 'hero-container', path: 'hero/hero.html' },
        { id: 'menu-container', path: 'menu/menu.html' },
        { id: 'custom-order-container', path: 'custom_order/custom_order.html' },
        { id: 'gallery-container', path: 'gallery/gallery.html' },
        { id: 'footer-container', path: 'footer/footer.html' }
    ];

    // Use Promise.all to fetch all sections concurrently for faster loading
    Promise.all(sections.map(section => 
        fetch(section.path)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${section.path}`);
                return response.text();
            })
            .then(data => {
                document.getElementById(section.id).innerHTML = data;
            })
    ))
    .then(() => {
        // --- Section 2: After all content is loaded, set up the form ---
        setupOrderForm();
    })
    .catch(error => {
        console.error("Error loading page sections:", error);
        // Display an error message to the user on the page
        document.body.innerHTML = `<div style="text-align: center; padding: 50px; font-size: 1.2em;">
            <h1>Oops!</h1><p>Something went wrong while loading the page. Please try refreshing.</p>
            <p><i>Error: ${error.message}</i></p></div>`;
    });


    // --- Section 3: The function to handle form submission ---

    function setupOrderForm() {
        const form = document.getElementById('order-form');
        const status = document.getElementById('form-status');
        const bakeryWhatsAppNumber = '9779845645446'; // Your WhatsApp number with country code, no + or spaces

        if (!form) return; // Exit if the form isn't on the page yet

        form.addEventListener('submit', async function (e) {
            e.preventDefault(); // Stop the form from submitting the default way

            // 1. Create a FormData object to gather all form data, including files
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // 2. Format the order details for the WhatsApp message
            let whatsappMessage = `*New Cake Order from Website!* 🎉\n\n`;
            whatsappMessage += `*Customer:* ${data.name}\n`;
            whatsappMessage += `*Phone:* ${data.phone}\n`;
            if (data.email) whatsappMessage += `*Email:* ${data.email}\n`;
            whatsappMessage += `*Address:* ${data.address}\n\n`;
            whatsappMessage += `*--- Order Details ---*\n`;
            whatsappMessage += `*Size:* ${data.cake_size}\n`;
            whatsappMessage += `*Flavor:* ${data.cake_flavor}\n`;
            if (data.cake_message) whatsappMessage += `*Message on Cake:* "${data.cake_message}"\n`;
            if (data.design_details) whatsappMessage += `*Custom Details:* ${data.design_details}\n`;
            if (data.design_upload.name) whatsappMessage += `*Reference Image:* An image has been sent to the email.\n`;
            
            // 3. Create the WhatsApp URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://wa.me/${bakeryWhatsAppNumber}?text=${encodedMessage}`;

            // 4. Send the data to your email via Formspree
            status.textContent = 'Sending your order...';
            status.style.color = 'gray';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // 5. If email is sent successfully, show success and open WhatsApp
                    status.textContent = "Order sent! You will be redirected to WhatsApp to send us the details.";
                    status.style.color = 'green';
                    form.reset();
                    
                    // Open WhatsApp in a new tab after a short delay
                    setTimeout(() => {
                        window.open(whatsappURL, '_blank');
                    }, 1500);

                } else {
                    // Handle server errors from Formspree
                    const responseData = await response.json();
                    if (responseData.hasOwnProperty('errors')) {
                        throw new Error(responseData["errors"].map(error => error["message"]).join(", "));
                    } else {
                        throw new Error('An unknown error occurred.');
                    }
                }
            } catch (error) {
                // Handle network errors or errors from the step above
                console.error('Submission Error:', error);
                status.textContent = `Oops! There was a problem submitting your form: ${error.message}`;
                status.style.color = 'red';
            }
        });
    }
});