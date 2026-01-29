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
Wait For Dynamically Appearing Element
    [Documentation]    Tests Playwright's auto-wait for elements appearing after delay
    New Page    ${BASE_URL}/dynamic-elements.html
    
    # Click button that triggers delayed element
    Click    text=Trigger Element
    
    # Browser library will auto-wait for the element to appear (1500ms delay)
    Get Text    id=delayed-element >> text="✓ I appeared after a delay!"
    

Wait For Element State Change
    [Documentation]    Tests auto-wait for element state changes
    New Page    ${BASE_URL}/dynamic-elements.html
    
    # Initial state
    Get Text    id=state-button    ==    Not Clicked
    
    # Click and wait for state change
    Click    id=state-button
    Get Text    id=state-button    ==    Clicked
    Get Text    id=state-content    ==    ✓ State changed to clicked

Wait For Element To Become Enabled
    [Documentation]    Tests auto-wait for disabled element to become enabled
    New Page    ${BASE_URL}/dynamic-elements.html
    
    # Initial state - button is disabled
    Get Text    id=dynamic-button    ==    Submit (Initially Disabled)
    
    # Type in input - button should become enabled
    Fill Text    id=dynamic-input    test input
    Get Text    id=dynamic-button-content    ==    ✓ Button is now enabled
    
    # Clear input - button should be disabled again
    Clear Text    id=dynamic-input

Wait For Dynamically Added List Items
    [Documentation]    Tests auto-wait for items being appended to a list
    New Page    ${BASE_URL}/dynamic-elements.html
    
    # Initially has 1 item
    Get Element Count    css=#dynamic-list li    ==    1
    Get Text    css=#dynamic-list li >> nth=0    ==    Item 1
    
    # Add second item
    Click    text=Add Item
    Get Element Count    css=#dynamic-list li    ==    2
    Get Text    css=#dynamic-list li >> nth=1    ==    Item 2
    
    # Add third item
    Click    text=Add Item
    Get Element Count    css=#dynamic-list li    ==    3
    Get Text    css=#dynamic-list li >> nth=2    ==    Item 3

Wait For Modal To Appear And Close
    [Documentation]    Tests auto-wait for modal visibility states
    New Page    ${BASE_URL}/dynamic-elements.html
    
    # Open modal
    Click    text=Open Modal
    Get Text    css=.modal-card h3    ==    Modal Content
    Get Text    css=.modal-card p    ==    This modal appears dynamically
    
    # Close modal
    Click    css=.modal-card >> text=Close
    
Multiple Auto-Waiting Scenarios In Sequence
    [Documentation]    Tests multiple auto-waiting scenarios in one test
    New Page    ${BASE_URL}/dynamic-elements.html
    
    # Test 1: Trigger delayed element
    Click    text=Trigger Element
    Get Text    id=delayed-element    contains    I appeared
    
    # Test 2: Change state
    Click    id=state-button
    Get Text    id=state-button    ==    Clicked
    
    # Test 3: Enable button
    Fill Text    id=dynamic-input    some text
    Click    id=dynamic-button
    
    # Test 4: Add list items
    Click    text=Add Item
    Get Element Count    css=#dynamic-list li    ==    2
    
    # Test 5: Open and close modal
    Click    text=Open Modal
    Get Text    css=.modal-card h3    ==    Modal Content
    Click    css=.modal-card >> text=Close
