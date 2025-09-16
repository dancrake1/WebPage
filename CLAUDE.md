# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a photography portfolio website built with a modular architecture. The main HTML file references external CSS and JavaScript files. It presents images in an interactive journal/book layout with a spine-based design that simulates the appearance of an open book, enhanced with a generative grid background system.

## File Handling Guidelines

**NEVER read or process binary image files (.jpg, .JPG, .png, etc.) - they are large assets that will consume context unnecessarily.**
- Skip ALL files in the `images/` directory and its subdirectories unless explicitly requested
- The `images/` folder contains photography assets organized by location:
  - `images/severn_sisters/` - Landscape photography from Seven Sisters
  - `images/srilanka/` - Travel photography from Sri Lanka  
  - `images/inspiration/` - Reference images
- Focus only on source code files (.html, .js, .css, .md)
- When analyzing project structure, exclude media files from consideration

## Architecture

This is a single-page application built with vanilla HTML, CSS, and JavaScript using a modular file structure:

### Main Files
- **experimental-book-journal.html**: Main HTML structure and content
- **css/styles.css**: All styling extracted from HTML
- **js/main.js**: Main initialization coordinator that handles DOMContentLoaded and coordinates other modules
- **js/blob-effects.js**: Image effects module (spine blending, lightbox, smooth scroll, blob generation)
- **js/grid-background.js**: Generative grid background system with toggle controls

### Key Features
- **Responsive journal/book layout** with simulated spine effects
- **Generative grid background** - Canvas-based progressive color blocks system with Y/N toggle
- **Image lightbox functionality** for full-screen viewing
- **Smooth scroll navigation** between portfolio sections
- **Automatic spine blending effects** for images near the center spine
- **Blob effects** - SVG-based organic shapes overlaid on images
- **Mobile-responsive design** that adapts the book layout for smaller screens

### Design Structure
- **Index Section**: Landing page with navigation menu and hero image
- **Journal Book Layout**: Multiple "spreads" (pages) displaying photography
- **Center Spine**: Visual element that simulates book binding
- **Image Positioning System**: CSS classes for precise image placement relative to the spine

## Styling Architecture

### CSS Organization
- **Reset and Base Styles**: Standard CSS reset and base typography
- **Index/Header Section**: Landing page layout and navigation
- **Journal Book Layout**: Core book spread styling with 3D effects
- **Image Positioning Classes**: Helper classes for spine-relative positioning
- **Lightbox Modal**: Full-screen image viewing functionality
- **Mobile Responsiveness**: Tablet/phone adaptations

### Key CSS Features
- **3D Book Effects**: Perspective transforms and shadows to simulate depth
- **Spine Zone Management**: Precise positioning system (48-52% width for spine area)
- **Image Hover Effects**: Subtle grayscale/contrast adjustments
- **Smooth Transitions**: CSS transitions for all interactive elements

## JavaScript Functionality (Modular)

The JavaScript is organized into separate modules:

### js/main.js - Initialization Coordinator
- Handles DOMContentLoaded events
- Coordinates initialization of all other modules
- Manages window resize events for responsive functionality

### js/blob-effects.js - Image Effects Module
- **Spine Blending System**: Automatically detects images near the center spine and applies 3D rotation effects
- **Lightbox Gallery**: Click-to-enlarge functionality for all images
- **Smooth Navigation**: Anchor-based scrolling between portfolio sections
- **Blob Generation**: SVG-based organic shapes with deterministic randomization
- **Ball Seam Effects**: Tennis ball text masking effects
- **Intersection Observer**: Fade-in animations for page elements

### js/grid-background.js - Generative Grid Background
- **Canvas-based Rendering**: High-performance grid system with device pixel ratio scaling
- **Progressive Fill Animation**: Matrix-style methodical filling of grid cells
- **Geometric Structure Generation**: Hierarchical partitioning algorithms
- **Color Palette System**: 6-color palette matching reference image
- **Toggle Controls**: Y/N buttons to enable/disable grid background

### Image Positioning System
The site uses a percentage-based positioning system:
- **Left Page Safe Zone**: 5-40% (no spine effects)
- **Left Near Spine**: 42-50% (subtle rotation effects)
- **Spine Zone**: 48-52% (center binding area)
- **Right Near Spine**: 50-58% (subtle rotation effects)  
- **Right Page Safe Zone**: 60-95% (no spine effects)

## Dependencies

- **No external JavaScript libraries** - uses vanilla JS only
- **Google Fonts**: Courier Prime, Oswald, League Spartan, Inter
- **No build process** - modular files served statically

## Content Organization

Images are organized by photography series:
- **Spread 1**: Seven Sisters landscapes and details
- **Spread 2**: Sri Lanka travel photography
- **Spread 3**: Composition studies
- **Spreads 4-5**: Mixed portfolio content

## Development Notes

- The site uses CSS Grid and Flexbox for layouts
- All animations use CSS transitions for smooth performance
- Image paths are relative to the HTML file location
- The design is optimized for desktop viewing but includes mobile adaptations
- Modular architecture allows for easier maintenance and development
- Canvas-based background system provides high-performance animations
- No server-side processing required - can be deployed as static files

## Important Notes

- This is a static website requiring no backend infrastructure
- All interactivity is handled client-side with vanilla JavaScript in modular files
- The book spine effect is the central design element - images are positioned relative to a 50% center line
- Generative grid background can be toggled on/off with Y/N controls
- Mobile version switches from side-by-side book layout to single column
- Images should be properly optimized for web before adding to avoid slow loading times
- When editing functionality, respect the modular structure:
  - Visual effects and interactions → `js/blob-effects.js`
  - Grid background system → `js/grid-background.js`
  - Coordination and initialization → `js/main.js`
  - All styling → `css/styles.css`