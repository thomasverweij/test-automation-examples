# test-automation-examples
Repository containing test automation code examples.

## Todo
- playwright browser upload
- playwright api testing
- playwright a11y testing
- playwright mock api response
- playwright test steps
- robot framework browser upload with promise
- robot framework api testing
- robot framework parallel testing
- robot framework secret handling
- github pipeline with docker
- jenkins pipeline
- grafana performance testing dashboard

## Done
- grafana functional testing dashboard
- playwright page object model
- playwright reusable storage state
- playwright 2fa login
- playwright fixture 
- playwright secret handling
- k6 open model
- k6 closed model
- robot framework browser page object model
- robot framework environment config
- robot framework browser resuable storage state
- playwright locators
- robot framework browser locators
- allure dashboard
- npm + uv conf at root
- centralize readme
- refactor junit db parser
- github pipeline playwright

# Requirements 

## macOS
1. Install:
    - [docker desktop](https://www.docker.com/)
    - k6: `brew install k6`
    - uv: `brew install uv`
    - nvm: `brew install nvm`

2. Run:
```
uv sync
uv run rfbrowser install
npm install
npx playwright install
```

# Run examples

## Web
```
npm run dev
```

## Playwright
Example e2e testing scenarios with playwright
```
cd playwright
npx playwright test playwright.config.js --project <project name>
```

## Robot Framework
Example e2e testing scenarios with RF
```
cd robotframework
TEST_ENV=test uv run robotcode robot --outputdir results tests/with-test-data.robot
```

## K6
Example performance testing scenarios
```
cd k6
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=k6-test-report.html k6 run smoke-test.js
```

## Allure
Basic reporting stack with allure
```
cd allure
uv run robot --listener allure_robotframework:results/allure --outputdir results tests/
npx allure generate --history-limit 30 ./results/allure
open ./allure/report/index.html
```

## Grafana
Custom reporting stack for robot framework with docker, grafana, postgresql and nginx
```
cd grafana
docker compose up -d
uv run robot --xunit xunit.xml --outputdir results test_suite.robot
uv run python upload_results.py results
```

## github actions
Basic playwright tests for running in a Github Actions workflow that published results to Github Pages