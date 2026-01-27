# Phase 05: Polish & Deploy
Status: ⬜ Pending
Dependencies: phase-04-logic.md

## Objective
Final polish (icons, loading states, error handling) and deployment to GitHub Pages.

## Requirements
- [ ] **Polish**: Loading animation, error boundary (no data).
- [ ] **Build**: Optimize assets.
- [ ] **Deploy**: Setup GitHub Actions to build Webview.

## Implementation Steps
1.  [ ] **Refinements**: Add "Analyzing" loading screen. Add icons (Lucide).
2.  [ ] **Build Config**: Set `base` path in `vite.config.ts` (for GitHub Pages).
3.  [ ] **CI/CD**: Add `deploy-webview.yml` workflow.

## Files to Create/Modify
- `webview/vite.config.ts`
- `.github/workflows/deploy-webview.yml`
- `webview/src/components/Loading.tsx`

## Test Criteria
- [ ] Build success (`npm run build`).
- [ ] URL accessible on GitHub Pages.
