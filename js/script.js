<!-- ▼▼▼ REPLACE YOUR MODAL HTML WITH THIS ▼▼▼ -->
<div id="order-modal" class="order-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="modal-cake-title">Order Your Cake</h3>
            <button id="close-modal" class="close-modal">×</button>
        </div>
        <div class="modal-body">
            <form id="simple-order-form" novalidate>
                <!-- Hidden input to store the cake name -->
                <input type="hidden" id="modal-cake-name" name="cake-name">
                
                <div class="form-group">
                    <label>Select Size</label>
                    <div class="size-options">
                        <div class="size-option selected">
                            <input type="radio" id="modal-size-small" name="cake-size" value="half Pound" checked>
                            <label for="modal-size-small">half pound</label>
                        </div>
                        <div class="size-option">
                            <input type="radio" id="modal-size-medium" name="cake-size" value="1 pound">
                            <label for="modal-size-medium">1 pound</label>
                        </div>
                        <div class="size-option">
                            <input type="radio" id="modal-size-large" name="cake-size" value="2 pound">
                            <label for="modal-size-large">2 pound</label>
                        </div>
                        <div class="size-option">
                            <input type="radio" id="modal-size-extra-large" name="cake-size" value="3 pound">
                            <label for="modal-size-extra-large">3 pound</label>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="modal-cake-message">Message on Cake (Optional)</label>
                    <input type="text" id="modal-cake-message" name="cake-message" class="form-control" placeholder="e.g., Happy Birthday, Ashish!">
                </div>

                <div class="form-group">
                    <label for="modal-special-instructions">Allergies or Special Instructions (Optional)</label>
                    <textarea id="modal-special-instructions" name="special-instructions" class="form-control" rows="3" placeholder="e.g., Please make it eggless, less sugar, etc."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="modal-customer-name">Your Name</label>
                    <input type="text" id="modal-customer-name" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="modal-customer-phone">Phone Number</label>
                    <input type="tel" id="modal-customer-phone" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="modal-delivery-date">Delivery/Pickup Date (BS)</label>
                    <input type="text" id="modal-delivery-date" class="form-control" placeholder="Select a date..." autocomplete="off" required>
                </div>

                <div class="form-group">
                    <label for="modal-delivery-time">Preferred Time (Optional)</label>
                    <input type="time" id="modal-delivery-time" class="form-control">
                </div>       
                
                <button type="submit" class="submit-btn">Place Quick Order</button>
            </form>
        </div>
    </div>
</div>
<!-- ▲▲▲ END OF REPLACEMENT BLOCK ▲▲▲ -->
