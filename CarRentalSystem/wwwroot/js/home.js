// Home Page JavaScript

document.addEventListener("DOMContentLoaded", function () {
  initializeHeroSlider();
  initializeFilters();
  initializeCarCards();
});

// Hero Slider Functionality
function initializeHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  const prevBtn = document.querySelector(".hero-arrow.prev");
  const nextBtn = document.querySelector(".hero-arrow.next");

  if (slides.length === 0) return;

  let currentSlide = 0;
  const slideInterval = 5000; // 5 seconds
  let slideTimer;

  // Show specific slide
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    currentSlide = index;
  }

  // Next slide
  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  // Previous slide
  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  // Auto-play functionality
  function startSlideTimer() {
    slideTimer = setInterval(nextSlide, slideInterval);
  }

  function stopSlideTimer() {
    clearInterval(slideTimer);
  }

  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      stopSlideTimer();
      startSlideTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      stopSlideTimer();
      startSlideTimer();
    });
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      stopSlideTimer();
      startSlideTimer();
    });
  });

  // Pause on hover
  const heroSection = document.querySelector(".hero-section");
  if (heroSection) {
    heroSection.addEventListener("mouseenter", stopSlideTimer);
    heroSection.addEventListener("mouseleave", startSlideTimer);
  }

  // Initialize
  showSlide(0);
  startSlideTimer();
}

// Filter Functionality
function initializeFilters() {
  const filterForm = document.querySelector(".filter-section form");
  const searchInput = document.querySelector('input[name="searchTerm"]');
  const seatsSelect = document.querySelector('select[name="seats"]');

  if (!filterForm) return;

  // Real-time search (debounced)
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        // You can implement real-time filtering here if needed
        console.log("Search term:", this.value);
      }, 300);
    });
  }

  // Seats filter change
  if (seatsSelect) {
    seatsSelect.addEventListener("change", function () {
      console.log("Seats filter:", this.value);
    });
  }

  // Form submission with loading state
  filterForm.addEventListener("submit", function (e) {
    const submitBtn = this.querySelector(".filter-btn");
    if (submitBtn) {
      submitBtn.innerHTML =
        '<i class="bi bi-hourglass-split"></i> Searching...';
      submitBtn.disabled = true;
    }
  });
}

// Car Cards Functionality
function initializeCarCards() {
  const carCards = document.querySelectorAll(".car-card");

  carCards.forEach((card) => {
    // Add hover effects
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });

    // Handle booking buttons
    const bookingBtns = card.querySelectorAll(".btn");
    bookingBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        if (
          this.textContent.includes("Book") ||
          this.textContent.includes("Login")
        ) {
          // Add loading state
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="bi bi-hourglass-split"></i> Loading...';
          this.disabled = true;

          // Re-enable after navigation (in case of errors)
          setTimeout(() => {
            this.innerHTML = originalText;
            this.disabled = false;
          }, 3000);
        }
      });
    });
  });
}

// Utility Functions
function showLoading(element, text = "Loading...") {
  if (element) {
    element.innerHTML = `<i class="bi bi-hourglass-split"></i> ${text}`;
    element.disabled = true;
  }
}

function hideLoading(element, originalText) {
  if (element) {
    element.innerHTML = originalText;
    element.disabled = false;
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add animation classes when elements come into view
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe car cards
  document.querySelectorAll(".car-card").forEach((card) => {
    observer.observe(card);
  });

  // Observe filter section
  const filterSection = document.querySelector(".filter-section");
  if (filterSection) {
    observer.observe(filterSection);
  }
}

// Initialize scroll animations
addScrollAnimations();

// Add CSS for animations
const style = document.createElement("style");
style.textContent = `
    .car-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .car-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .filter-section {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .filter-section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
