// Main initialization - coordinates all modules
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality from blob-effects.js
  if (typeof applySpineBlending === 'function') {
    applySpineBlending();
    window.addEventListener('resize', () => {
      setTimeout(applySpineBlending, 100);
    });
  }
  if (typeof initSmoothScroll === 'function') initSmoothScroll();
  if (typeof initLightbox === 'function') initLightbox();
  if (typeof initFadeInAnimations === 'function') initFadeInAnimations();
  if (typeof initializeBlobs === 'function') initializeBlobs();
  if (typeof initBallSeam === 'function') initBallSeam();

  // Initialize grid background from grid-background.js
  if (typeof initGridToggle === 'function') initGridToggle();
  if (typeof initGenerativeGrid === 'function') initGenerativeGrid();
});
