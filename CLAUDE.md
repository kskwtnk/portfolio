# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Manager

This project uses `pnpm` as the package manager.

- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server at localhost:4321
- `pnpm build` - Build production site to ./dist/
- `pnpm preview` - Preview production build locally

### Code Quality

- `pnpm lint` - Run ESLint on src/
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Check Prettier formatting on src/
- `pnpm format:fix` - Fix Prettier formatting automatically

## Architecture Overview

This is an Astro-based portfolio website for Keisuke Watanuki with Japanese content. The architecture follows these key patterns:

### Content Management

- **Content Collections**: Uses Astro's content collections with TypeScript schemas defined in `src/content.config.ts`
  - `works` - Portfolio projects with cover images, dates, and keywords
  - `talks` - Speaking engagements stored as JSON files by year
  - `about-me` and `about-portfolio` - Static content pages
  - `qiita-articles` - Dynamic articles fetched from Qiita API using custom loader
- **Content Structure**: All content files are in `src/content/` with markdown for rich content and JSON for structured data
- **External API Integration**: Qiita API integration using custom loaders for dynamic content fetching at build time

### Styling & UI

- **TailwindCSS v4**: Uses the new Vite plugin for styling
- **Typography**: Japanese content with Shippori Mincho font family
- **Responsive Design**: Mobile-first approach with complex CSS Grid layouts
- **Visual Effects**: Custom Three.js background effects with GLSL shaders in `src/effects/`

### Page Structure

- **Layout System**: Single `GlobalLayout.astro` handles common HTML structure and transitions
- **Dynamic Routes**: `[...id].astro` pattern for works collection
- **Client-side Navigation**: Uses Astro's view transitions for smooth page changes

### Key Technical Components

- **3D Background**: `granyGradients.ts` creates animated gradient effects using Three.js with custom shaders
- **Intersection Observer**: Used for scroll-based UI animations (scroll guide visibility)
- **Image Optimization**: Uses Astro's built-in Image component with Sharp
- **Custom Content Loaders**: Qiita API integration with error handling, timeout controls, and graceful fallbacks for external content fetching

### File Organization

- `src/components/` - Reusable Astro components
- `src/effects/` - Three.js effects and GLSL shaders
- `src/layouts/` - Page layout components
- `src/pages/` - Route definitions and page components
- `src/content/` - Content collections (markdown and JSON)
- `src/assets/` - Static images referenced in content

## Language Preferences

- **User Communication**: Always respond to the repository owner in Japanese
- **Internal Thinking**: Think and process internally in English for efficiency
- **Content Language**: All website content is in Japanese - maintain language consistency when editing content

## MCP Integration

This project includes MCP (Model Context Protocol) server configurations in `.mcp.json`:

- **Astro docs**: Access to up-to-date Astro framework documentation
- **context7**: Retrieve documentation and code examples for any library
- **playwright**: Browser automation capabilities for testing and debugging

These tools enhance Claude Code's ability to provide accurate, current information and testing capabilities.

## Important Notes

- The site uses semantic HTML with proper accessibility considerations
- Visual effects are performance-optimized with requestAnimationFrame
- Portfolio images are optimized through Astro's image processing pipeline
