// Main Application Logic

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    initializeApp();
});

function initializeApp() {
    updateAuthUI();
    updateCartCount();
    renderCategories();
    renderProducts();
    initializeBrandSlider();
    showHome();
}

function hideAllPages() {
    const pages = ['homePage', 'productDetailPage', 'cartPage', 'checkoutPage', 'paymentPage', 'ordersPage', 'adminPage'];
    pages.forEach(pageId => {
        document.getElementById(pageId).style.display = 'none';
    });
}

function showHome() {
    hideAllPages();
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('footer').style.display = 'block';
    AppData.currentView = 'home';
}

// Brand Slider Functions
function initializeBrandSlider() {
    updateBrandSlider();
    
    // Auto-play slider
    setInterval(() => {
        nextSlide();
    }, 5000);
}

function updateBrandSlider() {
    const currentBrand = brands[AppData.currentBrandSlide];
    
    document.getElementById('brandImage').src = currentBrand.logo;
    document.getElementById('brandName').textContent = currentBrand.name;
    document.getElementById('brandDescription').textContent = currentBrand.description;
    
    // Update dots
    const dotsContainer = document.getElementById('brandDots');
    let dotsHTML = '';
    brands.forEach((_, index) => {
        dotsHTML += `
            <button class="btn btn-sm rounded-circle ${index === AppData.currentBrandSlide ? 'btn-warning' : 'btn-outline-light'}" 
                    onclick="goToSlide(${index})" style="width: 12px; height: 12px; padding: 0;"></button>
        `;
    });
    dotsContainer.innerHTML = dotsHTML;
}

function nextSlide() {
    AppData.currentBrandSlide = (AppData.currentBrandSlide + 1) % brands.length;
    updateBrandSlider();
}

function prevSlide() {
    AppData.currentBrandSlide = (AppData.currentBrandSlide - 1 + brands.length) % brands.length;
    updateBrandSlider();
}

function goToSlide(index) {
    AppData.currentBrandSlide = index;
    updateBrandSlider();
}

// Checkout Functions
function showCheckout() {
    if (!AppData.currentUser) {
        showLoginModal();
        return;
    }
    
    hideAllPages();
    document.getElementById('checkoutPage').style.display = 'block';
    document.getElementById('footer').style.display = 'none';
    renderCheckout();
}

function renderCheckout() {
    const checkoutContent = document.getElementById('checkoutContent');
    const subtotal = getCartSubtotal();
    const shipping = getShippingCost();
    const total = subtotal + shipping;
    
    checkoutContent.innerHTML = `
        <div class="row">
            <div class="col-lg-8">
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">
                            <i class="fas fa-map-marker-alt me-2"></i>Shipping Address
                        </h5>
                        <form id="checkoutForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Full Name *</label>
                                    <input type="text" class="form-control" id="fullName" value="${AppData.currentUser.name}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Phone Number *</label>
                                    <input type="tel" class="form-control" id="phone" value="${AppData.currentUser.phone || ''}" required>
                                </div>
                                <div class="col-12 mb-3">
                                    <label class="form-label">Address *</label>
                                    <input type="text" class="form-control" id="address" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">City *</label>
                                    <input type="text" class="form-control" id="city" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">State *</label>
                                    <input type="text" class="form-control" id="state" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">ZIP Code *</label>
                                    <input type="text" class="form-control" id="zipCode" required>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">
                            <i class="fas fa-credit-card me-2"></i>Payment Method
                        </h5>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" name="paymentMethod" id="cod" value="cod" checked>
                            <label class="form-check-label" for="cod">Cash on Delivery</label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="radio" name="paymentMethod" id="card" value="card">
                            <label class="form-check-label" for="card">Credit/Debit Card</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="paymentMethod" id="upi" value="upi">
                            <label class="form-check-label" for="upi">UPI</label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Order Summary</h5>
                        
                        <div class="mb-3">
                            ${AppData.cart.map(item => `
                                <div class="d-flex align-items-center mb-2">
                                    <img src="${item.product.image}" alt="${item.product.name}" 
                                         class="rounded me-2" style="width: 40px; height: 40px; object-fit: cover;">
                                    <div class="flex-grow-1">
                                        <div class="small fw-bold">${item.product.name}</div>
                                        <div class="small text-muted">Qty: ${item.quantity}</div>
                                    </div>
                                    <div class="small fw-bold">${formatPrice(item.product.price * item.quantity)}</div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <hr>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Subtotal</span>
                            <span>${formatPrice(subtotal)}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Shipping</span>
                            <span class="${shipping === 0 ? 'text-success' : ''}">${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                        </div>
                        <hr>
                        <div class="d-flex justify-content-between mb-3">
                            <strong>Total</strong>
                            <strong>${formatPrice(total)}</strong>
                        </div>
                        
                        <button class="btn btn-success w-100 mb-2" onclick="placeOrder('cod')">
                            Place Order (COD)
                        </button>
                        <button class="btn btn-primary w-100" onclick="showPayment()">
                            Pay Now - ${formatPrice(total)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function placeOrder(paymentMethod) {
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const shippingAddress = {
        fullName: document.getElementById('fullName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        phone: document.getElementById('phone').value
    };
    
    const order = {
        id: generateId(),
        userId: AppData.currentUser.id,
        items: [...AppData.cart],
        total: getCartTotal() + getShippingCost(),
        status: 'pending',
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    AppData.orders.push(order);
    clearCart();
    saveToLocalStorage();
    
    showToast('Order placed successfully!', 'success');
    showOrders();
}

// Payment Functions
function showPayment() {
    hideAllPages();
    document.getElementById('paymentPage').style.display = 'block';
    document.getElementById('footer').style.display = 'none';
    renderPayment();
}

function renderPayment() {
    const paymentContent = document.getElementById('paymentContent');
    const total = getCartTotal() + getShippingCost();
    
    paymentContent.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title text-center mb-4">
                            <i class="fas fa-shield-alt text-success me-2"></i>Secure Payment
                        </h3>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <h5 class="mb-3">Select Payment Method</h5>
                                
                                <div class="payment-method mb-3" onclick="selectPaymentMethod('card')">
                                    <div class="d-flex align-items-center">
                                        <input type="radio" name="payment" value="card" class="me-3">
                                        <i class="fas fa-credit-card fa-2x me-3 text-primary"></i>
                                        <div>
                                            <div class="fw-bold">Credit/Debit Card</div>
                                            <small class="text-muted">Visa, Mastercard, RuPay</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="payment-method mb-3" onclick="selectPaymentMethod('upi')">
                                    <div class="d-flex align-items-center">
                                        <input type="radio" name="payment" value="upi" class="me-3">
                                        <i class="fas fa-mobile-alt fa-2x me-3 text-success"></i>
                                        <div>
                                            <div class="fw-bold">UPI</div>
                                            <small class="text-muted">Pay using UPI ID</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="payment-method mb-3" onclick="selectPaymentMethod('qr')">
                                    <div class="d-flex align-items-center">
                                        <input type="radio" name="payment" value="qr" class="me-3">
                                        <i class="fas fa-qrcode fa-2x me-3 text-info"></i>
                                        <div>
                                            <div class="fw-bold">QR Code</div>
                                            <small class="text-muted">Scan & Pay</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="payment-method mb-3" onclick="selectPaymentMethod('gpay')">
                                    <div class="d-flex align-items-center">
                                        <input type="radio" name="payment" value="gpay" class="me-3">
                                        <i class="fab fa-google-pay fa-2x me-3 text-primary"></i>
                                        <div>
                                            <div class="fw-bold">Google Pay</div>
                                            <small class="text-muted">Quick & Secure</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <div id="paymentForm">
                                    <div class="text-center text-muted">
                                        <i class="fas fa-hand-pointer fa-3x mb-3"></i>
                                        <p>Select a payment method to continue</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <hr>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Order Summary</h6>
                                <div class="d-flex justify-content-between">
                                    <span>Total Amount:</span>
                                    <strong class="fs-4 text-primary">${formatPrice(total)}</strong>
                                </div>
                            </div>
                            <div class="col-md-6 text-end">
                                <button class="btn btn-primary btn-lg" id="payButton" onclick="processPayment()" disabled>
                                    <i class="fas fa-lock me-2"></i>Pay ${formatPrice(total)}
                                </button>
                            </div>
                        </div>
                        
                        <div class="text-center mt-3">
                            <small class="text-muted">
                                <i class="fas fa-shield-alt me-1"></i>
                                Your payment information is secure and encrypted
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let selectedPaymentMethod = null;

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // Update radio buttons
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.checked = radio.value === method;
    });
    
    // Update payment method styling
    document.querySelectorAll('.payment-method').forEach(element => {
        element.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Enable pay button
    document.getElementById('payButton').disabled = false;
    
    // Show appropriate form
    const paymentForm = document.getElementById('paymentForm');
    
    switch(method) {
        case 'card':
            paymentForm.innerHTML = `
                <h6 class="mb-3">Card Details</h6>
                <div class="mb-3">
                    <label class="form-label">Card Number</label>
                    <input type="text" class="form-control" placeholder="1234 5678 9012 3456" maxlength="19">
                </div>
                <div class="row">
                    <div class="col-6 mb-3">
                        <label class="form-label">Expiry Date</label>
                        <input type="text" class="form-control" placeholder="MM/YY" maxlength="5">
                    </div>
                    <div class="col-6 mb-3">
                        <label class="form-label">CVV</label>
                        <input type="text" class="form-control" placeholder="123" maxlength="3">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Cardholder Name</label>
                    <input type="text" class="form-control" placeholder="Enter name on card">
                </div>
            `;
            break;
            
        case 'upi':
            paymentForm.innerHTML = `
                <h6 class="mb-3">UPI Payment</h6>
                <div class="mb-3">
                    <label class="form-label">UPI ID</label>
                    <input type="text" class="form-control" placeholder="yourname@upi">
                </div>
                <div class="text-center">
                    <i class="fas fa-mobile-alt fa-3x text-success mb-2"></i>
                    <p class="text-muted">Enter your UPI ID to proceed</p>
                </div>
            `;
            break;
            
        case 'qr':
            paymentForm.innerHTML = `
                <h6 class="mb-3 text-center">Scan QR Code</h6>
                <div class="qr-code-container">
                    <div class="qr-placeholder">
                        <div class="text-center">
                            <i class="fas fa-qrcode fa-4x text-muted mb-2"></i>
                            <p class="mb-1">QR Code</p>
                            <small class="text-muted">${formatPrice(getCartTotal() + getShippingCost())}</small>
                        </div>
                    </div>
                    <p class="text-center mt-3 text-muted">
                        Use any UPI app to scan and pay
                    </p>
                </div>
            `;
            break;
            
        case 'gpay':
            paymentForm.innerHTML = `
                <h6 class="mb-3 text-center">Google Pay</h6>
                <div class="text-center">
                    <i class="fab fa-google-pay fa-5x text-primary mb-3"></i>
                    <p class="mb-3">Pay ${formatPrice(getCartTotal() + getShippingCost())} with Google Pay</p>
                    <p class="text-muted small">You'll be redirected to Google Pay to complete the payment</p>
                </div>
            `;
            break;
    }
}

function processPayment() {
    if (!selectedPaymentMethod) return;
    
    // Show processing state
    const payButton = document.getElementById('payButton');
    payButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    payButton.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Create order
        const shippingAddress = {
            fullName: AppData.currentUser.name,
            address: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            zipCode: '400001',
            phone: AppData.currentUser.phone || '9876543210'
        };
        
        const order = {
            id: generateId(),
            userId: AppData.currentUser.id,
            items: [...AppData.cart],
            total: getCartTotal() + getShippingCost(),
            status: 'pending',
            shippingAddress: shippingAddress,
            paymentMethod: selectedPaymentMethod,
            paymentStatus: 'completed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        AppData.orders.push(order);
        clearCart();
        saveToLocalStorage();
        
        // Show success and redirect
        showPaymentSuccess();
        
    }, 3000);
}

function showPaymentSuccess() {
    const paymentContent = document.getElementById('paymentContent');
    
    paymentContent.innerHTML = `
        <div class="text-center">
            <div class="card">
                <div class="card-body py-5">
                    <i class="fas fa-check-circle fa-5x text-success mb-4"></i>
                    <h2 class="text-success mb-3">Payment Successful!</h2>
                    <p class="text-muted mb-4">Your order has been placed successfully</p>
                    
                    <div class="bg-light rounded p-3 mb-4">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Amount Paid:</span>
                            <strong>${formatPrice(getCartTotal() + getShippingCost())}</strong>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span>Payment Method:</span>
                            <span class="text-uppercase">${selectedPaymentMethod}</span>
                        </div>
                    </div>
                    
                    <p class="text-muted mb-4">Redirecting to your orders...</p>
                    <div class="spinner-border text-primary" role="status"></div>
                </div>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        showOrders();
    }, 2000);
}

// Orders Functions
function showOrders() {
    if (!AppData.currentUser) {
        showLoginModal();
        return;
    }
    
    hideAllPages();
    document.getElementById('ordersPage').style.display = 'block';
    document.getElementById('footer').style.display = 'none';
    renderOrders();
}

function renderOrders() {
    const ordersContent = document.getElementById('ordersContent');
    const userOrders = AppData.orders.filter(order => order.userId === AppData.currentUser.id);
    
    if (userOrders.length === 0) {
        ordersContent.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-box fa-5x text-muted mb-4"></i>
                <h2 class="mb-3">No orders yet</h2>
                <p class="text-muted mb-4">Start shopping to see your orders here</p>
                <button class="btn btn-primary btn-lg" onclick="showHome()">
                    Start Shopping
                </button>
            </div>
        `;
        return;
    }
    
    let ordersHTML = '<h2 class="mb-4">My Orders</h2><div class="row">';
    
    userOrders.forEach(order => {
        const statusClass = `status-${order.status}`;
        const statusIcon = getStatusIcon(order.status);
        
        ordersHTML += `
            <div class="col-12 mb-4">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h5 class="card-title">Order #${order.id}</h5>
                                <p class="text-muted mb-0">Placed on ${new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div class="d-flex align-items-center">
                                ${statusIcon}
                                <span class="badge ${statusClass} ms-2">${order.status.toUpperCase()}</span>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Items (${order.items.length})</h6>
                                <div class="mb-3">
                                    ${order.items.map(item => `
                                        <div class="d-flex align-items-center mb-2">
                                            <img src="${item.product.image}" alt="${item.product.name}" 
                                                 class="rounded me-3" style="width: 40px; height: 40px; object-fit: cover;">
                                            <div class="flex-grow-1">
                                                <div class="fw-bold small">${item.product.name}</div>
                                                <div class="text-muted small">Qty: ${item.quantity}</div>
                                            </div>
                                            <div class="fw-bold small">${formatPrice(item.product.price * item.quantity)}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="col-md-6">
                                <h6>Shipping Address</h6>
                                <div class="text-muted small">
                                    <p class="mb-1 fw-bold text-dark">${order.shippingAddress.fullName}</p>
                                    <p class="mb-1">${order.shippingAddress.address}</p>
                                    <p class="mb-1">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
                                    <p class="mb-0">Phone: ${order.shippingAddress.phone}</p>
                                </div>
                            </div>
                        </div>
                        
                        <hr>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="text-muted small">
                                Payment: ${order.paymentMethod.toUpperCase()} • ${order.paymentStatus}
                            </div>
                            <div class="fw-bold fs-5">
                                Total: ${formatPrice(order.total)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    ordersHTML += '</div>';
    ordersContent.innerHTML = ordersHTML;
}

function getStatusIcon(status) {
    const icons = {
        pending: '<i class="fas fa-clock text-warning"></i>',
        processing: '<i class="fas fa-cog text-primary"></i>',
        shipped: '<i class="fas fa-truck text-info"></i>',
        delivered: '<i class="fas fa-check-circle text-success"></i>',
        cancelled: '<i class="fas fa-times-circle text-danger"></i>'
    };
    return icons[status] || '<i class="fas fa-clock text-muted"></i>';
}

// Search functionality
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

document.getElementById('mobileSearchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performMobileSearch();
    }
});

// Initialize the application
window.addEventListener('load', initializeApp);