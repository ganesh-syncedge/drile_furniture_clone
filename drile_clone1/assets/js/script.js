document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector("#customCarousel");

  carousel.addEventListener("slide.bs.carousel", function (event) {
    let captions = event.relatedTarget.querySelectorAll(".custom-anim > *");

    captions.forEach((el, index) => {
      el.style.opacity = "0";
      el.style.animation = `fadeUp 0.8s ease forwards ${index * 0.2}s`;
    });
  });
});
