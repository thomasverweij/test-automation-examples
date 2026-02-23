Feature: Auto-Waiting Scenarios

  Background:
    Given the user is on the dynamic elements page

  Scenario: Wait for dynamically appearing element
    When the user clicks the "Trigger Element" button
    Then the delayed element should be visible
    And the delayed element should contain text "✓ I appeared after a delay!"

  Scenario: Wait for element state change
    Given the state button should have text "Not Clicked"
    And the state content should not be visible
    When the user clicks the state button
    Then the state button should have text "Clicked"
    And the state content should be visible
    And the state content should contain text "✓ State changed to clicked"

  Scenario: Wait for element to become enabled
    Given the dynamic button should be disabled
    And the dynamic button should have text "Submit (Initially Disabled)"
    And the button content should not be visible
    When the user types "test input" in the dynamic input field
    Then the dynamic button should be enabled
    And the button content should be visible
    And the button content should contain text "✓ Button is now enabled"
    When the user clears the dynamic input field
    Then the dynamic button should be disabled
    And the button content should not be visible

  Scenario: Wait for dynamically added list items
    Given the dynamic list should have 1 item
    And the first list item should have text "Item 1"
    When the user clicks the "Add Item" button
    Then the dynamic list should have 2 items
    And the second list item should have text "Item 2"
    When the user clicks the "Add Item" button
    Then the dynamic list should have 3 items
    And the third list item should have text "Item 3"

  Scenario: Wait for modal to appear and close
    Given the modal overlay should not be visible
    When the user clicks the "Open Modal" button
    Then the modal overlay should be visible
    And the modal card should be visible
    And the modal should have title "Modal Content"
    And the modal should have text "This modal appears dynamically"
    When the user clicks the modal close button
    Then the modal overlay should not be visible

  Scenario: Handle multiple auto-waiting scenarios in sequence
    When the user clicks the "Trigger Element" button
    Then the delayed element should be visible
    When the user clicks the state button
    Then the state button should have text "Clicked"
    When the user types "some text" in the dynamic input field
    Then the dynamic button should be enabled
    When the user clicks the "Add Item" button
    Then the dynamic list should have 2 items
    When the user clicks the "Open Modal" button
    Then the modal overlay should be visible
    When the user clicks the modal close button
    Then the modal overlay should not be visible

  Scenario: Fill both flaky inputs and validate message
    When the user fills both flaky inputs and submits the form
    Then the flaky message should be correct
