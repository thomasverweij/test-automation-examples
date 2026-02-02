// ***********************************************************
// This file is loaded before the test files and can be used
// to configure or set up Cypress and custom commands
// ***********************************************************

import './commands';
import 'cypress-xpath';

// Hide fetch/XHR requests from command log for cleaner output
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Add custom Cypress configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // You can customize this to only catch specific errors
  return false;
});
