Feature: XPath Selectors Examples

  Background:
    Given the user is on the XPath selectors page

  Scenario: Find element using XPath by text
    When the user clicks the button found by XPath "//button[text()='Find By Text']"
    Then the button should have class "xpath-button"
    And the content with ID "xpath-text-content" should have class "show"

  Scenario: Find element using XPath by attribute
    Then the input found by XPath "//input[@data-xpath-attr='test-value']" should be visible
    And the input should have placeholder "XPath Attr Input"
    When the user clicks the "Verify Input" button
    Then the content with ID "xpath-attr-content" should have class "show"

  Scenario: Find element using XPath by position
    Then the button found by XPath "(//div[@class='element-card'][3]//button)[3]" should be visible
    And the button should have ID "button-position-3"
    And the button should have text "Button 3"
    When the user clicks the "Show Position 3" button
    Then the content with ID "xpath-position-content" should have class "show"

  Scenario: Find element using complex XPath
    Then the span found by XPath "//div[@class='complex-xpath-container']/span[@data-level='1']" should have text "Level 1"
    And the span found by XPath "//div[@class='complex-xpath-container']/span[@data-level='2']" should have text "Level 2"
    When the user clicks the "Find Complex" button
    Then the content with ID "xpath-complex-content" should have class "show"

  Scenario: Combine XPath with Cypress locators
    Then the elements grid found by XPath "//div[@class='elements-grid']" should be visible
    And there should be 4 element cards found by XPath "//div[@class='element-card']"

  Scenario: Find elements using XPath contains function
    Then the button found by XPath "//button[contains(@class, 'xpath-button')]" should be visible
    And the input found by XPath "//input[contains(@placeholder, 'XPath')]" should be visible

  Scenario: Verify page structure using XPath
    Then the page title should be "XPath Selectors Examples"
    And the header found by XPath "//h1[contains(text(), 'XPath Selectors Examples')]" should be visible
    And the back link found by XPath "//a[@class='primary-link' and contains(text(), 'Back to Dashboard')]" should be visible
