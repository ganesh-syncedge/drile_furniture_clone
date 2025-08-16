document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("gallery-container");
  const galleryWrapper = document.querySelector(".gallery-container-wrapper");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  let originalItems = Array.from(
    galleryContainer.querySelectorAll(".gallery-item")
  );
  const totalOriginalItems = originalItems.length;
  const visibleItems = window.innerWidth >= 768 ? 4 : 1;

  let autoSlideInterval;
  const autoSlideIntervalDuration = 3000; // 3 seconds

  let isScrolling = false;

  const getItemWidth = () => {
    const firstItem = galleryContainer.querySelector(".gallery-item");
    return firstItem ? firstItem.offsetWidth : 0;
  };

  const cloneItems = () => {
    galleryContainer
      .querySelectorAll(".cloned")
      .forEach((clone) => clone.remove());

    const startClones = originalItems.slice(-visibleItems).map((item) => {
      const clone = item.cloneNode(true);
      clone.classList.add("cloned");
      return clone;
    });

    const endClones = originalItems.slice(0, visibleItems).map((item) => {
      const clone = item.cloneNode(true);
      clone.classList.add("cloned");
      return clone;
    });

    startClones.reverse().forEach((clone) => galleryContainer.prepend(clone));
    endClones.forEach((clone) => galleryContainer.appendChild(clone));
  };

  const handleScrollLooping = () => {
    const itemWidth = getItemWidth();
    const currentScroll = galleryContainer.scrollLeft;

    if (currentScroll >= (totalOriginalItems + visibleItems) * itemWidth) {
      galleryContainer.style.scrollBehavior = "auto";
      galleryContainer.scrollLeft =
        currentScroll - totalOriginalItems * itemWidth;
    } else if (currentScroll < visibleItems * itemWidth) {
      galleryContainer.style.scrollBehavior = "auto";
      galleryContainer.scrollLeft =
        currentScroll + totalOriginalItems * itemWidth;
    }
  };

  const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const performSlide = (direction) => {
    const itemWidth = getItemWidth();
    const targetScroll =
      galleryContainer.scrollLeft +
      (direction === "next" ? itemWidth : -itemWidth);

    galleryContainer.style.scrollBehavior = "smooth";
    galleryContainer.scrollLeft = targetScroll;
  };

  const handleButtonClick = (direction) => {
    if (isScrolling) return;
    isScrolling = true;

    performSlide(direction);

    setTimeout(() => {
      isScrolling = false;
    }, 300);
  };

  const startAutoSlide = () => {
    stopAutoSlide(); // Clear any existing interval first
    autoSlideInterval = setInterval(() => {
      performSlide("next");
    }, autoSlideIntervalDuration);
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideInterval);
  };

  const initializeGallery = () => {
    cloneItems();
    const itemWidth = getItemWidth();
    galleryContainer.style.scrollBehavior = "auto";
    galleryContainer.scrollLeft = itemWidth * visibleItems;
    setTimeout(() => {
      galleryContainer.style.scrollBehavior = "smooth";
    }, 100);
  };

  // Event listeners
  nextBtn.addEventListener("click", () => {
    stopAutoSlide();
    handleButtonClick("next");
    startAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    stopAutoSlide();
    handleButtonClick("prev");
    startAutoSlide();
  });

  galleryWrapper.addEventListener("mouseenter", stopAutoSlide);
  galleryWrapper.addEventListener("mouseleave", startAutoSlide);

  galleryContainer.addEventListener(
    "scroll",
    debounce(handleScrollLooping, 50)
  );

  window.addEventListener("resize", () => {
    isScrolling = true;
    initializeGallery();
    isScrolling = false;
  });

  initializeGallery();
  startAutoSlide();
});
