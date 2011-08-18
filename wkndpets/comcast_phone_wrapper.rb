require "selenium-webdriver"

driver =Selenium::WebDriver.for :firefox

driver.navigate.to "https://www.comcast.com/Localization/Localize.ashx?&Referer=/shop/buyflow/default.ashx?SourcePage=Voip"
driver.find_element(:id =>"ctl00__bCPH_localize__streetNameTxt").send_keys('313 Laurel Hills Dr')
driver.find_element(:id =>"ctl00__bCPH_localize__zipCodeTxt").send_keys('07016')
driver.find_element(:id =>"ctl00__bCPH_localize__submitIbtn_button").click()
sleep(10)
# wait = Selenium::WebDriver::Wait.new(:timeout =>10)
#wait.until { driver.find_element(:id=>"CartContainer").displayed? }
offers = driver.find_element(:id =>"ctl00__bCPH_buyflowTabs__tabPanelDigitalVoiceOffers").find_elements(:class_name => "ProductInfo")
 driver.save_screenshot("c:\\tmp\\hello.png")
for i in 0...offers.length
  offers = driver.find_element(:id =>"ctl00__bCPH_buyflowTabs__tabPanelDigitalVoiceOffers").find_elements(:class_name => "ProductInfo")
  offer = offers[i]
  fname = "c:\\tmp\\comcast\\phone\\"+offer.find_element(:class=>"OfferTitle").text
  offer.find_element(:xpath =>'.//*/a/img[@title="Add to my cart"]').click
  wait = Selenium::WebDriver::Wait.new(:timeout =>10)
  wait.until { driver.find_element(:id=> "ctl00__bCPH_BuyflowCart__removeHtmlAnchor1_cart").displayed? }
 # file = File.new(fname+".html", 'w')
 # file.write(driver.page_source)

   driver.save_screenshot(fname+".png")
  sleep(5)
  driver.execute_script("arguments[0].click();", driver.find_element(:id=> "ctl00__bCPH_BuyflowCart__removeHtmlAnchor1_cart"))
  wait = Selenium::WebDriver::Wait.new(:timeout =>10)
  wait.until { driver.find_element(:css=> "#_overlayConfirmationYes > img[alt=Yes]").displayed? }
  driver.execute_script("arguments[0].click();", driver.find_element(:css=> "#_overlayConfirmationYes > img[alt=Yes]"))
  wait = Selenium::WebDriver::Wait.new(:timeout =>10)
  wait.until { driver.find_element(:xpath=>"//*/div[@class='OfferLable']/nobr").text.include?("Your cart is currently empty.") }
end
driver.quit

