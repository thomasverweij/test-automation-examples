*** Settings ***
Library    Browser

*** Variables ***
${TWOFA_CODE_INPUT}        css=#code
${TWOFA_SUBMIT_BUTTON}     css=button[type="submit"]
${TWOFA_ERROR_MESSAGE}     css=#errorMessage
${TWOFA_INFO_BOX}          css=.info-box
${TWOFA_BACK_LINK}         css=a.back-link

*** Keywords ***
Enter 2FA Code
    [Arguments]    ${code}
    Fill Text    ${TWOFA_CODE_INPUT}    ${code}

Verify 2FA Code
    [Arguments]    ${code}
    Enter 2FA Code    ${code}
    Click    ${TWOFA_SUBMIT_BUTTON}

Go Back To Login
    Click    ${TWOFA_BACK_LINK}

Get 2FA Code Input Value
    ${value}=    Get Property    ${TWOFA_CODE_INPUT}    value
    RETURN    ${value}

Get 2FA Code Pattern
    ${pattern}=    Get Attribute    ${TWOFA_CODE_INPUT}    pattern
    RETURN    ${pattern}
