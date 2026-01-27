# test-automation-examples
Repository containing test automation code examples.

# todo
- npm + uv conf at root
- centralize readme
- playwright api testing
- playwright a11y testing
- playwright mock api response
- playwright test steps
- robot framework browser promises
- robot framework api testing
- robot framework parallel testing
- robot framework secret handling
- github pipeline
- jenkins pipeline
- grafana performance testing dashboard
- docker containers

# done
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

# requirements
```
brew install k6 uv nvm
```

# install
```
uv sync
npm install
```

# web
```
npm run dev
```

# playwright
```
cd playwright
npx playwright test -c playwright/playwright.config.js --project locators
``