// Simplest lightbox: All images always rendered, current one scales up

let allImages = [];
let currentIndex = 0;
let isTransitioning = false;

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = lightbox.querySelector('.lightbox-content');

  allImages = Array.from(document.querySelectorAll('.book-image'));

  // Create structure
  lightboxContent.innerHTML = `
    <div class="gallery-container"></div>
    <div class="carousel-nav carousel-nav-prev"></div>
    <div class="carousel-nav carousel-nav-next"></div>
  `;

  const container = lightbox.querySelector('.gallery-container');
  const prevBtn = lightbox.querySelector('.carousel-nav-prev');
  const nextBtn = lightbox.querySelector('.carousel-nav-next');

  let thumbnails = [];

  // Open lightbox when clicking on any image
  allImages.forEach((image, index) => {
    image.addEventListener('click', function(e) {
      e.stopPropagation();
      currentIndex = index;
      openLightbox();
    });
  });

  // Navigation handlers
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      navigate(currentIndex - 1);
    }
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentIndex < allImages.length - 1) {
      navigate(currentIndex + 1);
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentIndex > 0) navigate(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentIndex < allImages.length - 1) navigate(currentIndex + 1);
    } else if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  // Close on background click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close button
  const closeBtn = lightbox.querySelector('.lightbox-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  function openLightbox() {
    // Build all thumbnails on first open
    if (thumbnails.length === 0) {
      container.innerHTML = '';
      allImages.forEach((imageElement, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'gallery-thumb';
        thumb.setAttribute('data-index', index);

        const img = document.createElement('img');
        img.src = getImageSrc(imageElement);
        thumb.appendChild(img);

        container.appendChild(thumb);
        thumbnails.push(thumb);
      });
    }

    // Position and show current
    updateGallery();

    lightbox.style.display = 'flex';
    requestAnimationFrame(() => {
      lightbox.classList.add('active');
    });
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    setTimeout(() => {
      if (!lightbox.classList.contains('active')) {
        lightbox.style.display = 'none';
      }
    }, 400);
  }

  function navigate(newIndex) {
    if (isTransitioning) return;
    isTransitioning = true;

    currentIndex = newIndex;
    updateGallery();

    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  }

  function updateGallery() {
    thumbnails.forEach((thumb, index) => {
      thumb.classList.remove('current', 'past', 'future');

      if (index === currentIndex) {
        thumb.classList.add('current');
      } else if (index < currentIndex) {
        thumb.classList.add('past');
        // Most recent = position 0 (top), older = higher positions
        const positionFromCurrent = currentIndex - index - 1;
        thumb.style.setProperty('--position', positionFromCurrent);
      } else {
        thumb.classList.add('future');
        // Next = position 0 (top), further = higher positions
        const positionFromCurrent = index - currentIndex - 1;
        thumb.style.setProperty('--position', positionFromCurrent);
      }
    });

    // Update nav buttons
    prevBtn.style.opacity = currentIndex > 0 ? '1' : '0.3';
    prevBtn.style.pointerEvents = currentIndex > 0 ? 'auto' : 'none';
    nextBtn.style.opacity = currentIndex < allImages.length - 1 ? '1' : '0.3';
    nextBtn.style.pointerEvents = currentIndex < allImages.length - 1 ? 'auto' : 'none';
  }

  function getImageSrc(imageElement) {
    return imageElement.getAttribute('data-img') || imageElement.querySelector('img')?.src || '';
  }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initLightbox };
}
