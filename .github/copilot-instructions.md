# Test Automation Examples - AI Coding Agent Guide

## Project Overview
This is a **demonstration repository** showcasing test automation patterns across multiple frameworks. It's NOT production code—it's a learning resource with isolated, self-contained examples of Playwright, Robot Framework, K6 performance testing, and Grafana integration, tested against a local Express web app.

## Architecture & Components

### Web Application Under Test
- **Location**: [web/server.js](web/server.js)
- **Start**: `cd web && npm start` (runs on `http://localhost:8888`)
- **Key Features**: 
  - Static 2FA secret (`JBSWY3DPEBLW64TMMQ======`) for user1 - shared between server and tests
  - Two test users: user1 (with 2FA) and user2 (without 2FA)
  - Session-based auth with 60s cookie expiry
  - API endpoints: `/api/data`, `/api/unreliable` (50% error rate), `/api/slow` (1-6s delay)

### Test Framework Organization
Each framework is **independent** with its own dependencies and setup. Examples are intentionally isolated; do not assume cross-framework integration unless explicitly stated.

1. **Playwright** ([playwright/](playwright/)): 
   - Environment: Node.js with `npm init` to install
   - Pattern: Page Object Model in [pages/](playwright/pages/)
   - Authentication: Global setup creates reusable storage state at `.auth/user.json`
   - Test data: Environment-based fixtures in [data/](playwright/data/) (dev/test)
   - Secrets: `.env` file for 2FA_SECRET and credentials
   - Run: `npx playwright test <test-name>`

2. **Robot Framework** ([robotframework/](robotframework/)):
   - Environment: Python with `uv sync` (uses pyproject.toml)
   - Output: Always use `--outputdir results` to match dashboard integration
   - Run: `uv run robot --outputdir results <file.robot>`

3. **K6 Performance Testing** ([k6/](k6/)):
   - Install: `brew install k6` (macOS)
   - Test types: smoke-test, stress-test, open-model (ramping-arrival-rate), closed-model (ramping-vus)
   - Run with dashboard: `K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=k6-test-report.html k6 run <test.js>`

4. **Grafana Dashboard** ([grafana/](grafana/)):
   - **Purpose**: Uses a dummy Robot Framework test suite to validate results import (no coupling to other tests).
   - **Critical workflow**: 
     1. `uv sync` → `docker compose up -d` → `uv run robot --xunit output.xml --outputdir results test_suite.robot` → `uv run python upload_results.py results/output.xml`
   - PostgreSQL stores test results, Grafana visualizes them
   - Dashboard config: [grafana/provisioning/dashboards/test-results-dashboard.json](grafana/provisioning/dashboards/test-results-dashboard.json)
   - Access: `http://localhost:3000` (admin/admin)

## Project-Specific Patterns

### Authentication Flow (Playwright)
- **Storage State Pattern**: [global-setup.js](playwright/global-setup.js) logs in ONCE as user2 (no 2FA), saves to `.auth/user.json`
- **Projects configuration**: Different test files mapped to projects (logged-in, with-test-data-dev)
- **2FA Testing**: Uses `speakeasy` library to generate TOTP codes matching server's static secret
- **Example**: See [tests/2fa-login.spec.js](playwright/tests/2fa-login.spec.js) lines 38-42 for TOTP generation

### Test Data Management (Playwright)
- **Custom Fixture**: [fixtures/testData.js](playwright/fixtures/testData.js) extends base test with environment-aware data loading
- **Usage**: Import `{ test }` from fixture instead of `@playwright/test`, access via `testData` parameter
- **Structure**: [data/dev/data.json](playwright/data/dev/) and [data/test/data.json](playwright/data/test/)

### Python Environment Management
- **Tool**: This project uses `uv` (fast Python package manager) instead of pip/virtualenv
- **Commands**: `uv sync` (install), `uv run <command>` (execute in project environment)
- **Config**: [pyproject.toml](grafana/pyproject.toml) in grafana/ and robotframework/

### K6 Load Testing Models
- **Open Model** ([open-model-test.js](k6/open-model-test.js)): Fixed arrival rate (requests/sec), VUs scale automatically
- **Closed Model** ([closed-model-test.js](k6/closed-model-test.js)): Fixed VUs, throughput varies with response time
- **Use thresholds**: `http_req_failed` and `http_req_duration` to define pass/fail criteria

## Development Workflows

### Adding New Tests
- **Playwright**: Use Page Object Model pattern—create page classes in [pages/](playwright/pages/), import in spec files
- **Robot Framework**: Follow existing structure with Settings/Variables/Test Cases sections
- **K6**: Copy existing test type (smoke/stress/open/closed) and modify scenarios/thresholds

### Debugging Tips
- **Playwright trace**: Automatically captured on first retry (see [playwright.config.js](playwright/playwright.config.js) line 35)
- **Web server logs**: Start with `npm start` in terminal to see request logs
- **Grafana data**: Check PostgreSQL directly: `docker exec -it test-results-db psql -U grafana -d testresults`

### Secret Management
- **Never commit**: `.env` files (already in .gitignore)
- **Playwright secrets**: Create `.env` in playwright/ with TWO_FA_SECRET, TEST_USER1_USERNAME, etc.
- **Access in code**: Use `dotenv` package (see [tests/2fa-login.spec.js](playwright/tests/2fa-login.spec.js) lines 8-9)

## Common Pitfalls
- **Web server not running**: Most tests require `http://localhost:8888` active
- **Port conflicts**: Web server uses 8888, Grafana 3000, PostgreSQL 5432
- **Auth storage state**: If tests fail after 60s, storage state expired—rerun global-setup
- **K6 installation**: Not Node.js—install separately via brew/binary
- **uv vs pip**: Don't mix—use `uv run` prefix for all Python commands in this project

## Todo Tracking
See [readme.md](readme.md) for implementation status—this is a work-in-progress demo with many items still pending (allure, jenkins, github actions, etc.)
