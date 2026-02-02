Feature: Role-Based Selectors Examples

  Background:
    Given the user is on the role selectors page

  Scenario: Find element by button role
    When the user clicks the button with role "button" and name "Click Me (Button Role)"
    Then the content with ID "role-button-content" should have class "show"

  Scenario: Find element by link role
    When the user clicks the link with role "link" and name "Click Link"
    Then the content with ID "role-link-content" should have class "show"

  Scenario: Find element by textbox role
    When the user clicks the textbox with placeholder "Enter text..."
    Then the content with ID "role-textbox-content" should have class "show"

  Scenario: Find element by checkbox role and interact
    Given the checkbox should not be checked
    When the user checks the checkbox
    Then the checkbox should be checked
    And the content with ID "role-checkbox-content" should have class "show"

  Scenario: Find element by combobox role
    Given the combobox should have attribute "aria-expanded" with value "false"
    When the user selects "Option 1" from the combobox
    Then the content with ID "role-combobox-content" should have class "show"
    And the combobox should have attribute "aria-expanded" with value "true"

  Scenario: Verify accessibility heading
    Then the heading should contain text "Role-Based Selectors Examples"

  Scenario: Find back to dashboard link by role
    Then the back link should be visible
    And the back link should have href "/"
