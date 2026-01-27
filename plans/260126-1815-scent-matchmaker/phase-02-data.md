# Phase 02: Data Intelligence
Status: ⬜ Pending
Dependencies: phase-01-setup.md

## Objective
Transform raw CSV data (`products_full.csv`) into a smart, tagged JSON dataset that can be queried by the quiz logic.

## Requirements
- [ ] Read `products_full.csv`.
- [ ] Define Tagging Rules (Keywords -> Tags).
- [ ] Script to process and save `products.json`.

## Implementation Steps
1.  [ ] **Tagging Logic**: Create `src/logic/tagging.ts`.
    *   Define dictionary: `{ "date": ["sexy", "warm"], "office": ["fresh", "light"] }`.
2.  [ ] **Converter Script**: Create `scripts/process_data.ts` (runnable via Node).
    *   Read CSV.
    *   Clean Price strings.
    *   Apply Tagging logic based on Title/Description.
    *   Output `webview/src/data/products.json`.
3.  [ ] **Verification**: Check if popular perfumes get correct tags (e.g., Chanel No.5 -> Classy, Floral).

## Files to Create/Modify
- `webview/src/logic/tagging.ts`
- `scripts/process_data.ts`
- `webview/src/data/products.json` (Auto-generated)

## Test Criteria
- [ ] `products.json` exists and contains >0 items.
- [ ] Random product check: Has valid price (number) and tags (array).
