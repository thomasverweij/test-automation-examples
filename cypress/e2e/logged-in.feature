Feature: Logged In User Tests

  Background:
    Given the user logs in with username from env "TEST_USER2_USERNAME" and password from env "TEST_USER2_PASSWORD"

  Scenario: Verify user is logged in on main page
    Given the user is on the home page
    Then the user info should be visible with name "User Two"
    And the auth status should show "You are logged in"
    And the logout button should be visible
    And the login button should be hidden

  Scenario: Maintain session across page navigation
    Given the user is on the home page
    Then the user info should be visible with name "User Two"
    When the user navigates to "/css-selectors.html"
    And the user navigates to "/"
    Then the user info should be visible with name "User Two"
    And the logout button should be visible
