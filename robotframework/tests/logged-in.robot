*** Settings ***
Library    Browser
Suite Setup    Ensure Storage State

*** Variables ***
${BASE_URL}        http://localhost:8888
${STORAGE_STATE}   ${EMPTY}

*** Test Cases ***
Verify User Logged In On Main Page
    [Documentation]    Validates logged-in UI using a Robot Framework storage state.
    Open Logged In Page
    Wait For Elements State    css=#authUserLabel    visible
    Get Text    css=#authUserLabel    contains    User Two
    Wait For Elements State    css=#authStatusLabel    visible
    Get Text    css=#authStatusLabel    contains    You are logged in
    Wait For Elements State    css=#logoutBtn    visible
    Get Attribute    css=#loginBtn    class    contains    hidden
    Close Browser

Maintain Session Across Page Navigation
    [Documentation]    Ensures session persists when navigating across pages.
    Open Logged In Page
    Wait For Elements State    css=#authUserLabel    visible
    Get Text    css=#authUserLabel    contains    User Two
    Go To    ${BASE_URL}/css-selectors.html
    Go To    ${BASE_URL}/
    Get Text    css=#authUserLabel    contains    User Two
    Wait For Elements State    css=#logoutBtn    visible
    Close Browser

*** Keywords ***
Ensure Storage State
    ${state_file}=    Create Storage State
    Set Suite Variable    ${STORAGE_STATE}    ${state_file}

Create Storage State
    New Browser    chromium    headless=true
    New Context
    New Page    ${BASE_URL}/login
    Fill Text    css=#username    user2
    Fill Text    css=#password    password2
    Click    button[type="submit"]
    Wait For Elements State    css=#authUserLabel    visible
    ${state_file}=    Save Storage State
    Close Browser
    RETURN    ${state_file}

Open Logged In Page
    New Browser    chromium    headless=true
    New Context    storageState=${STORAGE_STATE}
    New Page    ${BASE_URL}/
