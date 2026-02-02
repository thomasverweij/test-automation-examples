Feature: Cross-Page Navigation

  Scenario: Navigate between locator example pages
    Given the user is on the home page
    When the user clicks the link "View CSS Examples →"
    Then the user should be on page "/css-selectors.html"
    And the h1 header should contain text "CSS Selectors Examples"
    
    When the user clicks the link "← Back to Dashboard"
    Then the user should be on page "/"
    
    When the user clicks the link "View Role Examples →"
    Then the user should be on page "/role-selectors.html"
    And the h1 header should contain text "Role-Based Selectors Examples"
    
    When the user clicks the link "← Back to Dashboard"
    Then the user should be on page "/"
    
    When the user clicks the link "View Text Examples →"
    Then the user should be on page "/text-selectors.html"
    And the h1 header should contain text "Text-Based Selectors Examples"
    
    When the user clicks the link "← Back to Dashboard"
    Then the user should be on page "/"
    
    When the user clicks the link "View XPath Examples →"
    Then the user should be on page "/xpath-selectors.html"
    And the h1 header should contain text "XPath Selectors Examples"
