document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const productsToggle = document.getElementById('products-toggle');
    const productsDropdown = document.getElementById('products-dropdown');
    const mobileProductsToggle = document.getElementById('mobile-products-toggle');
    const mobileProductsDropdown = document.getElementById('mobile-products-dropdown');

    // Toggle mobile menu
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Toggle desktop products dropdown
    productsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        productsDropdown.classList.toggle('hidden');
    });

    // Toggle mobile products dropdown
    mobileProductsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileProductsDropdown.classList.toggle('hidden');
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!productsToggle.contains(e.target) && !productsDropdown.contains(e.target)) {
            productsDropdown.classList.add('hidden');
        }
        if (!mobileProductsToggle.contains(e.target) && !mobileProductsDropdown.contains(e.target)) {
            mobileProductsDropdown.classList.add('hidden');
        }
    });

    // Highlight active navigation item
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, #products-dropdown a, #mobile-products-dropdown a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (href.includes('#') && href.split('#')[0] === currentPage)) {
            link.classList.add('active');
        }
    });

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const whatsappOrderBtn = document.getElementById('whatsapp-order-btn');

    // Update cart UI
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-3"></i>
                    <p class="text-gray-600">Your cart is empty</p>
                </div>
            `;
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                cartItems.innerHTML += `
                    <div class="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                        <div>
                            <h3 class="font-semibold">${item.name}</h3>
                            <p class="text-gray-600">₹${item.price} x ${item.quantity}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button class="decrease-quantity text-gray-600 hover:text-gray-800" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity text-gray-600 hover:text-gray-800" data-index="${index}">+</button>
                            <button class="remove-item text-red-500 hover:text-red-700" data-index="${index}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        cartTotal.textContent = `₹${total}`;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update WhatsApp order button
        const cartText = cart.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ');
        whatsappOrderBtn.setAttribute('href', `https://wa.me/919876543210?text=I'd like to order: ${encodeURIComponent(cartText)}`);
    }

    // Add to cart
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseInt(button.dataset.price);
            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            updateCart();
        });
    });

    // Cart item controls
    cartItems.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        if (e.target.classList.contains('remove-item')) {
            cart.splice(index, 1);
        } else if (e.target.classList.contains('increase-quantity')) {
            cart[index].quantity += 1;
        } else if (e.target.classList.contains('decrease-quantity')) {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
        }
        updateCart();
    });

    // Toggle cart sidebar
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.toggle('translate-x-full');
        cartOverlay.classList.toggle('hidden');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.add('translate-x-full');
        cartOverlay.classList.add('hidden');
    });

    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.add('translate-x-full');
        cartOverlay.classList.add('hidden');
    });

    // Initialize cart
    updateCart();
});