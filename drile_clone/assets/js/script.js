// // ==========================
// Main DOMContentLoaded Initialization
// ==========================
window.addEventListener("DOMContentLoaded", () => {
  const isInPages = window.location.pathname.includes("/pages/");
  const headerPath = isInPages ? "../components/header.html" : "components/header.html";
  const footerPath = isInPages ? "../components/footer.html" : "components/footer.html";
  const carouselPath = isInPages ? "../pages/carousel_slider.html" : "pages/carousel_slider.html";
  const productsPath = isInPages ? "../pages/new_products.html" : "pages/new_products.html";

  // --------------------------
  // Load Header
  // --------------------------
  fetch(headerPath)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;
      const logo = document.getElementById("logo");
      if (logo) {
        gsap.from(logo, {
          y: -20,
          opacity: 0,
          duration: 1,
          ease: "power2.out"
        });
      }
      setTimeout(() => initializeHeaderInteractions(), 50);
    });

  // --------------------------
  // Load Footer
  // --------------------------
  fetch(footerPath)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });

  // --------------------------
  // Load Categories
  // --------------------------
  function loadCSS(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }

  const categoriesPlaceholder = document.getElementById("categories-placeholder");
  if (categoriesPlaceholder) {
    const categoriesPath = isInPages ? "categories.html" : "pages/categories.html";
    fetch(categoriesPath)
      .then(res => res.text())
      .then(data => {
        categoriesPlaceholder.innerHTML = data;

      

        initializeCategoryFeature();
        initializeCategoryScroll();
      })
      .catch(err => console.error("Error loading categories:", err));
  } else {
    initializeCategoryFeature();
    initializeCategoryScroll();
  }

  // --------------------------
  // Check if Index page, then load Carousel
  // --------------------------
  const isIndex =
    window.location.pathname === "/drile_clone/" ||
    window.location.pathname === "/drile_clone/index.html" ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("index.html");

  const carouselPlaceholder = document.getElementById("carousel-placeholder");
  if (isIndex && carouselPlaceholder) {
    fetch(carouselPath)
      .then((res) => res.text())
      .then((data) => {
        carouselPlaceholder.innerHTML = data;
        gsap.from(".carousel-caption", {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.3
        });
        setTimeout(() => initializeCarousel(), 50);
      });
  }

  // --------------------------
  // Load Products Section
  // --------------------------
  const productsPlaceholder = document.getElementById("products-placeholder");
  if (productsPlaceholder) {
    console.log("✅ Fetching Products Section from:", productsPath);
    fetch(productsPath)
      .then((res) => res.text())
      .then((data) => {
        console.log("✅ Fetched Products HTML Length:", data.length);
        productsPlaceholder.innerHTML = data;
        console.log("✅ Injected products into:", productsPlaceholder);

        // --------------------------
        // Initialize New Products Category Filter
        // --------------------------
        const buttons = document.querySelectorAll(".category-btn");
        const products = document.querySelectorAll(".product-item");

        function filterCategory(category) {
          products.forEach(item => {
            if (item.dataset.category === category) {
              item.style.display = "block";
            } else {
              item.style.display = "none";
            }
          });
        }

        // Default: Show only chairs
        filterCategory("chair");

        buttons.forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            filterCategory(btn.dataset.category);
          });
        });
      })
      .catch((err) => console.error("❌ Error loading products:", err));
  }
});

// ==========================
// Category Feature Hover/Click
// ==========================
function initializeCategoryFeature() {
  const categoryItems = document.querySelectorAll('.category-feature-item');
  const featureImage = document.querySelector('.category-feature-image img');

  categoryItems.forEach(item => {
    const img = item.querySelector('img');
    const defaultIcon = item.dataset.iconDefault;
    const hoverIcon = item.dataset.iconHover;

    if (item.classList.contains('active')) {
      img.src = hoverIcon;
      if (featureImage) {
        featureImage.src = item.dataset.image;
      }
    } else {
      img.src = defaultIcon;
    }

    item.addEventListener('mouseenter', () => {
      img.src = hoverIcon;
    });
    item.addEventListener('mouseleave', () => {
      if (!item.classList.contains('active')) {
        img.src = defaultIcon;
      }
    });

    item.addEventListener('click', () => {
      categoryItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('img').src = i.dataset.iconDefault;
      });
      item.classList.add('active');
      img.src = hoverIcon;
      if (featureImage) {
        featureImage.src = item.dataset.image;
      }
    });
  });
}

// ==========================
// Categories Scroll Buttons
// ==========================
function initializeCategoryScroll() {
  const scrollContainer = document.querySelector(".categories-scroll");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const scrollAmount = 256;

  if (scrollContainer && prevBtn && nextBtn) {
    let autoScrollInterval;

    function scrollLeft() {
      scrollContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }

    function scrollRight() {
      scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }

    prevBtn.addEventListener("click", () => {
      scrollLeft();
      resetAutoScroll();
    });

    nextBtn.addEventListener("click", () => {
      scrollRight();
      resetAutoScroll();
    });

    function startAutoScroll() {
      autoScrollInterval = setInterval(() => {
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1) {
          scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRight();
        }
      }, 3000);
    }

    function stopAutoScroll() {
      clearInterval(autoScrollInterval);
    }

    function resetAutoScroll() {
      stopAutoScroll();
      startAutoScroll();
    }

    scrollContainer.addEventListener("mouseenter", stopAutoScroll);
    scrollContainer.addEventListener("mouseleave", startAutoScroll);
    scrollContainer.addEventListener("focusin", stopAutoScroll);
    scrollContainer.addEventListener("focusout", startAutoScroll);

    startAutoScroll();
  }
}

// ==========================
// Header Interactions   (NOT WORKING)
// ==========================
function initializeHeaderInteractions() {
  const toggleBtn = document.getElementById("toggle-contact");
  const contactToggleIcon = document.getElementById("contact-toggle-icon");
  const contactInfo = document.getElementById("contact-info");
  const offcanvasEl = document.getElementById("mobileMenu");
  const searchToggle = document.getElementById("search-toggle");
  const searchBar = document.getElementById("search-bar");
  const searchClose = document.getElementById("search-close");

  const offcanvasInstance = offcanvasEl ? new bootstrap.Offcanvas(offcanvasEl) : null;

  if (toggleBtn && contactToggleIcon) {
    toggleBtn.addEventListener("click", () => {
      const isMobile = window.innerWidth < 992;
      if (isMobile && offcanvasInstance) {
        offcanvasInstance.toggle();
      } else {
        if (contactInfo) contactInfo.classList.toggle("d-none");
      }
      contactToggleIcon.classList.toggle("bi-list");
      contactToggleIcon.classList.toggle("bi-x-lg");
    });

    if (offcanvasEl) {
      offcanvasEl.addEventListener("hidden.bs.offcanvas", () => {
        contactToggleIcon.classList.remove("bi-x-lg");
        contactToggleIcon.classList.add("bi-list");
      });
    }
  }

  if (searchToggle && searchBar && searchClose) {
    searchToggle.addEventListener("click", (e) => {
      e.preventDefault();
      searchToggle.classList.add("d-none");
      searchBar.classList.remove("d-none");
      searchBar.querySelector("input")?.focus();
    });

    searchClose.addEventListener("click", () => {
      searchBar.classList.add("d-none");
      searchToggle.classList.remove("d-none");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchBar.classList.add("d-none");
        searchToggle.classList.remove("d-none");
      }
    });
  }

  // ===== Home Mega Menu Image Hover =====
  const previewImg = document.getElementById("home-preview-img");
  if (previewImg) {
    document.querySelectorAll(".home-dropdown .dropdown-item").forEach((link) => {
      link.addEventListener("mouseenter", () => {
        const newImg = link.getAttribute("data-img");
        if (newImg && previewImg.src !== newImg) {
          previewImg.src = newImg;
        }
      });
    });
  }


  const accountIcon = document.getElementById("account-icon");
  const tooltip = document.getElementById("signin-tooltip");
  const form = document.getElementById("account-hover-form");
  const accountLink = document.getElementById("account-link");

  if (accountIcon && tooltip && form && accountLink) {
    let tooltipTimeout;
    let isFormHovered = false;

    accountIcon.addEventListener("mouseenter", () => {
      form.style.display = "block";
      tooltipTimeout = setTimeout(() => {
        tooltip.style.opacity = 1;
      }, 500);
    });

    accountIcon.addEventListener("mouseleave", () => {
      clearTimeout(tooltipTimeout);
      tooltip.style.opacity = 0;
      setTimeout(() => {
        if (!isFormHovered) form.style.display = "none";
      }, 150);
    });

    form.addEventListener("mouseenter", () => {
      isFormHovered = true;
      accountLink.onclick = (e) => e.preventDefault();
    });

    form.addEventListener("mouseleave", () => {
      isFormHovered = false;
      tooltip.style.opacity = 0;
      form.style.display = "none";
      accountLink.onclick = null;
    });
  }

  const cartIcon = document.getElementById("cart-icon");
  const cartTooltip = document.getElementById("cart-tooltip");

  if (cartIcon && cartTooltip) {
    let cartTooltipTimeout;

    cartIcon.addEventListener("mouseenter", () => {
      cartTooltipTimeout = setTimeout(() => {
        cartTooltip.style.opacity = 1;
      }, 500);
    });

    cartIcon.addEventListener("mouseleave", () => {
      clearTimeout(cartTooltipTimeout);
      cartTooltip.style.opacity = 0;
    });
  }

  const cartPreview = document.getElementById("cart-hover-preview");
  const cartLink = document.getElementById("cart-link");
  const cartCountBadge = document.getElementById("cart-count-badge");

  if (cartIcon && cartPreview && cartLink && cartCountBadge) {
    let cartHovered = false;
    let hideTimeout;

    cartIcon.addEventListener("mouseenter", () => {
      cartPreview.style.display = "block";
      clearTimeout(hideTimeout);
    });

    cartIcon.addEventListener("mouseleave", () => {
      hideTimeout = setTimeout(() => {
        if (!cartHovered) cartPreview.style.display = "none";
      }, 200);
    });

    cartPreview.addEventListener("mouseenter", () => {
      cartHovered = true;
      clearTimeout(hideTimeout);
    });

    cartPreview.addEventListener("mouseleave", () => {
      cartHovered = false;
      cartPreview.style.display = "none";
    });
  }

  // --- FIX: Hover functionality for Language and Currency dropdowns ---
  const dropdowns = document.querySelectorAll('#contact-info .dropdown');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => {
      // Show the dropdown menu on hover
      const dropdownMenu = dropdown.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        dropdownMenu.style.display = 'block';
      }
    });

    dropdown.addEventListener('mouseleave', () => {
      // Hide the dropdown menu when the mouse leaves
      const dropdownMenu = dropdown.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        dropdownMenu.style.display = 'none';
      }
    });
  });
}
// ==========================
// Carousel GSAP animation
// ==========================
function initializeCarousel() {
  const heroCarousel = document.querySelector("#heroCarousel");
  if (!heroCarousel) return;

  const bsCarousel = new bootstrap.Carousel(heroCarousel, {
    interval: 4000,
    ride: "carousel",
  });

  animateHeroSlide(heroCarousel.querySelector(".carousel-item.active"));

  heroCarousel.addEventListener("slide.bs.carousel", (e) => {
    animateHeroSlide(e.relatedTarget);
  });

  function animateHeroSlide(slide) {
    const imageCol = slide.querySelector(".image-col");
    const textCol = slide.querySelector(".text-col");
    const controls = document.querySelector(".carousel-custom-controls");

    gsap.set([imageCol, textCol], { opacity: 0, y: 0 });

    gsap.fromTo(
      imageCol,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: "power4.out", delay: 0.2 }
    );

    gsap.fromTo(
      textCol,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: "power4.out", delay: 0.4 }
    );

    if (controls) {
      gsap.fromTo(
        controls,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.6 }
      );
    }
  }
}



// Extra handlers for categories scroll buttons (legacy)
document.querySelector(".scroll-left")?.addEventListener("click", () => {
  document.querySelector(".categories-scroll")?.scrollBy({ left: -200, behavior: "smooth" });
});
document.querySelector(".scroll-right")?.addEventListener("click", () => {
  document.querySelector(".categories-scroll")?.scrollBy({ left: 200, behavior: "smooth" });
});
