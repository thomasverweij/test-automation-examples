Feature: Two-Factor Authentication Login Flow

  Background:
    Given the user is on the login page

  Scenario: Successfully complete 2FA login flow
    When the user logs in with user1 credentials
    Then the user should be redirected to the 2FA page
    And the 2FA code input should be visible
    When the user enters a valid 2FA code
    And the user submits the 2FA form
    Then the user should be redirected to the home page
    And the user should be logged in as "User One"
    And the auth status should show "You are logged in"

  Scenario: Validate 2FA code format
    When the user logs in with user1 credentials
    Then the user should be redirected to the 2FA page
    When the user enters "123" in the 2FA code field
    Then the 2FA code input should contain "123"
    And the 2FA code input should have pattern attribute "[0-9]{6}"

  Scenario: Only accept numeric input for 2FA code
    When the user logs in with user1 credentials
    Then the user should be redirected to the 2FA page
    When the user enters "abc123" in the 2FA code field
    Then the 2FA code input should only contain numeric characters

  Scenario: Limit code input to 6 digits
    When the user logs in with user1 credentials
    Then the user should be redirected to the 2FA page
    When the user enters "1234567890" in the 2FA code field
    Then the 2FA code input length should be at most 6 characters

  Scenario: Show error for invalid 2FA code
    When the user logs in with user1 credentials
    Then the user should be redirected to the 2FA page
    When the user enters an invalid 2FA code "999999"
    And the user submits the 2FA form
    Then an error message should be displayed containing "Invalid authentication code"
    And the 2FA code input should be empty and focused

  Scenario: Navigate back to login page from 2FA
    When the user logs in with user1 credentials
    Then the user should be redirected to the 2FA page
    When the user clicks the back to login link
    Then the user should be on the login page

  Scenario: Display info box with instructions
    When the user logs in with user1 credentials
    Then the user should be redirected to the 2FA page
    And the info box should be visible with text "For Testing"

  Scenario: Prevent direct access to 2FA page without login
    When the user navigates directly to the 2FA page
    Then the user should be redirected to the login page

  Scenario: Login directly without 2FA for user2
    When the user logs in with user2 credentials
    Then the user should be redirected to the home page
    And the user should be logged in as "User Two"
