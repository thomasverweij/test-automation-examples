*** Settings ***
Library    Browser
Library    OperatingSystem
Resource    ../pages/LoginPage.robot
Resource    ../pages/TwoFAPage.robot
Resource    ../pages/HomePage.robot
Suite Setup    Suite Setup Keyword
Test Setup    New Context

*** Variables ***
${BASE_URL}        http://localhost:8888
${TWO_FA_SECRET}   %{TWO_FA_SECRET=${EMPTY}}
${USER1_USERNAME}  %{USER1_USERNAME=${EMPTY}}
${USER1_PASSWORD}  %{USER1_PASSWORD=${EMPTY}}
${USER2_USERNAME}  %{USER2_USERNAME=${EMPTY}}
${USER2_PASSWORD}  %{USER2_PASSWORD=${EMPTY}}

*** Test Cases ***
Successfully Complete 2FA Login Flow
    [Documentation]    Tests the complete 2FA authentication flow with valid credentials and code.
    Go To Login Page    ${BASE_URL}
    Login With Credentials    ${USER1_USERNAME}    ${USER1_PASSWORD}
    Get Url    matches    .*/2fa
    Wait For Elements State    ${TWOFA_CODE_INPUT}    visible
    ${totp_code}=    Generate TOTP Code    ${TWO_FA_SECRET}
    Verify 2FA Code    ${totp_code}
    Get Url    ==    ${BASE_URL}/
    Wait For Elements State    ${HOME_AUTH_USER_LABEL}    visible
    Get Text    ${HOME_AUTH_USER_LABEL}    contains    User One
    Get Text    ${HOME_AUTH_STATUS_LABEL}    contains    You are logged in

Validate 2FA Code Format
    [Documentation]    Verifies that the 2FA code input has proper format validation.
    Go To Login Page    ${BASE_URL}
    Login With Credentials    ${USER1_USERNAME}    ${USER1_PASSWORD}
    Get Url    matches    .*/2fa
    Enter 2FA Code    123
    ${input_value}=    Get 2FA Code Input Value
    Should Be Equal    ${input_value}    123
    ${pattern}=    Get 2FA Code Pattern
    Should Be Equal    ${pattern}    [0-9]{6}

Only Accept Numeric Input
    [Documentation]    Verifies that the 2FA code input only accepts numeric values.
    Go To Login Page    ${BASE_URL}
    Login With Credentials    ${USER1_USERNAME}    ${USER1_PASSWORD}
    Get Url    matches    .*/2fa
    Enter 2FA Code    abc123
    ${input_value}=    Get 2FA Code Input Value
    Should Match Regexp    ${input_value}    ^\\d*$

Limit Code Input To 6 Digits
    [Documentation]    Verifies that the 2FA code input limits length to 6 digits.
    Go To Login Page    ${BASE_URL}
    Login With Credentials    ${USER1_USERNAME}    ${USER1_PASSWORD}
    Get Url    matches    .*/2fa
    Enter 2FA Code    1234567890
    ${input_value}=    Get 2FA Code Input Value
    ${length}=    Get Length    ${input_value}
    Should Be True    ${length} <= 6

Show Error For Invalid 2FA Code
    [Documentation]    Verifies that an error message is displayed for invalid 2FA codes.
    Go To Login Page    ${BASE_URL}
    Login With Credentials    ${USER1_USERNAME}    ${USER1_PASSWORD}
    Get Url    matches    .*/2fa
    Verify 2FA Code    000000
    Wait For Elements State    ${TWOFA_ERROR_MESSAGE}    visible
    Get Text    ${TWOFA_ERROR_MESSAGE}    contains    Invalid authentication code
    ${input_value}=    Get Property    css=#code    value
    Should Be Equal    ${input_value}    ${EMPTY}

Allow Navigation Back To Login Page
    [Documentation]    Verifies that users can navigate back to login page from 2FA page.
    Go To Login Page    ${BASE_URL}
    Login With Credentials    ${USER1_USERNAME}    ${USER1_PASSWORD}
    Get Url    matches    .*/2fa
    Go Back To Login
    Get Url    matches    .*/login
    Wait For Elements State    ${LOGIN_USERNAME_INPUT}    visible

Display Info Box With Instructions
    [Documentation]    Verifies that the 2FA page displays an info box with instructions.
    Go To Login Page    ${BASE_URL}
    Login With Credentials    ${USER1_USERNAME}    ${USER1_PASSWORD}
    Get Url    matches    .*/2fa
    Wait For Elements State    ${TWOFA_INFO_BOX}    visible
    Get Text    ${TWOFA_INFO_BOX}    contains    For Testing

Not Access 2FA Page Without Pending Login
    [Documentation]    Verifies that direct access to 2FA page redirects to login when no pending session.
    New Page    ${BASE_URL}/2fa
    Get Url    matches    .*/login
    Wait For Elements State    css=#username    visible

Login Directly Without 2FA For User2
    [Documentation]    Verifies that user2 logs in directly without 2FA requirement.
    Go To Login Page    ${BASE_URL}
    Login With Credentials    ${USER2_USERNAME}    ${USER2_PASSWORD}
    Get Url    ==    ${BASE_URL}/
    Wait For Elements State    ${HOME_AUTH_USER_LABEL}    visible
    Get Text    ${HOME_AUTH_USER_LABEL}    contains    User Two

*** Keywords ***
Suite Setup Keyword
    New Browser    chromium    headless=false

Generate TOTP Code
    [Documentation]    Generates a TOTP code using the secret key.
    [Arguments]    ${secret}
    ${totp_code}=    Evaluate    __import__('pyotp').TOTP($secret).now()
    RETURN    ${totp_code}
