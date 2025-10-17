// Main initialization - coordinates all modules
document.addEventListener('DOMContentLoaded', function() {
  // Initialize visual effects from visual-effects.js
  if (typeof applySpineBlending === 'function') {
    applySpineBlending();
    window.addEventListener('resize', () => {
      setTimeout(applySpineBlending, 100);
    });
  }
  if (typeof initFadeInAnimations === 'function') initFadeInAnimations();
  if (typeof initializeBlobs === 'function') initializeBlobs();
  if (typeof initBallSeam === 'function') initBallSeam();

  // Initialize grid background from grid-background.js
  if (typeof initGridToggle === 'function') initGridToggle();
  if (typeof initGenerativeGrid === 'function') initGenerativeGrid();

  // Initialize lightbox from lightbox.js
  if (typeof initLightbox === 'function') initLightbox();

  // Initialize navigation
  initMainNavigation();
  initSmoothScroll();
});

function initMainNavigation() {
  const journalBtn = document.getElementById('nav-journal');
  const albumBtn = document.getElementById('nav-album');
  const gridBtn = document.getElementById('nav-grid');
  const canvas = document.getElementById('generative-grid-bg');

  // Journal - fade transition to journal wrapper using overlay
  journalBtn.addEventListener('click', () => {
    const overlay = document.getElementById('pageTransition');
    const journalWrapper = document.querySelector('.journal-wrapper');

    if (overlay && journalWrapper) {
      // Step 1: Fade overlay in
      overlay.classList.add('active');

      // Step 2: Scroll while overlay is visible
      setTimeout(() => {
        window.scrollTo({ top: journalWrapper.offsetTop, behavior: 'auto' });

        // Step 3: Fade overlay out
        requestAnimationFrame(() => {
          overlay.classList.remove('active');
        });
      }, 600);
    }
  });

  // Album - scroll to journal then open first journal image in lightbox
  albumBtn.addEventListener('click', () => {
    const overlay = document.getElementById('pageTransition');
    const journalWrapper = document.querySelector('.journal-wrapper');

    if (overlay && journalWrapper) {
      // Fade overlay in
      overlay.classList.add('active');

      // Scroll to journal while overlay is visible
      setTimeout(() => {
        window.scrollTo({ top: journalWrapper.offsetTop, behavior: 'auto' });

        // Find first image inside journal and click it
        const firstJournalImage = journalWrapper.querySelector('.book-image');
        if (firstJournalImage) {
          firstJournalImage.click();
        }

        // Fade overlay out (lightbox will be on top)
        requestAnimationFrame(() => {
          overlay.classList.remove('active');
        });
      }, 600);
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

// Smooth scroll with fade transition using full-page overlay
function initSmoothScroll() {
  const overlay = document.getElementById('pageTransition');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        // Step 1: Fade overlay in (covers everything)
        overlay.classList.add('active');

        // Step 2: Scroll while overlay is visible (600ms fade duration)
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });

          // Step 3: Fade overlay out immediately after scroll
          requestAnimationFrame(() => {
            overlay.classList.remove('active');
          });
        }, 600);
      }
    });
  });
}
