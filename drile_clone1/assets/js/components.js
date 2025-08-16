// This function fetches and injects a component's HTML
async function loadComponent(componentPath, targetElementId) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const targetElement = document.getElementById(targetElementId);
    if (targetElement) {
      targetElement.innerHTML = html;
    } else {
      console.error(`Target element with ID "${targetElementId}" not found.`);
    }
  } catch (e) {
    console.error(`Failed to load component from "${componentPath}":`, e);
  }
}

// Call this function for each component you want to load
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("pages/shop_slider.html", "shop-slider-container");
  // You can add more components here as you create them:
  // loadComponent('pages/another_component.html', 'another-container');
  // loadComponent('pages/footer.html', 'footer-container');
});
