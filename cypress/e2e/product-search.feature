Feature: Product Search with Test Data

  Background:
    Given the user is on the search page

  Scenario: Search for product and verify it is displayed
    Then the page heading should contain "Product Search"
    And the search box should be visible
    When the user searches for products using test data
    Then the expected products from test data should be displayed
    And the results count should show the correct number of products

  Scenario: Show no results for non-existent product
    When the user searches for "NonExistentProductXYZ123"
    Then the no results message should be displayed
    And the no results message should contain "No products found"

  Scenario: Display all products when search is empty
    Then there should be 12 product cards displayed
    And the results count should contain "Found 12 products"
