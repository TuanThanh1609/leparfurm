# Phase 01: Setup & Foundation
Status: ⬜ Pending

## Objective
Initialize the React Webview environment with a premium tech stack (Vite, Tailwind, Framer Motion) and robust code quality tools.

## Requirements
- [ ] Initialize Vite project (React + TypeScript).
- [ ] Configure TailwindCSS with "Le Parfurm" premium theme (Fonts, Colors).
- [ ] Install Framer Motion for high-end animations.
- [ ] Setup Parsing tools (PapaParse) for CSV handling.

## Implementation Steps
1.  [ ] **Init Project**: Create `webview` directory with Vite.
    *   Command: `npm create vite@latest webview -- --template react-ts`
2.  [ ] **Install Deps**: `npm install tailwindcss postcss autoprefixer framer-motion papaparse lucide-react`
3.  [ ] **Tailwind Config**: Define custom colors (Emerald, Gold) and fonts in `tailwind.config.js`.
4.  [ ] **Project Cleanup**: Remove default Vite boilerplate. Create folder structure.

## Files to Create/Modify
- `webview/package.json` - Add dependencies.
- `webview/tailwind.config.js` - Custom theme.
- `webview/src/index.css` - Global styles (Fonts).

## Test Criteria
- [ ] Simple "Hello World" page renders with custom font and color.
- [ ] Framer Motion animation works (e.g., a fading text).
