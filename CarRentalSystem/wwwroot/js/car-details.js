// Car Details Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeImageGallery();
    initializeBookingButtons();
    initializeScrollAnimations();
    initializeImageZoom();
});

// Image Gallery Functionality
function initializeImageGallery() {
    const mainImage = document.querySelector('.car-main-image img');
    const galleryThumbs = document.querySelectorAll('.gallery-thumb');
    
    if (!mainImage || galleryThumbs.length === 0) return;
    
    galleryThumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbs
            galleryThumbs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumb
            this.classList.add('active');
            
            // Get the image source from the thumb
            const thumbImg = this.querySelector('img');
            if (thumbImg) {
                // Fade out main image
                mainImage.style.opacity = '0';
                
                // Change source after fade
                setTimeout(() => {
                    mainImage.src = thumbImg.src;
                    mainImage.alt = thumbImg.alt;
                    mainImage.style.opacity = '1';
                }, 150);
            }
        });
    });
    
    // Set first thumb as active if none is active
    if (!document.querySelector('.gallery-thumb.active') && galleryThumbs.length > 0) {
        galleryThumbs[0].classList.add('active');
    }
}

// Booking Buttons Functionality
function initializeBookingButtons() {
    const bookBtn = document.querySelector('.btn-book');
    const loginBtn = document.querySelector('.btn-login');
    const backBtn = document.querySelector('.btn-back');
    
    // Book button
    if (bookBtn) {
        bookBtn.addEventListener('click', function(e) {
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="bi bi-hourglass-split"></i> Processing...';
            this.disabled = true;
            
            // Add pulse animation
            this.style.animation = 'pulse 1s infinite';
            
            // Re-enable after navigation (in case of errors)
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                this.style.animation = '';
            }, 3000);
        });
    }
    
    // Login button
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="bi bi-hourglass-split"></i> Redirecting...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 3000);
        });
    }
    
    // Back button with smooth transition
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="bi bi-arrow-left"></i> Going back...';
            
            // Navigate after short delay for better UX
            setTimeout(() => {
                window.location.href = this.href;
            }, 300);
        });
    }
}

// Image Zoom Functionality
function initializeImageZoom() {
    const mainImage = document.querySelector('.car-main-image');
    const img = mainImage?.querySelector('img');
    
    if (!mainImage || !img) return;
    
    // Create zoom overlay
    const zoomOverlay = document.createElement('div');
    zoomOverlay.className = 'zoom-overlay';
    zoomOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        cursor: zoom-out;
    `;
    
    const zoomedImg = document.createElement('img');
    zoomedImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 1rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;
    
    zoomOverlay.appendChild(zoomedImg);
    document.body.appendChild(zoomOverlay);
    
    // Click to zoom
    mainImage.style.cursor = 'zoom-in';
    mainImage.addEventListener('click', function() {
        zoomedImg.src = img.src;
        zoomedImg.alt = img.alt;
        zoomOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Animate in
        zoomOverlay.style.opacity = '0';
        setTimeout(() => {
            zoomOverlay.style.opacity = '1';
            zoomOverlay.style.transition = 'opacity 0.3s ease';
        }, 10);
    });
    
    // Click to close zoom
    zoomOverlay.addEventListener('click', function() {
        this.style.opacity = '0';
        setTimeout(() => {
            this.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    });
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && zoomOverlay.style.display === 'flex') {
            zoomOverlay.click();
        }
    });
}

// Scroll Animations
function initializeScrollAnimations() {
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
        '.car-image-card',
        '.car-info-card',
        '.rental-info-card'
    ];
    
    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            observer.observe(element);
        });
    });
}

// Smooth scrolling for internal links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize smooth scrolling
initializeSmoothScrolling();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .car-image-card,
    .car-info-card,
    .rental-info-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .car-image-card.animate-in,
    .car-info-card.animate-in,
    .rental-info-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .car-main-image img {
        transition: transform 0.3s ease, opacity 0.15s ease;
    }
    
    .gallery-thumb {
        transition: all 0.3s ease;
    }
    
    .gallery-thumb:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(73, 11, 61, 0.2);
    }
    
    .spec-row {
        transition: background-color 0.3s ease;
    }
    
    .spec-row:hover {
        background-color: rgba(73, 11, 61, 0.02);
    }
    
    .action-buttons .btn {
        position: relative;
        overflow: hidden;
    }
    
    .action-buttons .btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
    }
    
    .action-buttons .btn:hover::before {
        left: 100%;
    }
`;
document.head.appendChild(style);

// Add loading states for better UX
function addLoadingState(button, text = 'Loading...') {
    if (!button) return;
    
    const originalText = button.innerHTML;
    button.innerHTML = `<i class="bi bi-hourglass-split"></i> ${text}`;
    button.disabled = true;
    
    return () => {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// Export utility functions for use in other scripts
window.CarDetailsUtils = {
    addLoadingState,
    initializeImageGallery,
    initializeBookingButtons
};
