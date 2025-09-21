// Customer Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeCustomerStats();
    initializeQuickActions();
    initializeBookingsTable();
    initializeAnimations();
    initializeCancelBookings();
});

// Customer Statistics Animation
function initializeCustomerStats() {
    const statCards = document.querySelectorAll('.customer-stat-card');
    
    statCards.forEach((card, index) => {
        // Animate numbers on load
        const numberElement = card.querySelector('h4');
        if (numberElement) {
            const finalValue = numberElement.textContent.includes('$') 
                ? parseFloat(numberElement.textContent.replace(/[^0-9.]/g, ''))
                : parseInt(numberElement.textContent) || 0;
            
            animateCustomerNumber(numberElement, 0, finalValue, 1000 + (index * 300), numberElement.textContent.includes('$'));
        }
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Quick Actions Functionality
function initializeQuickActions() {
    const actionButtons = document.querySelectorAll('.customer-action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add loading state
            const originalContent = this.innerHTML;
            const icon = this.querySelector('i');
            const text = this.textContent.trim();
            
            if (icon) {
                icon.className = 'bi bi-hourglass-split';
            }
            
            // Update text
            const textElements = Array.from(this.childNodes).filter(node => node.nodeType === 3);
            if (textElements.length > 0) {
                textElements[0].textContent = 'Loading...';
            }
            
            this.style.pointerEvents = 'none';
            
            // Reset after navigation (in case of errors)
            setTimeout(() => {
                this.innerHTML = originalContent;
                this.style.pointerEvents = 'auto';
            }, 3000);
        });
        
        // Add ripple effect
        button.addEventListener('click', function(e) {
            createCustomerRippleEffect(e, this);
        });
        
        // Add pulse animation on hover
        button.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.animation = 'pulse 1s infinite';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.animation = '';
            }
        });
    });
}

// Bookings Table Enhancements
function initializeBookingsTable() {
    const table = document.querySelector('.customer-table');
    if (!table) return;
    
    // Add row hover effects
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.boxShadow = '0 4px 8px rgba(189, 30, 81, 0.1)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Add sorting functionality to headers
    const headers = table.querySelectorAll('thead th');
    headers.forEach((header, index) => {
        if (index < headers.length - 1) { // Skip action column
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                sortCustomerTable(table, index);
            });
            
            // Add sort indicator
            const sortIcon = document.createElement('i');
            sortIcon.className = 'bi bi-arrow-down-up ms-2';
            sortIcon.style.opacity = '0.5';
            header.appendChild(sortIcon);
        }
    });
}

// Cancel Booking Functionality
function initializeCancelBookings() {
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    
    cancelButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const bookingId = this.closest('form').querySelector('input[name*="id"]')?.value;
            const carName = this.closest('tr').cells[1]?.textContent.trim();
            
            showCancelConfirmation(bookingId, carName, this.closest('form'));
        });
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
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
    
    // Observe elements
    const elementsToAnimate = [
        '.customer-stat-card',
        '.customer-actions-card',
        '.customer-bookings-card',
        '.customer-profile-summary'
    ];
    
    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(element);
        });
    });
}

// Utility Functions
function animateCustomerNumber(element, start, end, duration, isCurrency = false) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (difference * easeOutQuart);
        
        if (isCurrency) {
            element.textContent = `$${current.toFixed(2)}`;
        } else {
            element.textContent = Math.floor(current);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            if (isCurrency) {
                element.textContent = `$${end.toFixed(2)}`;
            } else {
                element.textContent = end;
            }
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function createCustomerRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function sortCustomerTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const header = table.querySelectorAll('thead th')[columnIndex];
    const sortIcon = header.querySelector('i');
    
    // Determine sort direction
    const isAscending = !header.classList.contains('sort-desc');
    
    // Reset all headers
    table.querySelectorAll('thead th').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
        const icon = th.querySelector('i');
        if (icon) {
            icon.className = 'bi bi-arrow-down-up ms-2';
            icon.style.opacity = '0.5';
        }
    });
    
    // Set current header
    header.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
    sortIcon.className = isAscending ? 'bi bi-arrow-up ms-2' : 'bi bi-arrow-down ms-2';
    sortIcon.style.opacity = '1';
    
    // Sort rows
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        
        // Try to parse as dates
        const aDate = new Date(aText);
        const bDate = new Date(bText);
        
        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
            return isAscending ? aDate - bDate : bDate - aDate;
        }
        
        // Try to parse as numbers
        const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        } else {
            return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        }
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
}

function showCancelConfirmation(bookingId, carName, form) {
    const modal = document.createElement('div');
    modal.className = 'cancel-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: slideInUp 0.3s ease;
        ">
            <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem;"></i>
            <h4 style="color: #490b3d; margin-bottom: 1rem;">Cancel Booking</h4>
            <p style="color: #666; margin-bottom: 2rem;">
                Are you sure you want to cancel your booking for <strong>${carName}</strong>?
                <br><small>This action cannot be undone.</small>
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn btn-outline-secondary cancel-modal-btn" onclick="this.closest('.cancel-modal').remove()">
                    <i class="bi bi-x"></i> Keep Booking
                </button>
                <button class="btn btn-danger cancel-modal-btn" onclick="confirmCancellation('${bookingId}', this)">
                    <i class="bi bi-trash"></i> Cancel Booking
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Store form reference for later use
    modal.formElement = form;
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

function confirmCancellation(bookingId, button) {
    const modal = button.closest('.cancel-modal');
    const form = modal.formElement;
    
    // Show loading state
    button.innerHTML = '<i class="bi bi-hourglass-split"></i> Cancelling...';
    button.disabled = true;
    
    // Submit the form after a short delay
    setTimeout(() => {
        form.submit();
    }, 1000);
}

function showCustomerNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} customer-notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 8px 16px rgba(189, 30, 81, 0.2);
        border: none;
        border-radius: 0.75rem;
    `;
    notification.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
    
    .cancel-modal-btn {
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .cancel-modal-btn:hover {
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);

// Make confirmCancellation globally available
window.confirmCancellation = confirmCancellation;

// Export utility functions
window.CustomerDashboardUtils = {
    animateCustomerNumber,
    sortCustomerTable,
    showCancelConfirmation,
    showCustomerNotification
};
