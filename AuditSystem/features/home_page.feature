Feature: Home page
  In order to assure correct deployment
  As a user
  I want home page loads correctly.
  
Scenario: Home page displayed
  Given I am on home page
  When I search for text "Hello Audit System"
  Then I should see "Hello Audit System"



  

