# GitHub Actions Playwright Testing

This folder contains a complete example of running Playwright tests via GitHub Actions with automatic deployment to GitHub Pages.

## 📁 Structure

```
github-actions/
├── tests/
│   └── example.spec.js          # Sample Playwright tests
├── playwright.config.js          # Playwright configuration
├── package.json                  # Dependencies
└── .gitignore                   # Git ignore file
```

## 🚀 Quick Start

### Local Testing

1. Install dependencies:
   ```bash
   cd github-actions
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. View report:
   ```bash
   npm run report
   ```

## 🔧 GitHub Pages Setup

### Option 1: Using Orphan Branch (Recommended)

1. **Create the orphan branch:**
   ```bash
   # Create and switch to a new orphan branch
   git checkout --orphan gh-pages-playwright-example
   
   # Remove all files from the working directory
   git rm -rf .
   
   # Create a placeholder README
   echo "# Playwright Test Reports" > README.md
   echo "This branch contains automated Playwright test reports." >> README.md
   
   # Commit the initial content
   git add README.md
   git commit -m "Initialize GitHub Pages branch"
   
   # Push the branch to GitHub
   git push origin gh-pages-playwright-example
   
   # Switch back to your main branch
   git checkout main  # or master
   ```

2. **Enable GitHub Pages in repository settings:**
   - Go to your repository on GitHub
   - Click **Settings** (top menu)
   - Click **Pages** (left sidebar under "Code and automation")
   - Under "Source", select:
     - Source: **Deploy from a branch**
     - Branch: **gh-pages-playwright-example**
     - Folder: **/ (root)**
   - Click **Save**

3. **Update the workflow file** (if using a non-standard branch):
   
   The workflow is configured to use GitHub Pages deployment action which automatically uses the configured branch. No changes needed if you followed step 2.

### Option 2: Using GitHub Actions Deployment

The workflow is already configured to use the modern GitHub Actions deployment method:

1. **Enable GitHub Pages with GitHub Actions:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select: **GitHub Actions**
   - No need to create a branch manually!

2. **First run:**
   - Go to **Actions** tab
   - Select "Playwright Tests with GitHub Pages" workflow
   - Click **Run workflow**
   - Select branch and click **Run workflow**

## 🎯 GitHub Actions Workflow Features

The workflow ([.github/workflows/playwright-tests.yml](../.github/workflows/playwright-tests.yml)) includes:

- ✅ **Manual trigger only** (`workflow_dispatch`)
- ✅ **Automated test execution** with Playwright
- ✅ **Test artifacts** (reports and results) with 30-day retention
- ✅ **GitHub Pages deployment** with HTML report
- ✅ **Test statistics** displayed in workflow summary
- ✅ **Direct links** to GitHub Pages report

### Workflow Jobs

1. **test** - Runs Playwright tests and extracts results
2. **deploy** - Deploys HTML report to GitHub Pages
3. **summary** - Generates markdown summary with statistics and links

### Accessing Results

After a workflow run completes:

1. **Summary Page**: Click on the workflow run to see test statistics and links
2. **Artifacts**: Download full reports from the artifacts section
3. **GitHub Pages**: Visit the deployed report URL (shown in summary)

## 📊 Test Reports

The workflow generates:

- **HTML Report**: Interactive Playwright HTML report
- **JSON Results**: Machine-readable test results
- **Summary Page**: Custom page with test statistics
- **Screenshots**: Captured on test failures
- **Traces**: Recorded on first retry

## 🔍 Customization

### Adding More Tests

1. Create new test files in `tests/` folder:
   ```javascript
   // tests/my-test.spec.js
   const { test, expect } = require('@playwright/test');
   
   test('my test', async ({ page }) => {
     await page.goto('https://example.com');
     // your test code
   });
   ```

### Modifying Test Configuration

Edit [playwright.config.js](playwright.config.js):
- Change `baseURL` for your application
- Add more browsers (Firefox, Safari)
- Adjust timeouts and retries
- Configure different reporters

### Customizing the Workflow

Edit [.github/workflows/playwright-tests.yml](../.github/workflows/playwright-tests.yml):
- Add scheduled runs (`on.schedule`)
- Change artifact retention days
- Modify test summary format
- Add Slack/email notifications

## 📝 Notes

- Tests run on `ubuntu-latest` with Chromium browser
- Node.js version: 20
- Artifacts retained for 30 days
- GitHub Pages URL will be: `https://<username>.github.io/<repo>/`
- The workflow uses minimal permissions for security

## 🐛 Troubleshooting

### Tests fail locally but pass in CI
- Check Node.js version matches (v20)
- Ensure browsers are installed: `npx playwright install`

### GitHub Pages not deploying
- Verify Pages is enabled in repository settings
- Check workflow has `pages: write` permission
- Ensure the deploy job completed successfully

### Cannot trigger workflow manually
- Ensure you have write access to the repository
- Check that the workflow file is on the main/master branch
- Look for syntax errors in the YAML file

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
