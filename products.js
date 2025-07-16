// Products Management

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const productsTitle = document.getElementById('productsTitle');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    
    let filteredProducts = getProducts();
    
    // Apply filters
    if (AppData.selectedBrand) {
        filteredProducts = filteredProducts.filter(product => 
            product.brand.toLowerCase() === AppData.selectedBrand.toLowerCase()
        );
    }
    
    if (AppData.searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(AppData.searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(AppData.searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(AppData.searchQuery.toLowerCase())
        );
    }
    
    if (AppData.selectedCategory) {
        filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase() === AppData.selectedCategory.toLowerCase()
        );
    }
    
    // Update title and show/hide clear filters button
    if (AppData.selectedBrand) {
        productsTitle.textContent = `${AppData.selectedBrand} Products`;
        clearFiltersBtn.style.display = 'block';
    } else if (AppData.searchQuery) {
        productsTitle.textContent = `Search results for "${AppData.searchQuery}"`;
        clearFiltersBtn.style.display = 'block';
    } else if (AppData.selectedCategory) {
        productsTitle.textContent = `${AppData.selectedCategory} Products`;
        clearFiltersBtn.style.display = 'block';
    } else {
        productsTitle.textContent = 'All Products';
        clearFiltersBtn.style.display = 'none';
    }
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-5x text-muted mb-4"></i>
                <h3 class="mb-3">No products found</h3>
                <p class="text-muted mb-4">Try adjusting your search or filters</p>
                <button class="btn btn-primary" onclick="clearFilters()">View All Products</button>
            </div>
        `;
        return;
    }
    
    let productsHTML = '';
    filteredProducts.forEach(product => {
        const discountPercentage = product.originalPrice 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;
            
        productsHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="card product-card h-100" onclick="showProductDetail(${product.id})">
                    <div class="position-relative">
                        <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                        ${discountPercentage > 0 ? `
                            <span class="position-absolute top-0 start-0 m-2 discount-badge">
                                ${discountPercentage}% OFF
                            </span>
                        ` : ''}
                        <button class="btn btn-primary position-absolute top-0 end-0 m-2 opacity-0 product-cart-btn" 
                                onclick="event.stopPropagation(); addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="mb-2">
                            <small class="text-muted text-uppercase">${product.brand}</small>
                            <h6 class="card-title mb-2">${product.name}</h6>
                        </div>
                        <div class="mb-2">
                            <div class="rating-stars">
                                ${generateStars(product.rating)}
                            </div>
                            <small class="text-muted">(${product.reviews})</small>
                        </div>
                        <div class="mt-auto">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <div>
                                    <span class="fw-bold fs-5">${formatPrice(product.price)}</span>
                                    ${product.originalPrice && product.originalPrice > product.price ? `
                                        <small class="price-original ms-1">${formatPrice(product.originalPrice)}</small>
                                    ` : ''}
                                </div>
                            </div>
                            <button class="btn btn-warning btn-sm w-100" onclick="event.stopPropagation(); addToCart(${product.id})">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    productsGrid.innerHTML = productsHTML;
}

function showProductDetail(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    AppData.selectedProduct = product;
    hideAllPages();
    document.getElementById('productDetailPage').style.display = 'block';
    document.getElementById('footer').style.display = 'none';
    renderProductDetail();
}

function renderProductDetail() {
    const product = AppData.selectedProduct;
    if (!product) return;
    
    const content = document.getElementById('productDetailContent');
    
    content.innerHTML = `
        <div class="row">
            <div class="col-lg-6">
                <div class="mb-4">
                    <img src="${product.image}" class="img-fluid rounded shadow" alt="${product.name}">
                </div>
                <div class="row">
                    <div class="col-3"><img src="${product.image}" class="img-fluid rounded border" alt=""></div>
                    <div class="col-3"><img src="${product.image}" class="img-fluid rounded border" alt=""></div>
                    <div class="col-3"><img src="${product.image}" class="img-fluid rounded border" alt=""></div>
                    <div class="col-3"><img src="${product.image}" class="img-fluid rounded border" alt=""></div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="mb-3">
                    <h1 class="display-5 fw-bold">${product.name}</h1>
                    <p class="text-muted fs-5">by ${product.brand}</p>
                </div>
                
                <div class="mb-3">
                    <div class="d-flex align-items-center mb-2">
                        <div class="rating-stars me-2">
                            ${generateStars(product.rating)}
                        </div>
                        <span class="fw-bold">${product.rating}</span>
                        <span class="text-muted ms-2">(${product.reviews} reviews)</span>
                    </div>
                </div>
                
                <div class="mb-4">
                    <div class="d-flex align-items-center mb-2">
                        <span class="display-6 fw-bold text-primary">${formatPrice(product.price)}</span>
                        ${product.originalPrice > product.price ? `
                            <span class="fs-4 text-muted text-decoration-line-through ms-3">${formatPrice(product.originalPrice)}</span>
                            <span class="badge bg-success ms-2">${product.discount}% OFF</span>
                        ` : ''}
                    </div>
                    <p class="text-success small">Inclusive of all taxes</p>
                </div>
                
                <div class="mb-4">
                    <label class="form-label fw-bold">Quantity</label>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-outline-secondary" onclick="changeQuantity(-1)">-</button>
                        <input type="number" class="form-control mx-2 text-center" id="productQuantity" value="1" min="1" style="width: 80px;">
                        <button class="btn btn-outline-secondary" onclick="changeQuantity(1)">+</button>
                    </div>
                </div>
                
                <div class="d-grid gap-2 d-md-flex mb-4">
                    <button class="btn btn-warning btn-lg flex-fill" onclick="addProductToCart()">
                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                    </button>
                    <button class="btn btn-primary btn-lg flex-fill" onclick="buyNow()">
                        Buy Now
                    </button>
                </div>
                
                <div class="mb-4">
                    <div class="d-flex gap-3">
                        <button class="btn btn-outline-secondary">
                            <i class="fas fa-heart me-2"></i>Wishlist
                        </button>
                        <button class="btn btn-outline-secondary">
                            <i class="fas fa-share me-2"></i>Share
                        </button>
                    </div>
                </div>
                
                <div class="border-top pt-4">
                    <div class="row text-center">
                        <div class="col-4">
                            <i class="fas fa-truck text-success fa-2x mb-2"></i>
                            <p class="small mb-0">Free Delivery</p>
                            <small class="text-muted">on orders above ₹499</small>
                        </div>
                        <div class="col-4">
                            <i class="fas fa-undo text-primary fa-2x mb-2"></i>
                            <p class="small mb-0">7 Days Return</p>
                            <small class="text-muted">Easy returns</small>
                        </div>
                        <div class="col-4">
                            <i class="fas fa-shield-alt text-warning fa-2x mb-2"></i>
                            <p class="small mb-0">1 Year Warranty</p>
                            <small class="text-muted">Manufacturer warranty</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row mt-5">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title">Product Description</h3>
                        <p class="card-text">${product.description}. This premium product from ${product.brand} offers exceptional quality and performance. Perfect for those who demand the best in ${product.category.toLowerCase()}. With its innovative design and cutting-edge features, this product delivers outstanding value and reliability.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function changeQuantity(change) {
    const quantityInput = document.getElementById('productQuantity');
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity += change;
    if (currentQuantity < 1) currentQuantity = 1;
    quantityInput.value = currentQuantity;
}

function addProductToCart() {
    const quantity = parseInt(document.getElementById('productQuantity').value);
    const product = AppData.selectedProduct;
    
    for (let i = 0; i < quantity; i++) {
        addToCart(product.id);
    }
}

function buyNow() {
    addProductToCart();
    showCheckout();
}

function renderCategories() {
    const container = document.getElementById('categoriesContainer');
    let categoriesHTML = '';
    
    categories.forEach(category => {
        categoriesHTML += `
            <a href="#" class="category-pill" onclick="filterByCategory('${category}')">
                ${category}
            </a>
        `;
    });
    
    container.innerHTML = categoriesHTML;
}

function filterByCategory(category) {
    AppData.selectedCategory = category;
    AppData.selectedBrand = null;
    AppData.searchQuery = '';
    renderProducts();
}

function filterByBrand() {
    const currentBrand = brands[AppData.currentBrandSlide];
    AppData.selectedBrand = currentBrand.name;
    AppData.selectedCategory = null;
    AppData.searchQuery = '';
    renderProducts();
}

function clearFilters() {
    AppData.selectedBrand = null;
    AppData.selectedCategory = null;
    AppData.searchQuery = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('mobileSearchInput').value = '';
    renderProducts();
}

function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    AppData.searchQuery = query;
    AppData.selectedBrand = null;
    AppData.selectedCategory = null;
    renderProducts();
}

function performMobileSearch() {
    const query = document.getElementById('mobileSearchInput').value.trim();
    AppData.searchQuery = query;
    AppData.selectedBrand = null;
    AppData.selectedCategory = null;
    renderProducts();
}