# Phase 04: Logic & Integration
Status: ⬜ Pending
Dependencies: phase-02-data.md, phase-03-ui.md

## Objective
Connect the "Brain" (Data) to the "Body" (UI). Implement the matching algorithm that scores products based on user answers.

## Requirements
- [ ] **State Management**: Track user answers.
- [ ] **Matching Algo**: Calculate match score.
- [ ] **Wire-up**: Feed real tags/data into the quiz.

## Implementation Steps
1.  [ ] **Quiz Context**: Create `QuizContext.tsx` to store answers.
2.  [ ] **Algorithm**: Implement `calculateMatches(answers, products)`.
    *   Score = (Tag Match * 2) + (Price Match * 1) + (Brand Bonus).
3.  [ ] **Integration**:
    *   In `App.tsx`: On quiz finish, run `calculateMatches`.
    *   Pass result to `Results.tsx`.

## Files to Create/Modify
- `webview/src/context/QuizContext.tsx`
- `webview/src/logic/matchmaker.ts`
- `webview/src/App.tsx` (Update logic)

## Test Criteria
- [ ] Select "Summer" + "Fresh" -> Returns fresh/citrus perfumes.
- [ ] Select "Under 1M" -> Returns affordable options.
