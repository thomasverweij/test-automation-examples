# allure reporting with robot framework

## run tests
`uv run robot --listener allure_robotframework:results/allure --outputdir results tests/`

## generate report
`npx allure generate --history-limit 30 ./results/allure`

## view report
`open ./allure/report/index.html`