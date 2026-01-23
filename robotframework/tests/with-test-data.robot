*** Settings ***
Library    Browser
Library    OperatingSystem
Library    Collections
Suite Setup    Load Test Data

*** Variables ***
${BASE_URL}        http://localhost:8888
${TEST_ENV}        dev
${TEST_DATA}       ${EMPTY}

*** Test Cases ***
Search For Product And Verify It Is Displayed
    [Documentation]    Searches for a product from test data and verifies expected products are shown.
    New Page    ${BASE_URL}/search.html
    Get Text    h1    contains    Product Search
    Wait For Elements State    css=#searchBox    visible
    Fill Text    css=#searchBox    ${TEST_DATA}[searchTerm]
    Sleep    500ms
    FOR    ${product_name}    IN    @{TEST_DATA}[expectedProducts]
        Wait For Elements State    css=.product-card:has-text("${product_name}")    visible
        Get Text    css=.product-card:has-text("${product_name}") .product-name    contains    ${product_name}
    END
    ${expected_count}=    Get Length    ${TEST_DATA}[expectedProducts]
    Get Text    css=#resultsCount    contains    Found ${expected_count} product

Show No Results For Non Existent Product
    [Documentation]    Searches for a non-existent product and verifies no results message.
    New Page    ${BASE_URL}/search.html
    Fill Text    css=#searchBox    NonExistentProductXYZ123
    Sleep    500ms
    Wait For Elements State    css=.no-results    visible
    Get Text    css=.no-results    contains    No products found

Display All Products When Search Is Empty
    [Documentation]    Verifies all products are displayed when search box is empty.
    New Page    ${BASE_URL}/search.html
    Get Element Count    css=.product-card    ==    12
    Get Text    css=#resultsCount    contains    Found 12 products

*** Keywords ***
Load Test Data
    ${env}=    Get Environment Variable    TEST_ENV    dev
    Set Suite Variable    ${TEST_ENV}    ${env}
    ${data_path}=    Set Variable    ${CURDIR}/../data/${TEST_ENV}/data.json
    ${data_content}=    Get File    ${data_path}
    ${data}=    Evaluate    json.loads($data_content)    modules=json
    Set Suite Variable    ${TEST_DATA}    ${data}
    New Browser    chromium    headless=true
    New Context
