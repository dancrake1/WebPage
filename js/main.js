document.addEventListener('DOMContentLoaded', () => {
  if (typeof applySpineBlending === 'function') {
    applySpineBlending();
    window.addEventListener('resize', applySpineBlending);
    setTimeout(applySpineBlending, 100);
  }
  if (typeof initSmoothScroll === 'function') initSmoothScroll();
  if (typeof initLightbox === 'function') initLightbox();
  if (typeof initFadeInAnimations === 'function') initFadeInAnimations();
  if (typeof initializeBlobs === 'function') initializeBlobs();
  if (typeof initBallSeam === 'function') initBallSeam();
  if (typeof initGridToggle === 'function') initGridToggle();
  if (typeof initGenerativeGrid === 'function') initGenerativeGrid();
});
