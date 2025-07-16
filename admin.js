// Admin Dashboard Management

function showAdmin() {
    if (!AppData.currentUser || AppData.currentUser.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        return;
    }
    
    hideAllPages();
    document.getElementById('adminPage').style.display = 'block';
    document.getElementById('footer').style.display = 'none';
    renderAdminDashboard();
}

function renderAdminDashboard() {
    const adminContent = document.getElementById('adminContent');
    
    const totalRevenue = AppData.orders.reduce((total, order) => total + order.total, 0);
    const totalOrders = AppData.orders.length;
    const totalProducts = products.length;
    const totalUsers = 1; // Mock data
    
    adminContent.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="display-6 fw-bold">Admin Dashboard</h1>
        </div>
        
        <!-- Stats Cards -->
        <div class="row mb-5">
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="admin-card p-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <p class="text-muted mb-1">Total Revenue</p>
                            <h3 class="text-success mb-0">${formatPrice(totalRevenue)}</h3>
                        </div>
                        <div class="stat-icon bg-success bg-opacity-10">
                            <i class="fas fa-dollar-sign text-success"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="admin-card p-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <p class="text-muted mb-1">Total Orders</p>
                            <h3 class="text-primary mb-0">${totalOrders}</h3>
                        </div>
                        <div class="stat-icon bg-primary bg-opacity-10">
                            <i class="fas fa-shopping-cart text-primary"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="admin-card p-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <p class="text-muted mb-1">Total Products</p>
                            <h3 class="text-info mb-0">${totalProducts}</h3>
                        </div>
                        <div class="stat-icon bg-info bg-opacity-10">
                            <i class="fas fa-box text-info"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="admin-card p-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <p class="text-muted mb-1">Total Users</p>
                            <h3 class="text-warning mb-0">${totalUsers}</h3>
                        </div>
                        <div class="stat-icon bg-warning bg-opacity-10">
                            <i class="fas fa-users text-warning"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Tabs -->
        <ul class="nav nav-tabs mb-4" id="adminTabs">
            <li class="nav-item">
                <button class="nav-link active" onclick="showAdminTab('products')">Products</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" onclick="showAdminTab('orders')">Orders</button>
            </li>
        </ul>
        
        <!-- Tab Content -->
        <div id="adminTabContent">
            ${renderProductsTab()}
        </div>
    `;
}

function showAdminTab(tab) {
    // Update active tab
    document.querySelectorAll('#adminTabs .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show tab content
    const tabContent = document.getElementById('adminTabContent');
    if (tab === 'products') {
        tabContent.innerHTML = renderProductsTab();
    } else if (tab === 'orders') {
        tabContent.innerHTML = renderOrdersTab();
    }
}

function renderProductsTab() {
    let productsHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>Products Management</h3>
            <button class="btn btn-primary" onclick="showAddProductModal()">
                <i class="fas fa-plus me-2"></i>Add Product
            </button>
        </div>
        
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="table-light">
                    <tr>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    products.forEach(product => {
        productsHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${product.image}" alt="${product.name}" 
                             class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;">
                        <div>
                            <div class="fw-bold">${product.name}</div>
                            <small class="text-muted">${product.category}</small>
                        </div>
                    </div>
                </td>
                <td>${product.brand}</td>
                <td>${formatPrice(product.price)}</td>
                <td>
                    <span class="badge ${product.inStock ? 'bg-success' : 'bg-danger'}">
                        ${product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    productsHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    return productsHTML;
}

function renderOrdersTab() {
    if (AppData.orders.length === 0) {
        return `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
                <h3>No orders yet</h3>
                <p class="text-muted">Orders will appear here when customers make purchases</p>
            </div>
        `;
    }
    
    let ordersHTML = `
        <h3 class="mb-4">Orders Management</h3>
        <div class="row">
    `;
    
    AppData.orders.forEach(order => {
        ordersHTML += `
            <div class="col-12 mb-4">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h5 class="card-title">Order #${order.id}</h5>
                                <p class="text-muted mb-0">${new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div class="d-flex align-items-center">
                                <select class="form-select me-3" onchange="updateOrderStatus(${order.id}, this.value)">
                                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                </select>
                                <span class="fw-bold fs-5">${formatPrice(order.total)}</span>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Customer Details</h6>
                                <p class="mb-1">${order.shippingAddress.fullName}</p>
                                <p class="mb-0 text-muted">${order.shippingAddress.phone}</p>
                            </div>
                            <div class="col-md-6">
                                <h6>Items (${order.items.length})</h6>
                                ${order.items.slice(0, 2).map(item => `
                                    <p class="mb-1 small">${item.product.name} × ${item.quantity}</p>
                                `).join('')}
                                ${order.items.length > 2 ? `<p class="small text-muted">+${order.items.length - 2} more items</p>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    ordersHTML += '</div>';
    return ordersHTML;
}

function showAddProductModal() {
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const product = {
        name: document.getElementById('productName').value,
        brand: document.getElementById('productBrand').value,
        price: parseInt(document.getElementById('productPrice').value),
        originalPrice: parseInt(document.getElementById('productOriginalPrice').value) || parseInt(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    
    // Calculate discount
    product.discount = product.originalPrice > product.price 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
    
    addProduct(product);
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
    document.getElementById('addProductForm').reset();
    
    // Refresh admin dashboard
    renderAdminDashboard();
    
    showToast('Product added successfully!', 'success');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        removeProduct(productId);
        renderAdminDashboard();
        showToast('Product deleted successfully!', 'success');
    }
}

function editProduct(productId) {
    // For now, just show an alert. In a real app, you'd open an edit modal
    alert('Edit functionality would be implemented here');
}

function updateOrderStatus(orderId, newStatus) {
    const order = AppData.orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        order.updatedAt = new Date().toISOString();
        saveToLocalStorage();
        showToast('Order status updated!', 'success');
    }
}

// Event listener for add product form
document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);