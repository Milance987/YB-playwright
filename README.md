<!-- @format -->

# YB Project-Playwright (TypeScript)

Project is prepared for both UI and API test automation with maintainable structure using Playwright framework.

## Implemented

- Task 4 UI test for DemoQA Text Box.
- Task 6 API test for JSONPlaceholder /posts endpoint.
- Task 7 Failure diagnostics: screenshot, trace, and video on failure.
- Scalable structure with Page Object and Flow layers.
- Environment-driven config (`BASE_URL_UI`, `BASE_URL_SAUCE`, `SAUCE_PASSWORD`, `SAUCE_STANDARD_USER`, `SAUCE_PROBLEM_USER`, `BASE_URL_INTERNET`, `BASE_URL_API`, `API_TOKEN`).
- Data-driven test patterns with enums and type guards.
- Chromium-only project configuration.

## Project Structure

```text
YB Project-Playwright/
  flows/
  pages/
  tests/
    ui/
    api/
  playwright.config.ts
  .env.example
  README.md
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browser (Chromium):

```bash
npx playwright install chromium
```

3. Create environment file:

```bash
cp .env.example .env
```

## Run Tests

Run all tests:

```bash
npm test
```

Run only UI tests:

```bash
npm run test:ui
```

Run only API tests:

```bash
npm run test:api
```

Open HTML report:

```bash
npm run report
```

## Failure Diagnostics (Task 7)

- Screenshot is captured only when a test fails.
- Trace is retained only when a test fails.
- Video is retained only when a test fails.
- Failure artifacts are stored under test-results and can be inspected from the HTML report.

Open report and inspect artifacts:

```bash
npm run report
```

## Engineering Reflection

### 1. Scaling to 300+ Tests

**Approach:** Distribute tests into logical suites (UI smoke, UI full, API, regression, performance) and run them in parallel using Playwright's worker pool.
**Architecture:** Maintain centralized helper/fixture layer (pages, flows, api helpers) to reduce code duplication across hundreds of specs. Use data-driven testing for variant scenarios (15 test cases from single loop = less boilerplate).
**CI Strategy:** Run smoke suite (50-100 tests) on every PR; full suite (300+ tests) nightly. Shard tests across CI workers (e.g., 4 parallel agents × 75 tests each) to keep runtime under 5-10 minutes.
**Maintainability:** Tag tests by feature/priority (@smoke, @regression, @flaky); use strict TypeScript to catch breaking changes early.

### 2. Reducing and Monitoring Flakiness

**Identify flaky tests:** Log retry counts and failure patterns in CI reports; tag persistently flaky tests with `@flaky` and isolate them for investigation.
**Root causes:** Remove hard-coded waits (use auto-waiting); replace network-dependent tests with mocks/stubs; add explicit synchronization (waitForURL, waitForLoadState).
**Monitoring:** Track flake rate per test in dashboards (e.g., "if retry rate > 5%, alert"). Mark known-flaky tests in test metadata so they don't block merges.
**Mitigation:** For external APIs (like jsonplaceholder), run with retry+timeout logic in fixtures; for UI, use viewport/device consistency and data factories.

### 3. PR vs Nightly Test Strategy

**Every Pull Request (Fast, ~5 min):** Smoke suite covering critical paths (login, main form submission, core API endpoint). Example: 2 positive UI tests + 1 API GET test. Fail PR if smoke breaks.
**Nightly Runs (Full, 30–60 min):** All 300+ tests including edge cases, negative scenarios, performance checks. Generate full HTML report and track trend metrics (pass rate, avg duration).
**Boundary Cases:** For flaky external dependencies, skip in PR but run nightly; use environment flags to toggle behavior. Separate "fast deterministic" from "sometimes-slow-external" test categories in config.
**Reporting:** PR shows summary (pass/fail/skipped); nightly builds archive full trace+video for post-mortem analysis if failures occur.

## Notes

- No hard-coded waits are used.
- Built-in Playwright assertions and robust locators are used.
- API tests are active under tests/api.
