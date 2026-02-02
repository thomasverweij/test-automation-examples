Feature: Text-Based Selectors Examples

  Background:
    Given the user is on the text selectors page

  Scenario: Find button by exact text match
    When the user clicks the button with exact text "Exact Text Button"
    Then the content with ID "text-exact-content" should have class "show"

  Scenario: Find button by partial text match
    When the user clicks the button containing text "Partial Text"
    Then the button should have full text "This Button Has Partial Text"
    And the content with ID "text-partial-content" should have class "show"

  Scenario: Find input by label text
    When the user clicks the input with label "Username Field"
    Then the input should have ID "text-input"
    And the content with ID "text-label-content" should have class "show"

  Scenario: Find heading by text
    Then the h3 heading "Find This Heading" should be visible
    When the user clicks the "Search for Heading" button
    Then the content with ID "text-heading-content" should have class "show"

  Scenario: Find multiple buttons using text content
    Then the button with exact text "Exact Text Button" should be visible
    And the button containing text "Partial Text" should be visible

  Scenario: Verify page structure with text selectors
    Then the page title should be "Text-Based Selectors Examples"
    And the h1 heading should contain text "Text-Based Selectors Examples"
    And the section heading "Text Matching Selector Techniques" should be visible
