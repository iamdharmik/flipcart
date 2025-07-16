// Authentication Management

function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

function switchAuthMode() {
    AppData.isLoginMode = !AppData.isLoginMode;
    const title = document.getElementById('loginModalTitle');
    const nameField = document.getElementById('nameField');
    const phoneField = document.getElementById('phoneField');
    const confirmPasswordField = document.getElementById('confirmPasswordField');
    const submitBtn = document.getElementById('authBtnText');
    const switchBtn = document.getElementById('switchModeBtn');
    
    if (AppData.isLoginMode) {
        title.textContent = 'Login to Your Account';
        nameField.style.display = 'none';
        phoneField.style.display = 'none';
        confirmPasswordField.style.display = 'none';
        submitBtn.textContent = 'Sign In';
        switchBtn.textContent = "Don't have an account? Sign up";
    } else {
        title.textContent = 'Create New Account';
        nameField.style.display = 'block';
        phoneField.style.display = 'block';
        confirmPasswordField.style.display = 'block';
        submitBtn.textContent = 'Create Account';
        switchBtn.textContent = 'Already have an account? Sign in';
    }
    
    clearAuthErrors();
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = document.getElementById(fieldId + 'Toggle');
    
    if (field.type === 'password') {
        field.type = 'text';
        toggle.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        toggle.className = 'fas fa-eye';
    }
}

function validateAuthForm() {
    clearAuthErrors();
    let isValid = true;
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password validation
    if (!password) {
        showFieldError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError('password', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (!AppData.isLoginMode) {
        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Name validation
        if (!fullName.trim()) {
            showFieldError('fullName', 'Full name is required');
            isValid = false;
        }
        
        // Phone validation
        if (phone && !/^\d{10}$/.test(phone)) {
            showFieldError('phone', 'Phone number must be 10 digits');
            isValid = false;
        }
        
        // Confirm password validation
        if (!confirmPassword) {
            showFieldError('confirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showFieldError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
    }
    
    return isValid;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + 'Error');
    
    field.classList.add('is-invalid');
    errorDiv.textContent = message;
}

function clearAuthErrors() {
    const fields = ['email', 'password', 'fullName', 'phone', 'confirmPassword'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + 'Error');
        if (field) {
            field.classList.remove('is-invalid');
        }
        if (errorDiv) {
            errorDiv.textContent = '';
        }
    });
}

function handleAuthSubmit(e) {
    e.preventDefault();
    
    if (!validateAuthForm()) {
        return;
    }
    
    const submitBtn = document.getElementById('authSubmitBtn');
    const loader = document.getElementById('authLoader');
    const btnText = document.getElementById('authBtnText');
    
    // Show loading state
    submitBtn.disabled = true;
    loader.style.display = 'inline-block';
    btnText.textContent = AppData.isLoginMode ? 'Signing In...' : 'Creating Account...';
    
    // Simulate API call
    setTimeout(() => {
        const email = document.getElementById('email').value;
        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        
        if (AppData.isLoginMode) {
            // Login logic
            const user = {
                id: generateId(),
                name: email === 'admin@flipkart.com' ? 'Admin User' : (fullName || 'John Doe'),
                email: email,
                role: email === 'admin@flipkart.com' ? 'admin' : 'customer',
                phone: phone,
                createdAt: new Date().toISOString()
            };
            
            AppData.currentUser = user;
            updateAuthUI();
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            resetAuthForm();
            saveToLocalStorage();
        } else {
            // Registration logic - switch to login mode
            AppData.isLoginMode = true;
            switchAuthMode();
            document.getElementById('email').value = email;
            document.getElementById('password').value = '';
            
            // Show success message
            alert('Account created successfully! Please login.');
        }
        
        // Reset loading state
        submitBtn.disabled = false;
        loader.style.display = 'none';
        btnText.textContent = AppData.isLoginMode ? 'Sign In' : 'Create Account';
        
    }, 1000);
}

function resetAuthForm() {
    document.getElementById('authForm').reset();
    clearAuthErrors();
}

function updateAuthUI() {
    const userSection = document.getElementById('userSection');
    const loginSection = document.getElementById('loginSection');
    const userName = document.getElementById('userName');
    const adminBtn = document.getElementById('adminBtn');
    
    if (AppData.currentUser) {
        userSection.style.display = 'block';
        loginSection.style.display = 'none';
        userName.textContent = AppData.currentUser.name;
        
        if (AppData.currentUser.role === 'admin') {
            adminBtn.style.display = 'inline-block';
        } else {
            adminBtn.style.display = 'none';
        }
    } else {
        userSection.style.display = 'none';
        loginSection.style.display = 'block';
    }
}

function logout() {
    AppData.currentUser = null;
    AppData.cart = [];
    updateAuthUI();
    updateCartCount();
    showHome();
    saveToLocalStorage();
}

// Event Listeners
document.getElementById('authForm').addEventListener('submit', handleAuthSubmit);