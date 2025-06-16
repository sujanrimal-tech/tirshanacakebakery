// This script is only loaded on custom-order/index.html

const form = document.getElementById('order-form');
const status = document.getElementById('form-status');
const bakeryWhatsAppNumber = '9779845645446'; // Your WhatsApp number with country code

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    let whatsappMessage = `*New Cake Order from Website!* 🎉\n\n` +
                          `*Customer:* ${data.name}\n` +
                          `*Phone:* ${data.phone}\n` +
                          (data.email ? `*Email:* ${data.email}\n` : '') +
                          `*Address:* ${data.address}\n\n` +
                          `*--- Order Details ---*\n` +
                          `*Size:* ${data.cake_size}\n` +
                          `*Flavor:* ${data.cake_flavor}\n` +
                          (data.cake_message ? `*Message on Cake:* "${data.cake_message}"\n` : '') +
                          (data.design_details ? `*Custom Details:* ${data.design_details}\n` : '') +
                          (data.design_upload.name ? `*Reference Image:* An image has been sent to the email.\n` : '');

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/${bakeryWhatsAppNumber}?text=${encodedMessage}`;

    status.textContent = 'Sending your order...';
    status.style.color = 'gray';

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            status.textContent = "Order sent successfully! Redirecting to WhatsApp...";
            status.style.color = 'green';
            form.reset();
            setTimeout(() => { window.open(whatsappURL, '_blank'); }, 1500);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.errors ? errorData.errors.map(e => e.message).join(', ') : 'An unknown error occurred.');
        }
    } catch (error) {
        console.error('Submission Error:', error);
        status.textContent = `Oops! There was a problem: ${error.message}`;
        status.style.color = 'red';
    }
});