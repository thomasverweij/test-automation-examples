Feature: CSS Selectors Examples

  Background:
    Given the user is on the CSS selectors page

  Scenario: Find element by ID selector
    When the user clicks the button with ID "css-id-button"
    Then the button should have text "Click Me (ID)"
    And the content with ID "css-id-content" should have class "show"

  Scenario: Find element by class selector
    When the user clicks the button with class "css-class-button"
    Then the button should have text "Click Me (Class)"
    And the content with ID "css-class-content" should have class "show"

  Scenario: Find element by data-testid attribute
    When the user clicks the button with data-testid "css-attr-button"
    Then the button should have text "Click Me (Attr)"
    And the content with ID "css-attr-content" should have class "show"

  Scenario: Find element using descendant selector
    Then the nested span should be visible
    And the nested span should have text "Parent > Child"
    When the user clicks the "Show Element" button
    Then the content with ID "css-descendant-content" should have class "show"

  Scenario: Verify page title and header
    Then the page title should be "CSS Selectors Examples"
    And the h1 header should contain text "CSS Selectors Examples"
