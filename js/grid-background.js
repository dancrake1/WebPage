// Generative Grid Background System
class GenerativeGrid {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;

    // Session seed for deterministic randomization
    this.seed = this.generateSessionSeed();
    this.seedState = this.seed;

    // Configuration
    this.cellSize = 32; // Target cell size for desktop
    this.gridColor = '#2a2a2a'; // Softer dark grey grid lines
    this.gridAlpha = 0.25; // Softer, more subtle grid

    // Six-color palette (deterministic from seed)
    this.palette = this.generatePalette();

    // Grid state
    this.grid = [];
    this.fillQueue = [];
    this.fillIndex = 0;
    this.isAnimating = false;

    // Hero safe area
    this.heroSafeArea = {
      x: 0, y: 0, width: 0, height: 0
    };

    // Performance
    this.lastFrameTime = 0;
    this.targetFPS = 35;
    this.frameInterval = 1000 / this.targetFPS;
    this.fillAcceleration = 1; // Interaction acceleration multiplier

    // Reduced motion check
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  generateSessionSeed() {
    return Math.floor(Date.now() * Math.random() * 1000) % 999999;
  }

  // Seeded pseudo-random number generator
  random() {
    this.seedState = (this.seedState * 9301 + 49297) % 233280;
    return this.seedState / 233280;
  }

  generatePalette() {
    // Palette matching the reference image dots + journal red + olive green
    const palette = [
      '#e85d5d', // Coral/salmon red (from reference dots)
      '#a8d65a', // Bright lime green (from reference)
      '#ffd65a', // Bright yellow (from reference)
      '#ff9a5a', // Orange (from reference)
      '#f7b5c4', // Soft pink (from reference)
      '#d4756a', // Journal red (softened)
      '#8ea67c'  // Olive green (as requested)
    ];

    return palette;
  }

  init() {
    this.setupCanvas();
    this.calculateHeroSafeArea();
    this.generateGrid();
    this.generateHierarchicalBlocks();
    this.drawInitialGrid();

    if (this.prefersReducedMotion) {
      // Render final state immediately with lower coverage
      this.renderFinalState(0.6);
    } else {
      // Start progressive animation after brief delay
      setTimeout(() => {
        this.startProgressiveFill();
      }, 400);
    }

    // Setup resize handling with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 200);
    });

    // Optional interaction nudges
    this.setupInteractionNudges();
  }

  setupInteractionNudges() {
    // Accelerate on scroll (subtle)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (!this.isAnimating) return;

      this.fillAcceleration = 1.5;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.fillAcceleration = 1;
      }, 500);
    });

    // Accelerate on index link hover
    const indexLinks = document.querySelectorAll('.index-list a');
    indexLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        if (!this.isAnimating) return;
        this.fillAcceleration = 1.3;
      });

      link.addEventListener('mouseleave', () => {
        this.fillAcceleration = 1;
      });
    });
  }

  setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = window.innerWidth * this.dpr;
    this.canvas.height = window.innerHeight * this.dpr;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.scale(this.dpr, this.dpr);

    // Fill with outer background color
    this.ctx.fillStyle = '#ede6d6';
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

  calculateHeroSafeArea() {
    // Hero image position: top:22%; right:6%; width:500px; height:600px;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    this.heroSafeArea = {
      x: vw - (vw * 0.06) - 500,
      y: vh * 0.22,
      width: 500,
      height: 600
    };
  }

  generateGrid() {
    this.grid = [];
    const cols = Math.ceil(window.innerWidth / this.cellSize);
    const rows = Math.ceil(window.innerHeight / this.cellSize);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * this.cellSize;
        const y = row * this.cellSize;
        const width = (col === cols - 1) ? window.innerWidth - x : this.cellSize;
        const height = (row === rows - 1) ? window.innerHeight - y : this.cellSize;

        this.grid.push({
          x: x,
          y: y,
          width: width,
          height: height,
          filled: false,
          color: null
        });
      }
    }
  }

  generateHierarchicalBlocks() {
    // Instead of large blocks, use individual grid cells
    this.fillQueue = this.createGridCellFillSequence();
  }

  isInHeroSafeArea(x, y) {
    return x >= this.heroSafeArea.x &&
           x <= this.heroSafeArea.x + this.heroSafeArea.width &&
           y >= this.heroSafeArea.y &&
           y <= this.heroSafeArea.y + this.heroSafeArea.height;
  }

  createGridCellFillSequence() {
    // Create structured geometric blocks instead of random fills
    const cols = Math.ceil(window.innerWidth / this.cellSize);
    const rows = Math.ceil(window.innerHeight / this.cellSize);

    // Create geometric structures
    const structures = this.generateGeometricStructures(cols, rows);

    // Convert structures to individual cells for filling
    const cellsToFill = [];
    structures.forEach(structure => {
      structure.cells.forEach(cellPos => {
        const cell = this.grid.find(c =>
          Math.floor(c.x / this.cellSize) === cellPos.col &&
          Math.floor(c.y / this.cellSize) === cellPos.row
        );
        if (cell) {
          cell.color = structure.color;
          cell.row = cellPos.row;
          cell.col = cellPos.col;
          cell.structureId = structure.id;
          cellsToFill.push(cell);
        }
      });
    });

    // Allow all cells - no exclusions, blocks can appear behind image
    const validCells = cellsToFill;

    // Sort for left-to-right filling
    return validCells.sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.col - b.col;
    });
  }

  generateGeometricStructures(cols, rows) {
    const structures = [];
    let structureId = 0;

    // Create a coverage map to track filled areas
    const covered = Array(rows).fill().map(() => Array(cols).fill(false));

    // Generate different types of geometric structures
    for (let attempts = 0; attempts < 150; attempts++) {
      const structureType = this.random();

      if (structureType < 0.15) {
        // Full-width horizontal bars (15% chance - reduced)
        this.createHorizontalBar(structures, covered, cols, rows, structureId++);
      } else if (structureType < 0.5) {
        // Square blocks (35% chance - increased)
        this.createSquareBlock(structures, covered, cols, rows, structureId++);
      } else if (structureType < 0.85) {
        // Rectangular blocks (35% chance - increased)
        this.createRectangularBlock(structures, covered, cols, rows, structureId++);
      } else if (structureType < 0.95) {
        // Vertical bars (10% chance - reduced)
        this.createVerticalBar(structures, covered, cols, rows, structureId++);
      } else {
        // L-shapes and irregular blocks (5% chance - reduced)
        this.createLShape(structures, covered, cols, rows, structureId++);
      }
    }

    return structures;
  }

  createHorizontalBar(structures, covered, cols, rows, id) {
    const startRow = Math.floor(this.random() * rows);
    const height = Math.min(1 + Math.floor(this.random() * 3), rows - startRow); // 1-3 rows tall

    // Check if space is available
    let canPlace = true;
    for (let r = startRow; r < startRow + height; r++) {
      for (let c = 0; c < cols; c++) {
        if (covered[r] && covered[r][c]) {
          canPlace = false;
          break;
        }
      }
      if (!canPlace) break;
    }

    if (canPlace) {
      const cells = [];
      const color = this.palette[Math.floor(this.random() * this.palette.length)];

      for (let r = startRow; r < startRow + height; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push({ row: r, col: c });
          covered[r][c] = true;
        }
      }

      structures.push({ id, color, cells, type: 'horizontal' });
    }
  }

  createSquareBlock(structures, covered, cols, rows, id) {
    const size = 2 + Math.floor(this.random() * 8); // 2-9 cells square
    const startRow = Math.floor(this.random() * (rows - size));
    const startCol = Math.floor(this.random() * (cols - size));

    // Check if space is available
    let canPlace = true;
    for (let r = startRow; r < startRow + size; r++) {
      for (let c = startCol; c < startCol + size; c++) {
        if (covered[r][c]) {
          canPlace = false;
          break;
        }
      }
      if (!canPlace) break;
    }

    if (canPlace) {
      const cells = [];
      const color = this.palette[Math.floor(this.random() * this.palette.length)];

      for (let r = startRow; r < startRow + size; r++) {
        for (let c = startCol; c < startCol + size; c++) {
          cells.push({ row: r, col: c });
          covered[r][c] = true;
        }
      }

      structures.push({ id, color, cells, type: 'square' });
    }
  }

  createRectangularBlock(structures, covered, cols, rows, id) {
    const width = 3 + Math.floor(this.random() * 10); // 3-12 cells wide
    const height = 2 + Math.floor(this.random() * 6); // 2-7 cells tall
    const startRow = Math.floor(this.random() * (rows - height));
    const startCol = Math.floor(this.random() * (cols - width));

    // Check if space is available
    let canPlace = true;
    for (let r = startRow; r < startRow + height; r++) {
      for (let c = startCol; c < startCol + width; c++) {
        if (covered[r][c]) {
          canPlace = false;
          break;
        }
      }
      if (!canPlace) break;
    }

    if (canPlace) {
      const cells = [];
      const color = this.palette[Math.floor(this.random() * this.palette.length)];

      for (let r = startRow; r < startRow + height; r++) {
        for (let c = startCol; c < startCol + width; c++) {
          cells.push({ row: r, col: c });
          covered[r][c] = true;
        }
      }

      structures.push({ id, color, cells, type: 'rectangle' });
    }
  }

  createVerticalBar(structures, covered, cols, rows, id) {
    const startCol = Math.floor(this.random() * cols);
    const width = Math.min(1 + Math.floor(this.random() * 2), cols - startCol); // 1-2 cols wide
    const startRow = Math.floor(this.random() * (rows * 0.3)); // Start in top 30%
    const height = Math.floor(rows * 0.4) + Math.floor(this.random() * (rows * 0.3)); // 40-70% of screen height

    // Check if space is available
    let canPlace = true;
    for (let r = startRow; r < Math.min(startRow + height, rows); r++) {
      for (let c = startCol; c < startCol + width; c++) {
        if (covered[r][c]) {
          canPlace = false;
          break;
        }
      }
      if (!canPlace) break;
    }

    if (canPlace) {
      const cells = [];
      const color = this.palette[Math.floor(this.random() * this.palette.length)];

      for (let r = startRow; r < Math.min(startRow + height, rows); r++) {
        for (let c = startCol; c < startCol + width; c++) {
          cells.push({ row: r, col: c });
          covered[r][c] = true;
        }
      }

      structures.push({ id, color, cells, type: 'vertical' });
    }
  }

  createLShape(structures, covered, cols, rows, id) {
    const size = 4 + Math.floor(this.random() * 4); // 4-8 cells for the L
    const startRow = Math.floor(this.random() * (rows - size));
    const startCol = Math.floor(this.random() * (cols - size));

    // Create L-shape: vertical part + horizontal part
    const cells = [];
    const color = this.palette[Math.floor(this.random() * this.palette.length)];
    let canPlace = true;

    // Vertical part of L
    for (let r = startRow; r < startRow + size; r++) {
      if (covered[r][startCol]) {
        canPlace = false;
        break;
      }
    }

    // Horizontal part of L (bottom row)
    if (canPlace) {
      for (let c = startCol; c < Math.min(startCol + size, cols); c++) {
        if (covered[startRow + size - 1][c]) {
          canPlace = false;
          break;
        }
      }
    }

    if (canPlace) {
      // Add vertical part
      for (let r = startRow; r < startRow + size; r++) {
        cells.push({ row: r, col: startCol });
        covered[r][startCol] = true;
      }

      // Add horizontal part
      for (let c = startCol + 1; c < Math.min(startCol + size, cols); c++) {
        cells.push({ row: startRow + size - 1, col: c });
        covered[startRow + size - 1][c] = true;
      }

      structures.push({ id, color, cells, type: 'L-shape' });
    }
  }

  calculateCellPriority(centerX, centerY) {
    // Lower priority for cells in hero safe area
    if (this.isInHeroSafeArea(centerX, centerY)) {
      return -1; // Skip these cells
    }

    // Create organic fill pattern - distance from edges with some randomness
    const distFromEdges = Math.min(
      centerX,
      window.innerWidth - centerX,
      centerY,
      window.innerHeight - centerY
    );

    // Add some randomness but keep it deterministic
    const randomOffset = (this.random() - 0.5) * 100;

    return distFromEdges + randomOffset;
  }

  drawInitialGrid() {
    this.ctx.strokeStyle = this.gridColor;
    this.ctx.globalAlpha = this.gridAlpha;
    this.ctx.lineWidth = 0.5;

    // Draw full grid everywhere
    // Draw vertical lines
    for (let x = this.cellSize; x < window.innerWidth; x += this.cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, window.innerHeight);
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = this.cellSize; y < window.innerHeight; y += this.cellSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(window.innerWidth, y);
      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;
  }

  startProgressiveFill() {
    this.isAnimating = true;
    this.animationLoop();
  }

  animationLoop(currentTime = 0) {
    if (!this.isAnimating) return;

    // Check if index section is in view
    const indexSection = document.querySelector('.index-section');
    const rect = indexSection.getBoundingClientRect();
    const isIndexVisible = rect.bottom > 0 && rect.top < window.innerHeight;

    if (!isIndexVisible && this.fillIndex > this.fillQueue.length * 0.5) {
      // Pause animation when scrolled away from index (after initial fill)
      requestAnimationFrame((time) => this.animationLoop(time));
      return;
    }

    const deltaTime = currentTime - this.lastFrameTime;

    if (deltaTime >= this.frameInterval) {
      this.updateFills();
      this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);
    }

    requestAnimationFrame((time) => this.animationLoop(time));
  }

  updateFills() {
    // Fast, consistent fill rate for quick left-to-right sweep
    const progress = this.fillIndex / this.fillQueue.length;
    let fillsPerFrame;

    // Ultra fast fill rate - complete in under 1 second
    fillsPerFrame = Math.ceil(100 / this.targetFPS * this.fillAcceleration);

    // Fill cells methodically - no bursts or pauses
    for (let i = 0; i < fillsPerFrame && this.fillIndex < this.fillQueue.length; i++) {
      this.fillBlock(this.fillQueue[this.fillIndex]);
      this.fillIndex++;
    }

    // Stop animation when complete
    if (this.fillIndex >= this.fillQueue.length) {
      this.isAnimating = false;
    }
  }

  fillBlock(cell) {
    this.ctx.fillStyle = cell.color;

    // Full opacity for all blocks
    this.ctx.globalAlpha = 1;

    // Fill the cell completely - no borders, grid lines will remain on top
    this.ctx.fillRect(cell.x, cell.y, cell.width, cell.height);
    this.ctx.globalAlpha = 1;

    // Redraw grid lines on top of this cell to keep them visible
    this.redrawGridLinesForCell(cell);

    // Mark cell as filled
    cell.filled = true;
  }

  redrawGridLinesForCell(cell) {
    this.ctx.strokeStyle = this.gridColor;
    this.ctx.globalAlpha = this.gridAlpha;
    this.ctx.lineWidth = 0.5;

    // Draw the right edge of this cell
    if (cell.x + cell.width < window.innerWidth) {
      this.ctx.beginPath();
      this.ctx.moveTo(cell.x + cell.width, cell.y);
      this.ctx.lineTo(cell.x + cell.width, cell.y + cell.height);
      this.ctx.stroke();
    }

    // Draw the bottom edge of this cell
    if (cell.y + cell.height < window.innerHeight) {
      this.ctx.beginPath();
      this.ctx.moveTo(cell.x, cell.y + cell.height);
      this.ctx.lineTo(cell.x + cell.width, cell.y + cell.height);
      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;
  }

  renderFinalState(coverage = 0.6) {
    const blocksToFill = Math.floor(this.fillQueue.length * coverage);

    for (let i = 0; i < blocksToFill; i++) {
      this.fillBlock(this.fillQueue[i]);
    }
  }

  handleResize() {
    // Only recompose on significant resize, not new seed
    this.setupCanvas();
    this.calculateHeroSafeArea();
    this.generateGrid();
    this.generateHierarchicalBlocks();
    this.drawInitialGrid();

    // Resume from current progress
    const currentProgress = this.fillIndex / this.fillQueue.length;
    const newFillIndex = Math.floor(this.fillQueue.length * currentProgress);

    for (let i = 0; i < newFillIndex; i++) {
      this.fillBlock(this.fillQueue[i]);
    }

    this.fillIndex = newFillIndex;
  }
}

// Grid toggle functionality
let generativeGridInstance = null;
let gridEnabled = true;

function initGridToggle() {
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  const canvas = document.getElementById('generative-grid-bg');

  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      toggleButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      const toggleState = button.getAttribute('data-toggle');

      if (toggleState === 'Y') {
        // Enable grid
        gridEnabled = true;
        canvas.style.display = 'block';
        if (!generativeGridInstance) {
          generativeGridInstance = new GenerativeGrid(canvas);
        }
      } else {
        // Disable grid
        gridEnabled = false;
        canvas.style.display = 'none';
        if (generativeGridInstance) {
          generativeGridInstance.isAnimating = false;
          generativeGridInstance = null;
        }
      }
    });
  });
}

// Initialize the generative grid
function initGenerativeGrid() {
  const canvas = document.getElementById('generative-grid-bg');
  if (canvas && gridEnabled) {
    generativeGridInstance = new GenerativeGrid(canvas);
  }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GenerativeGrid, initGridToggle, initGenerativeGrid };
}