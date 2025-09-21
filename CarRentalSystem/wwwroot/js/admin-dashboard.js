// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeStatCards();
    initializeQuickActions();
    initializeTableEnhancements();
    initializeAnimations();
    initializeDataRefresh();
});

// Statistics Cards Animation and Functionality
function initializeStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
        // Animate numbers on load
        const numberElement = card.querySelector('h4');
        if (numberElement) {
            animateNumber(numberElement, 0, parseInt(numberElement.textContent) || 0, 1000 + (index * 200));
        }
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click functionality for navigation
        const cardType = card.classList.contains('cars') ? 'cars' :
                        card.classList.contains('bookings') ? 'bookings' :
                        card.classList.contains('customers') ? 'customers' : null;
        
        if (cardType) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                navigateToSection(cardType);
            });
        }
    });
}

// Quick Actions Functionality
function initializeQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add loading state
            const originalContent = this.innerHTML;
            const icon = this.querySelector('i');
            
            if (icon) {
                icon.className = 'bi bi-hourglass-split';
            }
            
            // Add loading text
            const textNode = Array.from(this.childNodes).find(node => node.nodeType === 3);
            if (textNode) {
                textNode.textContent = ' Loading...';
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
            createRippleEffect(e, this);
        });
    });
}

// Table Enhancements
function initializeTableEnhancements() {
    const table = document.querySelector('.admin-table');
    if (!table) return;
    
    // Add sorting functionality to headers
    const headers = table.querySelectorAll('thead th');
    headers.forEach((header, index) => {
        if (index < headers.length - 1) { // Skip action column
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                sortTable(table, index);
            });
            
            // Add sort indicator
            const sortIcon = document.createElement('i');
            sortIcon.className = 'bi bi-arrow-down-up ms-2';
            sortIcon.style.opacity = '0.5';
            header.appendChild(sortIcon);
        }
    });
    
    // Add row hover effects
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.boxShadow = '0 4px 8px rgba(73, 11, 61, 0.1)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Add search functionality if search input exists
    const searchInput = document.querySelector('#tableSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterTable(table, this.value);
        });
    }
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
        '.stat-card',
        '.quick-actions-card',
        '.recent-bookings-card'
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

// Data Refresh Functionality
function initializeDataRefresh() {
    // Auto-refresh data every 5 minutes
    setInterval(refreshDashboardData, 5 * 60 * 1000);
    
    // Add manual refresh button
    addRefreshButton();
}

// Utility Functions
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (difference * easeOutQuart));
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = end;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function navigateToSection(section) {
    const routes = {
        cars: '/Cars',
        bookings: '/Bookings/All',
        customers: '/Admin/Customers'
    };
    
    if (routes[section]) {
        // Add loading indicator
        showGlobalLoading();
        window.location.href = routes[section];
    }
}

function createRippleEffect(event, element) {
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

function sortTable(table, columnIndex) {
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

function filterTable(table, searchTerm) {
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const shouldShow = text.includes(term);
        
        row.style.display = shouldShow ? '' : 'none';
        
        if (shouldShow) {
            row.style.animation = 'fadeIn 0.3s ease';
        }
    });
}

function addRefreshButton() {
    const header = document.querySelector('.dashboard-header');
    if (!header) return;
    
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'btn btn-outline-primary';
    refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Refresh';
    refreshBtn.addEventListener('click', refreshDashboardData);
    
    header.appendChild(refreshBtn);
}

function refreshDashboardData() {
    const refreshBtn = document.querySelector('.btn-outline-primary');
    if (refreshBtn) {
        const originalContent = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        // Simulate refresh (in real app, make AJAX call)
        setTimeout(() => {
            refreshBtn.innerHTML = originalContent;
            refreshBtn.disabled = false;
            
            // Show success message
            showNotification('Dashboard data refreshed successfully!', 'success');
        }, 2000);
    }
}

function showGlobalLoading() {
    const loader = document.createElement('div');
    loader.id = 'globalLoader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    
    loader.innerHTML = `
        <div style="text-align: center;">
            <div class="loading-spinner" style="width: 3rem; height: 3rem; border: 0.3rem solid #e0e0e0; border-top: 0.3rem solid #490b3d; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 1rem; color: #490b3d; font-weight: 600;">Loading...</p>
        </div>
    `;
    
    document.body.appendChild(loader);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
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
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .notification {
        box-shadow: 0 8px 16px rgba(73, 11, 61, 0.2);
        border: none;
        border-radius: 0.75rem;
    }
`;
document.head.appendChild(style);

// Export utility functions
window.AdminDashboardUtils = {
    animateNumber,
    navigateToSection,
    sortTable,
    filterTable,
    refreshDashboardData,
    showNotification
};
