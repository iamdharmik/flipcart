// Cart Management

function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const existingItem = AppData.cart.find(item => item.product.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        AppData.cart.push({
            product: product,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveToLocalStorage();
    
    // Show success message
    showToast('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    AppData.cart = AppData.cart.filter(item => item.product.id !== productId);
    updateCartCount();
    renderCart();
    saveToLocalStorage();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity === 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = AppData.cart.find(item => item.product.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartCount();
        renderCart();
        saveToLocalStorage();
    }
}

function updateCartCount() {
    const count = AppData.cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function getCartTotal() {
    return AppData.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
}

function getCartSubtotal() {
    return getCartTotal();
}

function getShippingCost() {
    const subtotal = getCartSubtotal();
    return subtotal > 499 ? 0 : 40;
}

function clearCart() {
    AppData.cart = [];
    updateCartCount();
    saveToLocalStorage();
}

function showCart() {
    hideAllPages();
    document.getElementById('cartPage').style.display = 'block';
    document.getElementById('footer').style.display = 'none';
    renderCart();
}

function renderCart() {
    const cartContent = document.getElementById('cartContent');
    
    if (AppData.cart.length === 0) {
        cartContent.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
                <h2 class="mb-3">Your cart is empty</h2>
                <p class="text-muted mb-4">Add some products to get started</p>
                <button class="btn btn-primary btn-lg" onclick="showHome()">
                    Start Shopping
                </button>
            </div>
        `;
        return;
    }
    
    const subtotal = getCartSubtotal();
    const shipping = getShippingCost();
    const total = subtotal + shipping;
    
    let cartHTML = `
        <div class="row">
            <div class="col-lg-8">
                <h2 class="mb-4">Shopping Cart</h2>
                <div class="space-y-4">
    `;
    
    AppData.cart.forEach(item => {
        cartHTML += `
            <div class="cart-item p-4 mb-3">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.product.image}" alt="${item.product.name}" 
                             class="img-fluid rounded" style="height: 80px; object-fit: cover;">
                    </div>
                    <div class="col-md-4">
                        <h5 class="mb-1">${item.product.name}</h5>
                        <p class="text-muted mb-0">${item.product.brand}</p>
                        <div class="mt-2">
                            <span class="fw-bold fs-5">${formatPrice(item.product.price)}</span>
                            ${item.product.originalPrice > item.product.price ? 
                                `<span class="text-muted text-decoration-line-through ms-2">${formatPrice(item.product.originalPrice)}</span>` 
                                : ''}
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="d-flex align-items-center justify-content-center">
                            <button class="quantity-btn me-2" onclick="updateQuantity(${item.product.id}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-3 fw-bold">${item.quantity}</span>
                            <button class="quantity-btn ms-2" onclick="updateQuantity(${item.product.id}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${item.product.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="col-md-1 text-end">
                        <span class="fw-bold">${formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartHTML += `
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Order Summary</h5>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Subtotal (${AppData.cart.reduce((total, item) => total + item.quantity, 0)} items)</span>
                            <span>${formatPrice(subtotal)}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Shipping</span>
                            <span class="${shipping === 0 ? 'text-success' : ''}">${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                        </div>
                        ${shipping > 0 ? `
                            <p class="small text-muted">Add ${formatPrice(499 - subtotal)} more for free shipping</p>
                        ` : ''}
                        <hr>
                        <div class="d-flex justify-content-between mb-3">
                            <strong>Total</strong>
                            <strong>${formatPrice(total)}</strong>
                        </div>
                        <button class="btn btn-primary w-100 btn-lg" onclick="proceedToCheckout()">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    cartContent.innerHTML = cartHTML;
}

function proceedToCheckout() {
    if (!AppData.currentUser) {
        showLoginModal();
        return;
    }
    showCheckout();
}

function showToast(message, type = 'info') {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : 'info'} position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
        ${message}
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}