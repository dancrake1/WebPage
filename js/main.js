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

  // Initialize main navigation
  initMainNavigation();
});

function initMainNavigation() {
  const journalBtn = document.getElementById('nav-journal');
  const albumBtn = document.getElementById('nav-album');
  const gridBtn = document.getElementById('nav-grid');
  const canvas = document.getElementById('generative-grid-bg');

  // Journal - fade transition to journal wrapper
  journalBtn.addEventListener('click', () => {
    const indexSection = document.querySelector('.index-section');
    const journalWrapper = document.querySelector('.journal-wrapper');
    const firstSpread = document.getElementById('spread-1');

    if (indexSection && journalWrapper && firstSpread) {
      // Fade out current
      indexSection.classList.add('fade-out');

      // Add fade-out to target before scrolling
      firstSpread.classList.add('fade-out');

      setTimeout(() => {
        window.scrollTo({ top: journalWrapper.offsetTop, behavior: 'auto' });
        indexSection.classList.remove('fade-out');

        // Fade in new section after scroll
        requestAnimationFrame(() => {
          firstSpread.classList.remove('fade-out');
        });
      }, 800);
    }
  });

  // Album - open first image in lightbox
  albumBtn.addEventListener('click', () => {
    const firstImage = document.querySelector('.book-image');
    if (firstImage) {
      firstImage.click();
    }
  });

  // Grid - toggle grid background with animation
  let gridActive = false;
  gridBtn.addEventListener('click', () => {
    gridActive = !gridActive;

    if (gridActive) {
      // Restart square animation by removing and re-adding class
      gridBtn.classList.remove('active');
      void gridBtn.offsetWidth; // Force reflow
      gridBtn.classList.add('active');

      // Show and start full grid background animation
      canvas.style.display = 'block';
      if (typeof GenerativeGrid !== 'undefined') {
        if (!window.generativeGridInstance) {
          window.generativeGridInstance = new GenerativeGrid(canvas);
        } else {
          // Restart animation if instance exists
          window.generativeGridInstance.isAnimating = true;
          window.generativeGridInstance.fillIndex = 0;
        }
      }
    } else {
      gridBtn.classList.remove('active');
      canvas.style.display = 'none';
      // Stop grid animation
      if (window.generativeGridInstance) {
        window.generativeGridInstance.isAnimating = false;
        window.generativeGridInstance = null;
      }
    }
  });
}
