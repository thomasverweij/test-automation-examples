*** Settings ***
Library    Browser
Library    OperatingSystem
Suite Setup    Suite Setup Keyword
Test Setup    New Context

*** Variables ***
${BASE_URL}        http://localhost:8888
${TWO_FA_SECRET}   JBSWY3DPEBLW64TMMQ======
${USER1_USERNAME}  user1
${USER1_PASSWORD}  password1
${USER2_USERNAME}  user2
${USER2_PASSWORD}  password2

*** Test Cases ***
Successfully Complete 2FA Login Flow
    [Documentation]    Tests the complete 2FA authentication flow with valid credentials and code.
    New Page    ${BASE_URL}/login
    Fill Text    css=#username    ${USER1_USERNAME}
    Fill Text    css=#password    ${USER1_PASSWORD}
    Click    css=button[type="submit"]
    Get Url    matches    .*/2fa
    Wait For Elements State    css=#code    visible
    ${totp_code}=    Generate TOTP Code    ${TWO_FA_SECRET}
    Fill Text    css=#code    ${totp_code}
    Click    css=button[type="submit"]
    Get Url    ==    ${BASE_URL}/
    Wait For Elements State    css=#authUserLabel    visible
    Get Text    css=#authUserLabel    contains    User One
    Get Text    css=#authStatusLabel    contains    You are logged in

Validate 2FA Code Format
    [Documentation]    Verifies that the 2FA code input has proper format validation.
    New Page    ${BASE_URL}/login
    Fill Text    css=#username    ${USER1_USERNAME}
    Fill Text    css=#password    ${USER1_PASSWORD}
    Click    css=button[type="submit"]
    Get Url    matches    .*/2fa
    Fill Text    css=#code    123
    ${input_value}=    Get Property    css=#code    value
    Should Be Equal    ${input_value}    123
    Get Attribute    css=#code    pattern    ==    [0-9]{6}

Only Accept Numeric Input
    [Documentation]    Verifies that the 2FA code input only accepts numeric values.
    New Page    ${BASE_URL}/login
    Fill Text    css=#username    ${USER1_USERNAME}
    Fill Text    css=#password    ${USER1_PASSWORD}
    Click    css=button[type="submit"]
    Get Url    matches    .*/2fa
    Fill Text    css=#code    abc123
    ${input_value}=    Get Property    css=#code    value
    Should Match Regexp    ${input_value}    ^\\d*$

Limit Code Input To 6 Digits
    [Documentation]    Verifies that the 2FA code input limits length to 6 digits.
    New Page    ${BASE_URL}/login
    Fill Text    css=#username    ${USER1_USERNAME}
    Fill Text    css=#password    ${USER1_PASSWORD}
    Click    css=button[type="submit"]
    Get Url    matches    .*/2fa
    Fill Text    css=#code    1234567890
    ${input_value}=    Get Property    css=#code    value
    ${length}=    Get Length    ${input_value}
    Should Be True    ${length} <= 6

Show Error For Invalid 2FA Code
    [Documentation]    Verifies that an error message is displayed for invalid 2FA codes.
    New Page    ${BASE_URL}/login
    Fill Text    css=#username    ${USER1_USERNAME}
    Fill Text    css=#password    ${USER1_PASSWORD}
    Click    css=button[type="submit"]
    Get Url    matches    .*/2fa
    Fill Text    css=#code    999999
    Click    css=button[type="submit"]
    Wait For Elements State    css=#errorMessage    visible
    Get Text    css=#errorMessage    contains    Invalid authentication code
    ${input_value}=    Get Property    css=#code    value
    Should Be Equal    ${input_value}    ${EMPTY}

Allow Navigation Back To Login Page
    [Documentation]    Verifies that users can navigate back to login page from 2FA page.
    New Page    ${BASE_URL}/login
    Fill Text    css=#username    ${USER1_USERNAME}
    Fill Text    css=#password    ${USER1_PASSWORD}
    Click    css=button[type="submit"]
    Get Url    matches    .*/2fa
    Click    css=a.back-link
    Get Url    matches    .*/login
    Wait For Elements State    css=#username    visible

Display Info Box With Instructions
    [Documentation]    Verifies that the 2FA page displays an info box with instructions.
    New Page    ${BASE_URL}/login
    Fill Text    css=#username    ${USER1_USERNAME}
    Fill Text    css=#password    ${USER1_PASSWORD}
    Click    css=button[type="submit"]
    Get Url    matches    .*/2fa
    Wait For Elements State    css=.info-box    visible
    Get Text    css=.info-box    contains    For Testing

Not Access 2FA Page Without Pending Login
    [Documentation]    Verifies that direct access to 2FA page redirects to login when no pending session.
    New Page    ${BASE_URL}/2fa
    Get Url    matches    .*/login
    Wait For Elements State    css=#username    visible

Login Directly Without 2FA For User2
    [Documentation]    Verifies that user2 logs in directly without 2FA requirement.
    New Page    ${BASE_URL}/login
    Fill Text    css=#username    ${USER2_USERNAME}
    Fill Text    css=#password    ${USER2_PASSWORD}
    Click    css=button[type="submit"]
    Get Url    ==    ${BASE_URL}/
    Wait For Elements State    css=#authUserLabel    visible
    Get Text    css=#authUserLabel    contains    User Two

*** Keywords ***
Suite Setup Keyword
    New Browser    chromium    headless=false

Generate TOTP Code
    [Documentation]    Generates a TOTP code using the secret key.
    [Arguments]    ${secret}
    ${totp_code}=    Evaluate    __import__('pyotp').TOTP($secret).now()
    RETURN    ${totp_code}
