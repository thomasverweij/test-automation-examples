*** Settings ***
Library    Browser

*** Variables ***
${LOGIN_USERNAME_INPUT}    css=#username
${LOGIN_PASSWORD_INPUT}    css=#password
${LOGIN_SUBMIT_BUTTON}     css=button[type="submit"]
${LOGIN_ERROR_MESSAGE}     css=#errorMessage

*** Keywords ***
Go To Login Page
    [Arguments]    ${base_url}
    New Page    ${base_url}/login

Login With Credentials
    [Arguments]    ${username}    ${password}
    Fill Text    ${LOGIN_USERNAME_INPUT}    ${username}
    Fill Text    ${LOGIN_PASSWORD_INPUT}    ${password}
    Click    ${LOGIN_SUBMIT_BUTTON}
