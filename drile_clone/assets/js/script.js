// ==========================
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
  const categoriesPlaceholder = document.getElementById("categories-placeholder");
  if (categoriesPlaceholder) {
    const categoriesPath = isInPages ? "categories.html" : "pages/categories.html";
    fetch(categoriesPath)
      .then(res => res.text())
      .then(data => {
        categoriesPlaceholder.innerHTML = data;

        // Scroll arrows logic
        const scrollContainer = categoriesPlaceholder.querySelector(".categories-scroll");
        const btnLeft = categoriesPlaceholder.querySelector(".scroll-left");
        const btnRight = categoriesPlaceholder.querySelector(".scroll-right");

        if (scrollContainer && btnLeft && btnRight) {
          const scrollAmount = 150;

          const updateButtons = () => {
            btnLeft.disabled = scrollContainer.scrollLeft <= 0;
            btnRight.disabled =
              scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1;
          };

          btnLeft.addEventListener("click", () => {
            scrollContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
          });

          btnRight.addEventListener("click", () => {
            scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
          });

          scrollContainer.addEventListener("scroll", updateButtons);
          updateButtons(); // Initial check
        }
      })
      .catch(err => console.error("Error loading categories:", err));
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
      })
      .catch((err) => console.error("❌ Error loading products:", err));
  }

  
});

// ==========================
// Header Interactions
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

  // Contact toggle
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

  // Search toggle
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

  // Account icon hover/tooltip
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

  // Cart tooltip on hover
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

  // Cart hover preview
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
