# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a photography portfolio website built as a single HTML file with embedded CSS and JavaScript. It presents images in an interactive journal/book layout with a spine-based design that simulates the appearance of an open book.

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

This is a single-page application built with vanilla HTML, CSS, and JavaScript:

### Main File
- **cargo_journal_site.html**: Complete photography portfolio website with embedded styles and scripts

### Key Features
- **Responsive journal/book layout** with simulated spine effects
- **Image lightbox functionality** for full-screen viewing
- **Smooth scroll navigation** between portfolio sections
- **Automatic spine blending effects** for images near the center spine
- **Subtle parallax scrolling** effects
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

## JavaScript Functionality

### Core Features
- **Spine Blending System**: Automatically detects images near the center spine and applies 3D rotation effects
- **Lightbox Gallery**: Click-to-enlarge functionality for all images
- **Smooth Navigation**: Anchor-based scrolling between portfolio sections
- **Parallax Effects**: Subtle movement effects on scroll
- **Intersection Observer**: Fade-in animations for page elements

### Image Positioning System
The site uses a percentage-based positioning system:
- **Left Page Safe Zone**: 5-40% (no spine effects)
- **Left Near Spine**: 42-50% (subtle rotation effects)
- **Spine Zone**: 48-52% (center binding area)
- **Right Near Spine**: 50-58% (subtle rotation effects)  
- **Right Page Safe Zone**: 60-95% (no spine effects)

## Dependencies

- **No external JavaScript libraries** - uses vanilla JS only
- **Google Fonts**: Inter, Amatic SC, Zilla Slab, Cabinet Grotesk
- **No build process** - single HTML file deployment

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
- No server-side processing required - can be deployed as static files

## Important Notes

- This is a static website requiring no backend infrastructure
- All interactivity is handled client-side with vanilla JavaScript
- The book spine effect is the central design element - images are positioned relative to a 50% center line
- Mobile version switches from side-by-side book layout to single column
- Images should be properly optimized for web before adding to avoid slow loading times