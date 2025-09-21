// Authentication Pages JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializePasswordToggle();
    initializeFormValidation();
    initializeFormSubmission();
    initializeAnimations();
    initializeInputEffects();
});

// Password Toggle Functionality
function initializePasswordToggle() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.className = 'bi bi-eye-slash';
                this.setAttribute('aria-label', 'Hide password');
            } else {
                passwordInput.type = 'password';
                icon.className = 'bi bi-eye';
                this.setAttribute('aria-label', 'Show password');
            }
        });
    });
}

// Form Validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Remove validation styling on focus
            input.addEventListener('focus', function() {
                this.classList.remove('is-invalid', 'is-valid');
                clearFieldError(this);
            });
        });
        
        // Password confirmation validation
        const passwordInput = form.querySelector('input[type="password"][name*="Password"]:not([name*="Confirm"])');
        const confirmPasswordInput = form.querySelector('input[name*="ConfirmPassword"], input[name*="confirmPassword"]');
        
        if (passwordInput && confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                validatePasswordConfirmation(passwordInput, this);
            });
            
            passwordInput.addEventListener('input', function() {
                if (confirmPasswordInput.value) {
                    validatePasswordConfirmation(this, confirmPasswordInput);
                }
            });
        }
    });
}

// Field Validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required`;
    }
    
    // Email validation
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Password validation
    else if (field.type === 'password' && field.name.toLowerCase().includes('password') && !field.name.toLowerCase().includes('confirm') && value) {
        if (value.length < 6) {
            isValid = false;
            errorMessage = 'Password must be at least 6 characters long';
        }
    }
    
    // Username validation
    else if (field.name.toLowerCase().includes('username') && value) {
        if (value.length < 3) {
            isValid = false;
            errorMessage = 'Username must be at least 3 characters long';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Username can only contain letters, numbers, and underscores';
        }
    }
    
    // Update field styling
    field.classList.toggle('is-invalid', !isValid);
    field.classList.toggle('is-valid', isValid && value);
    
    // Show/hide error message
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

// Password Confirmation Validation
function validatePasswordConfirmation(passwordField, confirmField) {
    const password = passwordField.value;
    const confirmPassword = confirmField.value;
    
    if (confirmPassword && password !== confirmPassword) {
        confirmField.classList.add('is-invalid');
        confirmField.classList.remove('is-valid');
        showFieldError(confirmField, 'Passwords do not match');
        return false;
    } else if (confirmPassword) {
        confirmField.classList.remove('is-invalid');
        confirmField.classList.add('is-valid');
        clearFieldError(confirmField);
        return true;
    }
    
    return true;
}

// Form Submission
function initializeFormSubmission() {
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            const inputs = form.querySelectorAll('input[required]');
            let isFormValid = true;
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });
            
            // Additional password confirmation check
            const passwordInput = form.querySelector('input[type="password"][name*="Password"]:not([name*="Confirm"])');
            const confirmPasswordInput = form.querySelector('input[name*="ConfirmPassword"], input[name*="confirmPassword"]');
            
            if (passwordInput && confirmPasswordInput) {
                if (!validatePasswordConfirmation(passwordInput, confirmPasswordInput)) {
                    isFormValid = false;
                }
            }
            
            if (isFormValid) {
                submitForm(form);
            } else {
                // Shake the form to indicate error
                form.closest('.auth-card').classList.add('shake');
                setTimeout(() => {
                    form.closest('.auth-card').classList.remove('shake');
                }, 500);
                
                // Focus on first invalid field
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    });
}

// Submit Form
function submitForm(form) {
    const submitBtn = form.querySelector('.auth-submit');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Processing...';
    submitBtn.disabled = true;
    
    // Show loading overlay
    showLoadingOverlay();
    
    // Simulate processing time (remove this in production)
    setTimeout(() => {
        // Submit the actual form
        form.submit();
    }, 1000);
}

// Input Effects
function initializeInputEffects() {
    const inputs = document.querySelectorAll('.auth-form .form-control');
    
    inputs.forEach(input => {
        // Floating label effect
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentNode.classList.add('focused');
        }
    });
}

// Animations
function initializeAnimations() {
    const authCard = document.querySelector('.auth-card');
    if (authCard) {
        authCard.classList.add('fade-in');
    }
    
    // Stagger animation for form elements
    const formElements = document.querySelectorAll('.form-group, .auth-submit, .auth-footer');
    formElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

// Utility Functions
function getFieldLabel(field) {
    const label = field.closest('.form-group').querySelector('.form-label');
    if (label) {
        return label.textContent.replace('*', '').trim();
    }
    return field.name || 'Field';
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-validation-error';
    errorElement.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${message}`;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-validation-error');
    if (existingError) {
        existingError.remove();
    }
}

function showLoadingOverlay() {
    let overlay = document.querySelector('.loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="loading-spinner"></div>';
        document.querySelector('.auth-card').appendChild(overlay);
    }
    overlay.style.display = 'flex';
}

function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Auto-fill demo credentials (if demo section exists)
function initializeDemoCredentials() {
    const demoSection = document.querySelector('.demo-credentials');
    if (!demoSection) return;
    
    const usernameInput = document.querySelector('input[name*="username"], input[name*="Username"]');
    const passwordInput = document.querySelector('input[name*="password"], input[name*="Password"]:not([name*="Confirm"])');
    
    if (usernameInput && passwordInput) {
        const fillDemoBtn = document.createElement('button');
        fillDemoBtn.type = 'button';
        fillDemoBtn.className = 'btn btn-outline-primary btn-sm mt-2';
        fillDemoBtn.innerHTML = '<i class="bi bi-magic"></i> Fill Demo Credentials';
        
        fillDemoBtn.addEventListener('click', function() {
            usernameInput.value = 'admin';
            passwordInput.value = 'admin123';
            
            // Trigger validation
            validateField(usernameInput);
            validateField(passwordInput);
            
            // Add visual feedback
            this.innerHTML = '<i class="bi bi-check"></i> Filled!';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="bi bi-magic"></i> Fill Demo Credentials';
                this.disabled = false;
            }, 2000);
        });
        
        demoSection.appendChild(fillDemoBtn);
    }
}

// Initialize demo credentials if available
initializeDemoCredentials();

// Export utility functions
window.AuthUtils = {
    validateField,
    validatePasswordConfirmation,
    showFieldError,
    clearFieldError,
    showLoadingOverlay,
    hideLoadingOverlay
};
