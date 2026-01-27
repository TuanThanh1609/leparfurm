# Specification: Scent Matchmaker Webview (The Perfume Wizard)
Created: 2026-01-26
Status: Draft

## 1. Executive Summary
A premium, interactive webview designed to find the perfect perfume match for users based on their needs (Occasion, Scent Preference, Price). It acts as a digital consultant, using "ui-ux-pro-max" aesthetics to provide a high-end experience.

## 2. User Flow (The Journey)
1.  **Intro (The Hook)**:
    *   Full-screen cinematic background (video/image).
    *   Headline: "Discover Your Signature Scent".
    *   CTA: "Start the Journey".
2.  **Quiz (The Discovery) - Interactive Cards**:
    *   **Q1: Occasion**: Daily Work, Date Night, Party/Event, Gym/Sport, Relaxing.
    *   **Q2: Vibe/Scent**: Fresh/Citrus, Sweet/Floral, Woody/Warm, Spicy/Sexy.
    *   **Q3: Budget**: Under 1M, 1M-3M, Unlimited.
    *   *Micro-interactions*: Smooth transitions between cards. Progress bar.
3.  **Loading (The Anticipation)**:
    *   Animation "Analyzing your aura..." or "Mixing scents...".
4.  **Results (The Reveal)**:
    *   Top 1 "The Perfect Match" (Hero display).
    *   2 "Runner-ups".
    *   Why this match? (e.g., "Perfect for Date Night because of the warm Vanilla note").
    *   CTA: "Add to Cart" / "View Details".

## 3. Data Intelligence (The Brain)
*   **Source**: `products_full.csv` (already scraped).
*   **Tagging Logic (Auto-generated during build or runtime)**:
    *   Keywords in `title`/`description` map to Tags.
    *   *Example*: "chanel", "hoa hồng" -> Tags: [Floral, Classy].
    *   *Example*: "cam", "chanh", "mát" -> Tags: [Fresh, Summer].
*   **Matching Algorithm**:
    *   User inputs -> Weights -> Score each product -> Sort top 3.

## 4. UI/UX Requirements (ui-ux-pro-max)
*   **Color Palette**: Deep Emerald Green, Gold, Cream White (Premium, Luxury).
*   **Typography**: Serif title (Playfair Display) + Sans-serif body (Inter/Montserrat).
*   **Animations**: Framer Motion. Smooth dissolve, slide-up, magnetic buttons.
*   **Responsive**: Mobile-first design (since it's a webview).

## 5. Technical Architecture
*   **Framework**: React 18 + Vite (Fast, Lightweight).
*   **Styling**: TailwindCSS (Utility-first).
*   **State Management**: React Context or Zustand (Simple).
*   **Deployment**: GitHub Pages (Free, Integrated with Repo).

## 6. Project Structure
```
src/
├── components/
│   ├── Intro.tsx
│   ├── QuizCard.tsx
│   ├── Results.tsx
│   └── ui/ (Button, ProgressBar)
├── data/
│   ├── products.json (Generated from CSV)
│   └── tagging_rules.ts
├── logic/
│   └── matchmaker.ts (Scoring algorithm)
├── hooks/
│   └── useQuiz.ts
└── App.tsx
```

## 7. Build Checklist
- [ ] Parse CSV to JSON.
- [ ] Implement Tagging System.
- [ ] Built UI Components.
- [ ] Wire up Matching Logic.
- [ ] Test on Mobile view.
