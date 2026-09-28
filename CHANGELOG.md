# Changelog

## [Unreleased]

### Phase B
- Added experiment analytics, weekly review aggregation, hypothesis evidence analysis, historical reproducibility, and the Day-108 experiment report.
- Added local database backup and restore with behavioral regression coverage.
- Added Playwright end-to-end coverage for unavailable days and the Day 46/47 scoring boundary.
- Added Vitest configuration separating application tests from Playwright E2E tests.
- Completed final security/integrity review and independent harness verification.


- Initial folder structure.
- Experiment amendment (Day 47, 2026-09-06): successful-day threshold changed from "all 13 of 13 protocol items" to "at least 10 of 13 protocol items." Days 1–46 remain scored under the original 13/13 rule; no historical days were recalculated. See `docs/experiment/successful-day-definition.md` for the full versioned definition and amendment record.
- Experiment amendment #2 (Day 47, 2026-09-06, same day): successful-day threshold changed again, from "at least 10 of 13" to "at least 8 of 13" protocol items, before the 10/13 rule was ever applied to score a day. Days 1–46 remain scored under the original 13/13 rule; no historical days were recalculated. See `docs/experiment/successful-day-definition.md` for the full versioned definition and amendment record.
