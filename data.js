// Data Management for Flipkart Clone

// Global Data Store
const AppData = {
    currentUser: null,
    cart: [],
    orders: [],
    currentView: 'home',
    selectedProduct: null,
    searchQuery: '',
    selectedBrand: null,
    selectedCategory: null,
    currentBrandSlide: 0,
    isLoginMode: true
};

// Brands Data
const brands = [
    {
        id: 1,
        name: 'Apple',
        logo: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Premium technology products'
    },
    {
        id: 2,
        name: 'Samsung',
        logo: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Innovation in electronics'
    },
    {
        id: 3,
        name: 'Nike',
        logo: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Athletic wear and footwear'
    },
    {
        id: 4,
        name: 'Adidas',
        logo: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Sports and lifestyle products'
    },
    {
        id: 5,
        name: 'Sony',
        logo: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Entertainment technology'
    },
    {
        id: 6,
        name: 'HP',
        logo: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Computing solutions'
    }
];

// Products Data
let products = [
    {
        id: 1,
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        price: 134900,
        originalPrice: 149900,
        discount: 10,
        rating: 4.5,
        reviews: 1250,
        image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Electronics',
        description: 'Latest iPhone with advanced features and premium design',
        inStock: true
    },
    {
        id: 2,
        name: 'Samsung Galaxy S24',
        brand: 'Samsung',
        price: 79999,
        originalPrice: 89999,
        discount: 11,
        rating: 4.3,
        reviews: 890,
        image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Electronics',
        description: 'Flagship Android smartphone with cutting-edge technology',
        inStock: true
    },
    {
        id: 3,
        name: 'Nike Air Max 270',
        brand: 'Nike',
        price: 12995,
        originalPrice: 14995,
        discount: 13,
        rating: 4.4,
        reviews: 567,
        image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Fashion',
        description: 'Comfortable running shoes with modern design',
        inStock: true
    },
    {
        id: 4,
        name: 'Adidas Ultraboost 22',
        brand: 'Adidas',
        price: 16999,
        originalPrice: 18999,
        discount: 11,
        rating: 4.6,
        reviews: 423,
        image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Fashion',
        description: 'Premium running shoes with boost technology',
        inStock: true
    },
    {
        id: 5,
        name: 'Sony WH-1000XM5',
        brand: 'Sony',
        price: 29990,
        originalPrice: 34990,
        discount: 14,
        rating: 4.7,
        reviews: 789,
        image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Electronics',
        description: 'Wireless noise-canceling headphones',
        inStock: true
    },
    {
        id: 6,
        name: 'HP Pavilion Laptop',
        brand: 'HP',
        price: 54999,
        originalPrice: 64999,
        discount: 15,
        rating: 4.2,
        reviews: 345,
        image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
        category: 'Electronics',
        description: 'Powerful laptop for work and entertainment',
        inStock: true
    }
];

// Categories Data
const categories = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Books',
    'Sports',
    'Beauty & Personal Care',
    'Toys & Games',
    'Automotive'
];

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star text-warning"></i>';
        } else {
            stars += '<i class="far fa-star text-warning"></i>';
        }
    }
    return stars;
}

function generateId() {
    return Date.now() + Math.random();
}

// Product Management Functions
function addProduct(product) {
    product.id = generateId();
    product.rating = 4.0;
    product.reviews = 0;
    product.inStock = true;
    products.push(product);
    renderProducts();
}

function removeProduct(productId) {
    products = products.filter(p => p.id !== productId);
    renderProducts();
}

function getProducts() {
    return products;
}

function getProductById(id) {
    return products.find(p => p.id == id);
}

// Local Storage Functions
function saveToLocalStorage() {
    localStorage.setItem('flipkartData', JSON.stringify({
        currentUser: AppData.currentUser,
        cart: AppData.cart,
        orders: AppData.orders,
        products: products
    }));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('flipkartData');
    if (saved) {
        const data = JSON.parse(saved);
        AppData.currentUser = data.currentUser;
        AppData.cart = data.cart || [];
        AppData.orders = data.orders || [];
        if (data.products) {
            products = data.products;
        }
    }
}