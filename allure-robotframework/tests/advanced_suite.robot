*** Settings ***
Documentation    Advanced test suite with setup/teardown and more complex scenarios
Suite Setup      Suite Initialization
Suite Teardown   Suite Cleanup
Test Setup       Test Initialization
Test Teardown    Test Cleanup
Library          Collections

*** Variables ***
${SUITE_VAR}     Suite Level Variable
${TEST_DATA}     ${EMPTY}

*** Test Cases ***
Test With Setup And Teardown
    [Documentation]    Demonstrates test with setup and teardown hooks
    [Tags]    hooks    lifecycle
    Log    Executing main test logic
    ${data}=    Create List    item1    item2    item3
    Should Not Be Empty    ${data}

Test With Multiple Steps
    [Documentation]    Test with multiple distinct steps for Allure reporting
    [Tags]    multi-step    detailed
    Step One: Initialize Data
    Step Two: Process Data
    Step Three: Verify Results

Error Handling Test
    [Documentation]    Test error handling and recovery
    [Tags]    error-handling    resilience
    ${status}=    Run Keyword And Return Status    Fail    Intentional failure
    Should Be Equal    ${status}    ${False}
    Log    Error was handled correctly

Collection Operations Test
    [Documentation]    Test various collection operations
    [Tags]    collections    data-structures
    ${list}=    Create List    1    2    3    4    5
    ${filtered}=    Create List
    FOR    ${item}    IN    @{list}
        Run Keyword If    ${item} > 2    Append To List    ${filtered}    ${item}
    END
    Length Should Be    ${filtered}    3

Retry Logic Test
    [Documentation]    Test with retry logic simulation
    [Tags]    retry    resilience
    ${attempt}=    Set Variable    1
    Log    Attempt number: ${attempt}
    Should Be True    ${attempt} >= 1

Performance Test Simulation
    [Documentation]    Simulated performance test
    [Tags]    performance    timing  robot:skip
    ${start_time}=    Get Time    epoch
    Sleep    0.1s
    ${end_time}=    Get Time    epoch
    ${duration}=    Evaluate    ${end_time} - ${start_time}
    Should Be True    ${duration} >= 0.5

*** Keywords ***
Suite Initialization
    [Documentation]    Setup performed before all tests in suite
    Log    Initializing test suite
    Set Suite Variable    ${SUITE_VAR}    initialized

Suite Cleanup
    [Documentation]    Cleanup performed after all tests in suite
    Log    Cleaning up test suite

Test Initialization
    [Documentation]    Setup performed before each test
    Log    Initializing test case

Test Cleanup
    [Documentation]    Cleanup performed after each test
    Log    Cleaning up test case

Step One: Initialize Data
    [Documentation]    First step in multi-step test
    Log    Step 1: Initializing test data
    ${data}=    Create Dictionary    key1=value1    key2=value2
    Set Test Variable    ${TEST_DATA}    ${data}

Step Two: Process Data
    [Documentation]    Second step in multi-step test
    Log    Step 2: Processing test data
    Dictionary Should Contain Key    ${TEST_DATA}    key1
    Dictionary Should Contain Key    ${TEST_DATA}    key2

Step Three: Verify Results
    [Documentation]    Third step in multi-step test
    Log    Step 3: Verifying results
    ${keys}=    Get Dictionary Keys    ${TEST_DATA}
    Length Should Be    ${keys}    2
