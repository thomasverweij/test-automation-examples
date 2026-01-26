*** Settings ***
Library    Browser
Suite Setup    Open Browser To Base URL
Suite Teardown    Close Browser
Test Setup    New Context

*** Variables ***
${BASE_URL}    http://localhost:8888

*** Keywords ***
Open Browser To Base URL
    New Browser    chromium    headless=False

*** Test Cases ***

# CSS Selectors Tests
CSS - Find Element By ID Selector
    [Documentation]    Tests finding element using ID selector
    New Page    ${BASE_URL}/css-selectors.html
    Get Element States    id=css-id-button    *=    visible
    Get Text    id=css-id-button    ==    Click Me (ID)
    Get Element States    id=css-id-content    not contains    visible
    Click    id=css-id-button
    Get Element States    id=css-id-content    *=    visible

CSS - Find Element By Class Selector
    [Documentation]    Tests finding element using class selector
    New Page    ${BASE_URL}/css-selectors.html
    Get Element States    css=.css-class-button    *=    visible
    Get Text    css=.css-class-button    ==    Click Me (Class)
    Get Element States    id=css-class-content    not contains    visible
    Click    css=.css-class-button
    Get Element States    id=css-class-content    *=    visible

CSS - Find Element By Data-TestID Attribute
    [Documentation]    Tests finding element using data-testid attribute
    New Page    ${BASE_URL}/css-selectors.html
    Get Element States    css=[data-testid="css-attr-button"]    *=    visible
    Get Text    css=[data-testid="css-attr-button"]    ==    Click Me (Attr)
    Get Element States    id=css-attr-content    not contains    visible
    Click    css=[data-testid="css-attr-button"]
    Get Element States    id=css-attr-content    *=    visible

CSS - Find Element Using Descendant Selector
    [Documentation]    Tests finding element using descendant selector
    New Page    ${BASE_URL}/css-selectors.html
    Get Element States    css=.css-parent > #css-nested-span    *=    visible
    Get Text    css=.css-parent > #css-nested-span    ==    Parent > Child
    Get Element States    id=css-descendant-content    not contains    visible
    Click    text=Show Element
    Get Element States    id=css-descendant-content    *=    visible

CSS - Verify Page Title And Header
    [Documentation]    Verifies page title and header content
    New Page    ${BASE_URL}/css-selectors.html
    Get Title    ==    CSS Selectors Examples
    Get Text    h1    contains    CSS Selectors Examples

# Role-Based Selectors Tests
Role - Find Element By Button Role
    [Documentation]    Tests finding element using button role
    New Page    ${BASE_URL}/role-selectors.html
    Get Element States    text=Click Me (Button Role)    *=    visible
    Get Element States    id=role-button-content    not contains    visible
    Click    text=Click Me (Button Role)
    Get Element States    id=role-button-content    *=    visible

Role - Find Element By Link Role
    [Documentation]    Tests finding element using link role
    New Page    ${BASE_URL}/role-selectors.html
    Get Element States    text=Click Link    *=    visible
    Get Element States    id=role-link-content    not contains    visible
    Click    text=Click Link
    Get Element States    id=role-link-content    *=    visible

Role - Find Element By Textbox Role
    [Documentation]    Tests finding element using textbox role
    New Page    ${BASE_URL}/role-selectors.html
    Get Element States    id=role-textbox    *=    visible
    Get Attribute    id=role-textbox    placeholder    ==    Enter text...
    Get Element States    id=role-textbox-content    not contains    visible
    Click    id=role-textbox
    Get Element States    id=role-textbox-content    *=    visible

Role - Find Element By Checkbox Role And Interact
    [Documentation]    Tests finding and interacting with checkbox
    New Page    ${BASE_URL}/role-selectors.html
    Get Element States    id=role-checkbox    *=    visible
    Get Checkbox State    id=role-checkbox    ==    unchecked
    Get Element States    id=role-checkbox-content    not contains    visible
    Check Checkbox    id=role-checkbox
    Get Checkbox State    id=role-checkbox    ==    checked
    Get Element States    id=role-checkbox-content    *=    visible

Role - Find Element By Combobox Role
    [Documentation]    Tests finding element using combobox role
    New Page    ${BASE_URL}/role-selectors.html
    Get Element States    id=role-combobox    *=    visible
    Get Attribute    id=role-combobox    aria-expanded    ==    false
    Get Element States    id=role-combobox-content    not contains    visible
    Select Options By    id=role-combobox    text    Option 1
    Get Element States    id=role-combobox-content    *=    visible
    Get Attribute    id=role-combobox    aria-expanded    ==    true

Role - Verify Accessibility Heading
    [Documentation]    Verifies accessibility heading is present
    New Page    ${BASE_URL}/role-selectors.html
    Get Element States    text=Role-Based Selectors Examples    *=    visible

Role - Find Back To Dashboard Link By Role
    [Documentation]    Tests finding navigation link
    New Page    ${BASE_URL}/role-selectors.html
    Get Element States    text=← Back to Dashboard    *=    visible
    Get Attribute    text=← Back to Dashboard    href    ==    /

# Text-Based Selectors Tests
Text - Find Button By Exact Text Match
    [Documentation]    Tests finding button by exact text
    New Page    ${BASE_URL}/text-selectors.html
    Get Element States    text=Exact Text Button    *=    visible
    Get Element States    id=text-exact-content    not contains    visible
    Click    text=Exact Text Button
    Get Element States    id=text-exact-content    *=    visible

Text - Find Button By Partial Text Match
    [Documentation]    Tests finding button by partial text
    New Page    ${BASE_URL}/text-selectors.html
    Get Element States    text=This Button Has Partial Text    *=    visible
    Get Text    id=text-partial    ==    This Button Has Partial Text
    Get Element States    id=text-partial-content    not contains    visible
    Click    id=text-partial
    Get Element States    id=text-partial-content    *=    visible

Text - Find Input By Label Text
    [Documentation]    Tests finding input using label text
    New Page    ${BASE_URL}/text-selectors.html
    Get Element States    id=text-input    *=    visible
    Get Attribute    id=text-input    id    ==    text-input
    Get Element States    id=text-label-content    not contains    visible
    Click    id=text-input
    Get Element States    id=text-label-content    *=    visible

Text - Find Heading By Text
    [Documentation]    Tests finding heading by text content
    New Page    ${BASE_URL}/text-selectors.html
    Get Element States    text=Find This Heading    *=    visible
    Get Element States    id=text-heading-content    not contains    visible
    Click    text=Search for Heading
    Get Element States    id=text-heading-content    *=    visible

Text - Find Multiple Buttons Using Text Content
    [Documentation]    Tests finding multiple buttons using text
    New Page    ${BASE_URL}/text-selectors.html
    Get Element States    text=Exact Text Button    *=    visible
    Get Element States    id=text-partial    *=    visible

Text - Verify Page Structure With Text Selectors
    [Documentation]    Verifies page structure using text selectors
    New Page    ${BASE_URL}/text-selectors.html
    Get Title    ==    Text-Based Selectors Examples
    Get Text    h1    contains    Text-Based Selectors Examples
    Get Text    h2    contains    Text Matching Selector Techniques

# XPath Selectors Tests
XPath - Find Element Using XPath By Text
    [Documentation]    Tests finding element using XPath text()
    New Page    ${BASE_URL}/xpath-selectors.html
    Get Element States    xpath=//button[text()="Find By Text"]    *=    visible
    Get Attribute    xpath=//button[text()="Find By Text"]    class    contains    xpath-button
    Get Element States    id=xpath-text-content    not contains    visible
    Click    xpath=//button[text()="Find By Text"]
    Get Element States    id=xpath-text-content    *=    visible

XPath - Find Element Using XPath By Attribute
    [Documentation]    Tests finding element using XPath attribute
    New Page    ${BASE_URL}/xpath-selectors.html
    Get Element States    xpath=//input[@data-xpath-attr="test-value"]    *=    visible
    Get Attribute    xpath=//input[@data-xpath-attr="test-value"]    placeholder    ==    XPath Attr Input
    Get Element States    id=xpath-attr-content    not contains    visible
    Click    text=Verify Input
    Get Element States    id=xpath-attr-content    *=    visible

XPath - Find Element Using XPath By Position
    [Documentation]    Tests finding element using XPath position
    New Page    ${BASE_URL}/xpath-selectors.html
    Get Element States    xpath=(//div[@class="element-card"][3]//button)[3]    *=    visible
    Get Attribute    xpath=(//div[@class="element-card"][3]//button)[3]    id    ==    button-position-3
    Get Text    xpath=(//div[@class="element-card"][3]//button)[3]    ==    Button 3
    Get Element States    id=xpath-position-content    not contains    visible
    Click    text=Show Position 3
    Get Element States    id=xpath-position-content    *=    visible

XPath - Find Element Using Complex XPath
    [Documentation]    Tests finding elements using complex XPath
    New Page    ${BASE_URL}/xpath-selectors.html
    Get Element States    xpath=//div[@class="complex-xpath-container"]/span[@data-level="1"]    *=    visible
    Get Text    xpath=//div[@class="complex-xpath-container"]/span[@data-level="1"]    ==    Level 1
    Get Element States    xpath=//div[@class="complex-xpath-container"]/span[@data-level="2"]    *=    visible
    Get Text    xpath=//div[@class="complex-xpath-container"]/span[@data-level="2"]    ==    Level 2
    Get Element States    id=xpath-complex-content    not contains    visible
    Click    text=Find Complex
    Get Element States    id=xpath-complex-content    *=    visible

XPath - Combine XPath With Browser Library Locators
    [Documentation]    Tests combining XPath with other locators
    New Page    ${BASE_URL}/xpath-selectors.html
    Get Element States    xpath=//div[@class="elements-grid"]    *=    visible
    ${count}=    Get Element Count    xpath=//div[@class="element-card"]
    Should Be Equal As Integers    ${count}    4

XPath - Find Elements Using XPath Contains Function
    [Documentation]    Tests XPath contains() function
    New Page    ${BASE_URL}/xpath-selectors.html
    Get Element States    xpath=//button[contains(@class, "xpath-button")]    *=    visible
    Get Element States    xpath=//input[contains(@placeholder, "XPath")]    *=    visible

XPath - Verify Page Structure Using XPath
    [Documentation]    Verifies page structure using XPath
    New Page    ${BASE_URL}/xpath-selectors.html
    Get Title    ==    XPath Selectors Examples
    Get Element States    xpath=//h1[contains(text(), "XPath Selectors Examples")]    *=    visible
    Get Element States    xpath=//a[@class="primary-link" and contains(text(), "Back to Dashboard")]    *=    visible

# Cross-Page Navigation Test
Navigation - Navigate Between Locator Example Pages
    [Documentation]    Tests navigation between all locator example pages
    New Page    ${BASE_URL}/
    Wait For Load State    domcontentloaded
    
    # Navigate to CSS selectors
    Click    text=View CSS Examples →
    Get Url    ==    ${BASE_URL}/css-selectors.html
    Get Text    h1    contains    CSS Selectors Examples
    
    # Go back and navigate to Role selectors
    Click    text=← Back to Dashboard
    Get Url    ==    ${BASE_URL}/
    Click    text=View Role Examples →
    Get Url    ==    ${BASE_URL}/role-selectors.html
    Get Text    h1    contains    Role-Based Selectors Examples
    
    # Go back and navigate to Text selectors
    Click    text=← Back to Dashboard
    Click    text=View Text Examples →
    Get Url    ==    ${BASE_URL}/text-selectors.html
    Get Text    h1    contains    Text-Based Selectors Examples
    
    # Go back and navigate to XPath selectors
    Click    text=← Back to Dashboard
    Click    text=View XPath Examples →
    Get Url    ==    ${BASE_URL}/xpath-selectors.html
    Get Text    h1    contains    XPath Selectors Examples
