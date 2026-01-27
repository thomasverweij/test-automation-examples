*** Settings ***
Documentation    Example test suite demonstrating Allure reporting features
...              This suite showcases various Allure annotations and test scenarios
Library          Collections
Library          String

*** Variables ***
${BASE_URL}      http://localhost:8888
${TIMEOUT}       5s

*** Test Cases ***
Successful Login Test
    [Documentation]    Test successful user authentication
    [Tags]    smoke    login    positive
    Log    Starting login test
    ${username}=    Set Variable    testuser
    ${password}=    Set Variable    password123
    Verify Login Credentials    ${username}    ${password}
    Log    Login successful

Failed Login Test With Invalid Credentials
    [Documentation]    Test login with incorrect password
    [Tags]    login    negative
    ${username}=    Set Variable    testuser
    ${password}=    Set Variable    wrongpassword
    Run Keyword And Expect Error    Invalid credentials    Verify Login Credentials    ${username}    ${password}

Data Validation Test
    [Documentation]    Test data validation logic
    [Tags]    validation    data
    ${test_data}=    Create List    apple    banana    cherry    date
    Length Should Be    ${test_data}    4
    Should Contain    ${test_data}    banana
    Log    Data validation passed

String Manipulation Test
    [Documentation]    Test string operations
    [Tags]    string    utility
    ${original}=    Set Variable    Hello World
    ${uppercase}=    Convert To Uppercase    ${original}
    Should Be Equal    ${uppercase}    HELLO WORLD
    ${lowercase}=    Convert To Lowercase    ${original}
    Should Be Equal    ${lowercase}    hello world

Conditional Logic Test
    [Documentation]    Test conditional execution paths
    [Tags]    logic    conditional
    ${value}=    Set Variable    42
    Run Keyword If    ${value} > 40    Log    Value is greater than 40
    Run Keyword If    ${value} < 100    Log    Value is less than 100

API Response Validation Test
    [Documentation]    Simulated API response validation
    [Tags]    api    validation
    ${response}=    Create Dictionary    status=200    message=Success    data=test_value
    Dictionary Should Contain Key    ${response}    status
    Dictionary Should Contain Key    ${response}    message
    Should Be Equal As Numbers    ${response}[status]    200

Skipped Test Example
    [Documentation]    This test is intentionally skipped
    [Tags]    skip    example
    Skip    Skipping this test for demonstration purposes

Parametrized Test Example One
    [Documentation]    First parametrized test with specific data
    [Tags]    parametrized    data-driven
    ${result}=    Calculate Sum    10    20
    Should Be Equal As Numbers    ${result}    30

Parametrized Test Example Two
    [Documentation]    Second parametrized test with different data
    [Tags]    parametrized    data-driven
    ${result}=    Calculate Sum    5    15
    Should Be Equal As Numbers    ${result}    20

Critical Path Test
    [Documentation]    Critical functionality test
    [Tags]    critical    smoke
    Log    Testing critical application path
    ${status}=    Set Variable    active
    Should Be Equal    ${status}    active
    Log    Critical path verification complete

*** Keywords ***
Verify Login Credentials
    [Arguments]    ${username}    ${password}
    [Documentation]    Verifies user credentials
    Log    Checking credentials for user: ${username}
    Run Keyword If    '${password}' != 'password123'    Fail    Invalid credentials
    Log    Credentials verified successfully

Calculate Sum
    [Arguments]    ${a}    ${b}
    [Documentation]    Calculates sum of two numbers
    ${result}=    Evaluate    ${a} + ${b}
    RETURN    ${result}
