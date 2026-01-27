# Changelog

## [2026-01-26]
### Added
- **Scent Matchmaker Webview**:
    - Initialized React/Vite project.
    - Implemented Premium UI (TailwindCSS theme, Framer Motion).
    - Added Data Processing pipeline (CSV to JSON, Tagging Logic).
    - Created Core Components: `Intro`, `QuizCard`, `Results`.

### Changed
- **Scraper Optimization**:
    - Increased GitHub Actions timeout to 120 minutes.
    - Implemented `safeGoto` with retry logic for network resilience.
    - Added resource blocking (images/fonts) to speed up crawling.

## [2026-01-21]
### Added
- Initial Scraper implementation using Playwright.
- GitHub Actions workflow for daily scraping.
