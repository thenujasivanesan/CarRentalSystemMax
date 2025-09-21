// Booking Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeDateValidation();
    initializeCostCalculation();
    initializeFormValidation();
    initializeBookingSubmission();
    initializeAnimations();
});

// Date Validation and Management
function initializeDateValidation() {
    const pickupDateInput = document.getElementById('PickupDate');
    const returnDateInput = document.getElementById('ReturnDate');
    
    if (!pickupDateInput || !returnDateInput) return;
    
    // Set minimum dates
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    pickupDateInput.min = today;
    returnDateInput.min = tomorrowStr;
    
    // Pickup date change handler
    pickupDateInput.addEventListener('change', function() {
        const pickupDate = new Date(this.value);
        const minReturnDate = new Date(pickupDate);
        minReturnDate.setDate(minReturnDate.getDate() + 1);
        
        returnDateInput.min = minReturnDate.toISOString().split('T')[0];
        
        // Update return date if it's before the new minimum
        if (returnDateInput.value && new Date(returnDateInput.value) <= pickupDate) {
            returnDateInput.value = minReturnDate.toISOString().split('T')[0];
        }
        
        validateDates();
        calculateCost();
    });
    
    // Return date change handler
    returnDateInput.addEventListener('change', function() {
        validateDates();
        calculateCost();
    });
    
    // Initial validation
    validateDates();
}

// Date Validation Function
function validateDates() {
    const pickupDateInput = document.getElementById('PickupDate');
    const returnDateInput = document.getElementById('ReturnDate');
    
    if (!pickupDateInput || !returnDateInput) return true;
    
    const pickupDate = new Date(pickupDateInput.value);
    const returnDate = new Date(returnDateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let isValid = true;
    
    // Clear previous validation messages
    clearValidationMessage(pickupDateInput);
    clearValidationMessage(returnDateInput);
    
    // Validate pickup date
    if (pickupDate < today) {
        showValidationMessage(pickupDateInput, 'Pickup date cannot be in the past');
        isValid = false;
    }
    
    // Validate return date
    if (returnDate <= pickupDate) {
        showValidationMessage(returnDateInput, 'Return date must be after pickup date');
        isValid = false;
    }
    
    // Update form submission button
    const submitBtn = document.querySelector('.btn-confirm');
    if (submitBtn) {
        submitBtn.disabled = !isValid;
    }
    
    return isValid;
}

// Cost Calculation
function initializeCostCalculation() {
    calculateCost();
}

function calculateCost() {
    const pickupDateInput = document.getElementById('PickupDate');
    const returnDateInput = document.getElementById('ReturnDate');
    const dailyRateElement = document.getElementById('dailyRate');
    const numberOfDaysElement = document.getElementById('numberOfDays');
    const totalCostElement = document.getElementById('totalCost');
    
    if (!pickupDateInput || !returnDateInput || !dailyRateElement || !numberOfDaysElement || !totalCostElement) {
        return;
    }
    
    const pickupDate = new Date(pickupDateInput.value);
    const returnDate = new Date(returnDateInput.value);
    const dailyRate = parseFloat(dailyRateElement.textContent);
    
    if (pickupDate && returnDate && returnDate > pickupDate && !isNaN(dailyRate)) {
        const timeDiff = returnDate.getTime() - pickupDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const totalCost = daysDiff * dailyRate;
        
        // Animate the changes
        animateNumberChange(numberOfDaysElement, daysDiff);
        animateNumberChange(totalCostElement, totalCost.toFixed(2));
    } else {
        numberOfDaysElement.textContent = '1';
        totalCostElement.textContent = dailyRate.toFixed(2);
    }
}

// Form Validation
function initializeFormValidation() {
    const form = document.querySelector('.booking-form form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const isValid = field.checkValidity();
    
    field.classList.toggle('is-invalid', !isValid);
    field.classList.toggle('is-valid', isValid);
    
    if (!isValid) {
        showValidationMessage(field, field.validationMessage);
    } else {
        clearValidationMessage(field);
    }
    
    return isValid;
}

// Booking Submission
function initializeBookingSubmission() {
    const form = document.querySelector('.booking-form form');
    const submitBtn = document.querySelector('.btn-confirm');
    
    if (!form || !submitBtn) return;
    
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
        
        // Validate dates
        if (!validateDates()) {
            isFormValid = false;
        }
        
        if (isFormValid) {
            submitBooking(form, submitBtn);
        } else {
            // Scroll to first invalid field
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
        }
    });
}

function submitBooking(form, submitBtn) {
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Processing Booking...';
    submitBtn.disabled = true;
    
    // Show loading overlay
    showLoadingOverlay();
    
    // Simulate processing time (remove this in production)
    setTimeout(() => {
        // Submit the form
        form.submit();
    }, 1000);
}

// Utility Functions
function showValidationMessage(field, message) {
    clearValidationMessage(field);
    
    const messageElement = document.createElement('div');
    messageElement.className = 'validation-message';
    messageElement.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${message}`;
    
    field.parentNode.appendChild(messageElement);
}

function clearValidationMessage(field) {
    const existingMessage = field.parentNode.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

function animateNumberChange(element, newValue) {
    const currentValue = parseFloat(element.textContent) || 0;
    const increment = (newValue - currentValue) / 20;
    let current = currentValue;
    
    const animation = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= newValue) || (increment < 0 && current <= newValue)) {
            current = newValue;
            clearInterval(animation);
        }
        element.textContent = typeof newValue === 'string' ? current.toFixed(2) : Math.round(current);
    }, 50);
}

function showLoadingOverlay() {
    let overlay = document.querySelector('.loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="loading-spinner"></div>';
        document.querySelector('.booking-form-card').style.position = 'relative';
        document.querySelector('.booking-form-card').appendChild(overlay);
    }
    overlay.style.display = 'flex';
}

function hideLoadingOverlay() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe cards
    const cards = document.querySelectorAll('.car-summary-card, .booking-form-card');
    cards.forEach(card => {
        observer.observe(card);
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .car-summary-card,
    .booking-form-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .car-summary-card.animate-in,
    .booking-form-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .form-control {
        transition: all 0.3s ease;
    }
    
    .form-control.is-invalid {
        border-color: #dc3545;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
    
    .form-control.is-valid {
        border-color: #28a745;
        box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
    }
    
    .booking-summary {
        transition: all 0.3s ease;
    }
    
    .booking-summary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(73, 11, 61, 0.15);
    }
    
    .btn-confirm {
        position: relative;
        overflow: hidden;
    }
    
    .btn-confirm::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
    }
    
    .btn-confirm:hover::before {
        left: 100%;
    }
`;
document.head.appendChild(style);

// Export utility functions
window.BookingUtils = {
    validateDates,
    calculateCost,
    showValidationMessage,
    clearValidationMessage,
    showLoadingOverlay,
    hideLoadingOverlay
};
