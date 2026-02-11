# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
Personal portfolio website built with Next.js 16 (App Router), React 19, and Tailwind CSS 4. Features smooth animations using Framer Motion, typing effects, and scroll-triggered animations.

## Commands
```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4 with PostCSS
- **Animations**: Framer Motion, react-type-animation, react-intersection-observer
- **Icons**: react-icons

### Key Directories
- `src/app/` - Next.js App Router pages
- `src/components/` - React components (Navbar, Hero, About, Projects, Skills, Contact, Footer)
- `src/lib/data.js` - Centralized content/data for the portfolio
- `src/app/projects/[slug]/` - Dynamic project detail pages
- `public/images/` - Project images and assets

### Data Flow
All portfolio content (personal info, projects, skills, nav links) is centralized in `src/lib/data.js`. Components import data from this file, making content updates straightforward without touching component logic.

### Component Patterns
- Client components use `"use client"` directive for animations
- Framer Motion handles entry animations and hover effects
- `useInView` from react-intersection-observer triggers scroll-based animations
- Path alias `@/*` maps to `./src/*`
