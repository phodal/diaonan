Feature: Home page
  As a prospect of QEST
  I want to get the home page

  Scenario: QEST name
    When I visit "/"
    Then I should see "吊兰"

  Scenario: QEST title
    When I visit "/"
    Then I should see the title "MQTT协议,CoAP协议,WebSocket,物联网协议在线测试"

