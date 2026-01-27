# Phase 03: UI/UX Construction
Status: ⬜ Pending
Dependencies: phase-01-setup.md

## Objective
Build the visible "body" of the Matchmaker. Create high-end, smooth components based on `ui-ux-pro-max` guidelines.

## Requirements
- [ ] **Intro Screen**: Cinematic, catchy.
- [ ] **Quiz Interface**: Card-based, progress indicator, smooth transitions.
- [ ] **Results Screen**: "Hero" product highlight, explanation text.

## Implementation Steps
1.  [ ] **Layout**: Create `Layout.tsx` with mobile-first container (max-w-md, center).
2.  [ ] **Components**:
    *   `UI/Button.tsx`: Gold gradient, ripple effect.
    *   `Intro.tsx`: Background image, fade-in text.
    *   `QuizCard.tsx`: Question text, options grid.
    *   `Results.tsx`: Top product big card, others smaller.
3.  [ ] **Animations**: Add `AnimatePresence` for switching steps.

## Files to Create/Modify
- `webview/src/components/Intro.tsx`
- `webview/src/components/QuizCard.tsx`
- `webview/src/components/Results.tsx`
- `webview/src/App.tsx` (Main flow state)

## Test Criteria
- [ ] Can navigate from Intro -> Quiz -> Results (dummy data).
- [ ] Animations feel smooth (no jitter).
- [ ] Responsive on mobile size (375px).
