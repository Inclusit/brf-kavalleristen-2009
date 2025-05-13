# Project Source Map

## app/
- (site)/
  - page.js — Main homepage component, imports layout and news components.
  - layout.js — Layout for the (site) section.
  - error.jsx — Error boundary for the (site) section.
  - [slug]/ — Dynamic routes for site pages.
  - admin/, for-boende/, foreningsinformation/, kontakt/, miljo/ — Section folders for different site areas.
- api/ — API route handlers (admin, auth, board-members, content, nav, nyheter, upload, users)

## components/
- admin/, cards/, cms/, data/, layout/, ui/ — React components for various UI and logic purposes.

## context/
- dynamicNav.tsx, user.tsx — React context providers for navigation and user state.

## generated/, lib/, scripts/ — Utility, helper, and backend logic files.

## types/
- *.d.ts — TypeScript type definitions for content, navigation, news posts, users, etc.

## prisma/
- schema.prisma — Prisma ORM schema for database models.

## public/
- images/ — Site images (e.g., visit-vasby.jpg, vasby-gymnasium.jpeg, etc.)
- icons/ — SVG icons (e.g., book-icon.svg, news-icon.svg, group-icon.svg, etc.)
- fonts/ — Web fonts.
- uploads/ — Uploaded files and documents.

## _styles/
- main.scss — Main SCSS entry point.
- blocks/, core/, extends/, globals/ — SCSS partials for styling different site areas and components.

## Config & Meta
- package.json, tsconfig.json, jsconfig.json, next.config.mjs, eslint.config.mjs, README.md

---

This file provides a high-level overview of the folder and file structure for easy onboarding and navigation.
