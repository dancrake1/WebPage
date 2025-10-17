// FIXED: Automatic spine blending - Ultra-tight detection
function applySpineBlending() {
  document.querySelectorAll('.book-spread').forEach(spread => {
    spread.querySelectorAll('.book-image').forEach(image => {
      // Handle both left and right positioning
      let leftPercent, rightPercent;
      const widthStyle = image.style.width || '20%';
      const widthPercent = parseFloat(widthStyle.replace('%', ''));

      if (image.style.left) {
        // Left positioned
        leftPercent = parseFloat(image.style.left.replace('%', ''));
        rightPercent = leftPercent + widthPercent;
      } else if (image.style.right) {
        // Right positioned - convert to left positioning
        const rightPos = parseFloat(image.style.right.replace('%', ''));
        rightPercent = 100 - rightPos;
        leftPercent = rightPercent - widthPercent;
      } else {
        // No positioning, skip
        return;
      }

      const spineZoneLeft = 48;
      const spineZoneRight = 52;

      image.classList.remove('spine-adjacent', 'spine-spanning');
      image.style.transform = '';
      image.style.transformOrigin = '';
      image.querySelectorAll('.spine-shadow').forEach(shadow => shadow.remove());

      if (rightPercent > spineZoneLeft && leftPercent < spineZoneRight) {
        image.classList.add('spine-adjacent');

        if (leftPercent < 50 && rightPercent > 50) {
          image.classList.add('spine-spanning');
          image.style.transform = 'perspective(2000px) rotateX(0.5deg)';

          const centerShadow = document.createElement('div');
          centerShadow.className = 'spine-shadow spine-shadow-center';
          centerShadow.style.cssText = `
            position: absolute;
            left: 45%;
            right: 45%;
            top: 0;
            bottom: 0;
            background: linear-gradient(to right,
              transparent 0%,
              rgba(0,0,0,0.3) 30%,
              rgba(0,0,0,0.5) 50%,
              rgba(0,0,0,0.3) 70%,
              transparent 100%);
            pointer-events: none;
            z-index: 5;
          `;
          image.appendChild(centerShadow);
        } else {
          const imageCenter = leftPercent + (widthPercent / 2);
          if (imageCenter < 50) {
            image.style.transformOrigin = 'right center';
            image.style.transform = 'perspective(2000px) rotateY(1.5deg)';

            const shadow = document.createElement('div');
            shadow.className = 'spine-shadow spine-shadow-right';
            shadow.style.cssText = `
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
              width: 20px;
              background: linear-gradient(to left,
                rgba(0,0,0,0.4) 0%,
                rgba(0,0,0,0.2) 50%,
                transparent 100%);
              pointer-events: none;
              z-index: 5;
            `;
            image.appendChild(shadow);
          } else {
            image.style.transformOrigin = 'left center';
            image.style.transform = 'perspective(2000px) rotateY(-1.5deg)';

            const shadow = document.createElement('div');
            shadow.className = 'spine-shadow spine-shadow-left';
            shadow.style.cssText = `
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 20px;
              background: linear-gradient(to right,
                rgba(0,0,0,0.4) 0%,
                rgba(0,0,0,0.2) 50%,
                transparent 100%);
              pointer-events: none;
              z-index: 5;
            `;
            image.appendChild(shadow);
          }
        }
      }
    });
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

// Lightbox functionality has been moved to js/lightbox.js

// Fade-in animations
function initFadeInAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const baseOpacity = target.dataset.baseOpacity || '';
      target.style.opacity = baseOpacity;
      observer.unobserve(target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.book-element').forEach(element => {
    const computedOpacity = window.getComputedStyle(element).opacity;
    element.dataset.baseOpacity = computedOpacity;
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.8s ease-out';
    observer.observe(element);
  });
}

// Blob generation system
function generateBlobPath(size = 1, seed = 1) {
  const random = (seed) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Natural blob parameters with variation
  const baseSize = 200 * size;
  const points = 8;
  const roughness = 0.3;
  const cx = 500, cy = 500;

  let path = 'M';
  const angles = [];

  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const radiusVariation = 1 + (random(seed + i * 7) - 0.5) * roughness;
    const angleOffset = (random(seed + i * 11) - 0.5) * 0.3;

    const radius = baseSize * radiusVariation;
    const actualAngle = angle + angleOffset;

    const x = cx + Math.cos(actualAngle) * radius;
    const y = cy + Math.sin(actualAngle) * radius;

    angles.push({ x, y, angle: actualAngle });
  }

  // Create smooth curves between points
  for (let i = 0; i < points; i++) {
    const curr = angles[i];
    const next = angles[(i + 1) % points];
    const prev = angles[i === 0 ? points - 1 : i - 1];

    if (i === 0) path += `${curr.x} ${curr.y}`;

    // Control points for smooth curves
    const cp1x = curr.x + Math.cos(curr.angle + Math.PI/2) * baseSize * 0.2;
    const cp1y = curr.y + Math.sin(curr.angle + Math.PI/2) * baseSize * 0.2;
    const cp2x = next.x - Math.cos(next.angle + Math.PI/2) * baseSize * 0.2;
    const cp2y = next.y - Math.sin(next.angle + Math.PI/2) * baseSize * 0.2;

    path += ` C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }
  path += 'z';

  return path;
}

function generateSquarePath(size = 1, imageElement = null) {
  // Get image element dimensions to match rectangle to image aspect ratio
  let width = 400, height = 400; // default square

  if (imageElement) {
    const imgRect = imageElement.getBoundingClientRect();
    const aspectRatio = imgRect.width / imgRect.height;

    if (aspectRatio > 1) {
      // Landscape: keep width, adjust height
      width = 400 * size;
      height = (400 / aspectRatio) * size;
    } else {
      // Portrait: keep height, adjust width
      height = 400 * size;
      width = (400 * aspectRatio) * size;
    }
  } else {
    // Square when no image reference
    width = height = 400 * size;
  }

  const cx = 500, cy = 500;
  const left = cx - width/2;
  const right = cx + width/2;
  const top = cy - height/2;
  const bottom = cy + height/2;

  // Perfect rectangle - no rounded corners or irregularities
  return `M${left} ${top}
          L${right} ${top}
          L${right} ${bottom}
          L${left} ${bottom}
          z`;
}

function addBlobToImage(imageElement, options = {}) {
  const {
    size = 1,
    seed = Math.random() * 1000,
    rotation = Math.random() * 360,
    position = { x: Math.random() * 400 + 300, y: Math.random() * 400 + 300 },
    bleed = false,
    shape = 'blob'
  } = options;

  if (!imageElement.classList.contains('has-spot')) {
    imageElement.classList.add('has-spot');
  }

  if (bleed) {
    imageElement.classList.add('has-spot-bleed');
  }

  const shapePath = shape === 'square' ? generateSquarePath(size, imageElement) : generateBlobPath(size, seed);
  const uniqueId = `blob-${Math.floor(Math.random() * 10000)}`;

  const spotDiv = document.createElement('div');
  spotDiv.className = bleed ? 'image-spot image-spot--bleed' : 'image-spot image-spot--contained';
  spotDiv.innerHTML = `
    <svg viewBox="0 0 1000 1000" aria-hidden="true">
      <defs>
        <filter id="grain-${uniqueId}" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" seed="${seed}"/>
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.45"/>
          </feComponentTransfer>
        </filter>
        <filter id="grainCoarse-${uniqueId}" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves="2" seed="${seed + 100}"/>
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.28"/>
          </feComponentTransfer>
        </filter>
        <filter id="roughen-${uniqueId}" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="${seed + 200}" result="turb"/>
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="9" xChannelSelector="R" yChannelSelector="G"/>
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
        <radialGradient id="roundFade-${uniqueId}" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="var(--blob-color)" stop-opacity="0.45"/>
          <stop offset="70%" stop-color="var(--blob-color)" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="var(--blob-color)" stop-opacity="0.00"/>
        </radialGradient>
        <path id="shapePath-${uniqueId}" d="${shapePath}"/>
        <clipPath id="shapeClip-${uniqueId}">
          <use href="#shapePath-${uniqueId}" />
        </clipPath>
      </defs>
      <g transform="translate(${position.x - 500}, ${position.y - 500}) rotate(${rotation} 500 500)">
        <use href="#shapePath-${uniqueId}" class="hue-layer" fill="var(--blob-color)" filter="url(#roughen-${uniqueId})" style="opacity: var(--blob-hue-opacity)" />
        <use href="#shapePath-${uniqueId}" class="density-layer" fill="url(#roundFade-${uniqueId})" filter="url(#roughen-${uniqueId})" style="opacity: var(--blob-density-opacity)" />
        <use href="#shapePath-${uniqueId}" class="burn-layer" fill="var(--blob-color)" filter="url(#roughen-${uniqueId})" style="opacity: var(--blob-burn-opacity)" />
        <g clip-path="url(#shapeClip-${uniqueId})">
          <use href="#shapePath-${uniqueId}" class="grain" fill="#000" filter="url(#grain-${uniqueId})" style="opacity: var(--blob-grain-opacity)" />
          <use href="#shapePath-${uniqueId}" class="grain2" fill="#000" filter="url(#grainCoarse-${uniqueId})" style="opacity: var(--blob-grain2-opacity)" />
        </g>
      </g>
    </svg>
  `;

  imageElement.appendChild(spotDiv);
  return spotDiv;
}

// Auto-initialize blobs from HTML attributes
function initializeBlobs() {
  document.querySelectorAll('.book-image[data-blob]').forEach(image => {
    const blobData = image.getAttribute('data-blob');
    if (blobData === 'true' || blobData === '') {
      // Simple blob with defaults
      addBlobToImage(image);
    } else {
      // Parse blob parameters
      const params = {};
      blobData.split(',').forEach(param => {
        const [key, value] = param.split(':').map(s => s.trim());
        if (key && value) {
          if (key === 'size') params.size = parseFloat(value);
          else if (key === 'seed') params.seed = parseInt(value);
          else if (key === 'rotation') params.rotation = parseFloat(value);
          else if (key === 'bleed') params.bleed = value === 'y' || value === 'yes' || value === 'true';
          else if (key === 'shape') params.shape = value;
          else if (key === 'x' || key === 'y') {
            if (!params.position) params.position = {};
            params.position[key] = parseFloat(value);
          }
        }
      });
      addBlobToImage(image, params);
    }
  });
}

function initBallSeam(){
  document.querySelectorAll('.ball-copy').forEach(el=>{
    const d = getComputedStyle(el).getPropertyValue('--diameter');
    const seamWidth = getComputedStyle(el).getPropertyValue('--seam-width');
    const softness = getComputedStyle(el).getPropertyValue('--seam-soften');
    const openness = parseFloat(getComputedStyle(el).getPropertyValue('--seam-curve')) || 0.65;

    // Build an SVG mask as a data-URL:
    // White = keep, black = cut out (our seam) - but inverted
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
    <defs>
        <filter id="blur"><feGaussianBlur stdDeviation="${softness || 10}"/></filter>
        <mask id="m">
        <rect width="100%" height="100%" fill="black"/>
        <!-- Single curved seam (cubic) -->
        <g filter="url(#blur)">
            <path d="
            M 0 ${300 + 200*(1-openness)}
            C ${250} ${250*openness}, ${750} ${750*(2-openness)-400}, 1000 ${700 - 200*(1-openness)}
            " stroke="white" stroke-width="40" stroke-linecap="round" fill="none"/>
        </g>
        </mask>
    </defs>
    <!-- Render white where we want to show text -->
    <rect width="100%" height="100%" fill="white" mask="url(#m)"/>
    </svg>`.trim();

    const dataUrl = `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`;
    el.style.setProperty('--seam-mask', dataUrl);
  });
}

// Export functions for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    applySpineBlending,
    initSmoothScroll,
    initFadeInAnimations,
    initializeBlobs,
    initBallSeam
  };
}
