package com.telogical.web;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverBackedSelenium;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.thoughtworks.selenium.Selenium;

public class ComcastWrapper {
	public static void main(String[] args) throws Exception {
		WebDriver driver = new FirefoxDriver();
		// driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		// Navigate to the page
		driver.get("https://www.comcast.com/Localization/Localize.ashx?&Referer=/shop/buyflow/default.ashx?SourcePage=Voip");
	//	Selenium selenium = new WebDriverBackedSelenium(driver,	"https://www.comcast.com");

		// Filling up forms
		driver.findElement(By.id("ctl00__bCPH_localize__streetNameTxt"))
				.sendKeys("313 Laurel Hills Dr");
		driver.findElement(By.id("ctl00__bCPH_localize__zipCodeTxt")).sendKeys(
				"07016");
		driver.findElement(By.id("ctl00__bCPH_localize__submitIbtn_button"))
				.click();
		Thread.sleep(10000);

		int offersCount = driver
				.findElement(
						By.id("ctl00__bCPH_buyflowTabs__tabPanelDigitalVoiceOffers"))
				.findElements(By.className("ProductInfo")).size();

		for (int i = 0; i < offersCount; i++) {
			List<WebElement> offers = driver
					.findElement(
							By.id("ctl00__bCPH_buyflowTabs__tabPanelDigitalVoiceOffers"))
					.findElements(By.className("ProductInfo"));

			WebElement offer = offers.get(i);
			String offerTitle = offer.findElement(By.className("OfferTitle"))
					.getText();
			offer.findElement(By.xpath(".//*/a/img[@title=\"Add to my cart\"]"))
					.click();
			if(driver.findElement(By.id("_overlayProductAddYes")).isDisplayed())
			{
				driver.findElement(By.id("_overlayProductAddYes")).click();
				Thread.sleep(4000);
			}
			File file = new File("c:\\tmp\\comcast\\" + offerTitle + ".html");
			File dir = new File(file.getParent());
			if (!dir.exists()) {
				dir.mkdirs();
			}
			if (!file.exists()) {
				file.createNewFile();
			}
			
			FileWriter fstream = new FileWriter(file, true);
			BufferedWriter out = new BufferedWriter(fstream);
			out.write(driver.getPageSource());
			out.close();
			driver.navigate().back();
			Thread.sleep(5000);
		}
			// System.out.println(driver.findElement(By.id("ctl00__bCPH_BuyflowCart__removeHtmlAnchor1_cart")).getText());
			// Thread.sleep(12000);
			// selenium.click("//a[id=\"ctl00__bCPH_BuyflowCart__removeHtmlAnchor1_cart\"");
			// Thread.sleep(3000);
			// selenium.clickAt("css=#_overlayConfirmationYes > img[alt=Yes]",
			// "");
			// Thread.sleep(4000);
		}
		//
		// for(WebElement offer: offers){
		// String offerTitle =
		// offer.findElement(By.className("OfferTitle")).getText();
		// offer.findElement(By.xpath(".//*/a/img[@title=\"Add to my cart\"]")).click();
		// File file = new File("c:\\tmp\\comcast\\"+offerTitle+".html");
		// File dir = new File(file.getParent());
		// if(!dir.exists()){
		// dir.mkdirs();
		// }
		// if(!file.exists()) {
		// file.createNewFile();
		// }
		// FileWriter fstream = new FileWriter(file,true);
		// BufferedWriter out = new BufferedWriter(fstream);
		// out.write(driver.getPageSource());
		// out.close();
		// driver.navigate().back();
		// Thread.sleep(10000);
		// }

		// driver.close();

		// System.out.println(driver.getPageSource());

	
}