// Cart Functions - Updated Version
function addToCart(product) {
    try {
        // Validate product
        if (!product || !product.id) {
            console.error("Invalid product added to cart");
            return;
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 0) + 1;
        } else {
            cart.push({
                ...product,
                quantity: 1,
                price: ensureNumber(product.price) // Ensure price is a valid number
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showCartNotification();
        calculateCartTotal();
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}

function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + (parseInt(item.quantity) || 1), 0);
        
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline-block' : 'none';
        });
    } catch (error) {
        console.error("Error updating cart count:", error);
    }
}

function calculateCartTotal() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => {
            const price = ensureNumber(item.price);
            const quantity = parseInt(item.quantity) || 1;
            return sum + (price * quantity);
        }, 0);

        // Shipping and tax calculations (could be dynamic in a real app)
        const shipping = 12.99;
        const tax = subtotal * 0.08; // 8% tax example (better than static value)
        const total = subtotal + shipping + tax;

        // Update DOM with proper formatting
        updateElement('subtotal', subtotal);
        updateElement('shipping', shipping);
        updateElement('tax', tax);
        updateElement('total', total);
    } catch (error) {
        console.error("Error calculating cart total:", error);
        updateElement('total', 0); // Fallback to $0.00 if error occurs
    }
}

// Helper functions
function ensureNumber(value) {
    // Handles strings like "$19.99", "1,000.50", or regular numbers
    if (typeof value === 'string') {
        return parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
    }
    return Number(value) || 0;
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = `$${value.toFixed(2)}`;
    } else {
        console.warn(`Element with ID '${id}' not found`);
    }
}

function showCartNotification() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        let notification = document.getElementById('cart-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'cart-notification';
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = '#4CAF50';
            notification.style.color = 'white';
            notification.style.padding = '15px 25px';
            notification.style.borderRadius = '4px';
            notification.style.zIndex = '1000';
            notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            notification.style.transition = 'all 0.3s ease';
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            document.body.appendChild(notification);
        }

        notification.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'} added to cart`;

        // Animation
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    } catch (error) {
        console.error("Error showing cart notification:", error);
    }
}

// Initialize cart on first load
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Update UI on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    calculateCartTotal();
});