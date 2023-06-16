const {By, Key, until, Builder, Select, WebDriverWait, ExpectedConditions} = require('selenium-webdriver');

require("chromedriver");
const fs = require('fs');


const personalInfoFile = "./.personalInfo.json"

const players = [
    "Ty France",
    "José Caballero",
    "Eugenio Suárez",
    "J.P. Crawford",
    "Cal Raleigh",
    "Teoscar Hernández",
    "Jarred Kelenic",
    "Julio Rodríguez",
    "Miguel Cabrera",
]

async function test_case() {
    
    let driver = await new Builder().forBrowser('chrome').build();

    await driver.get("https://www.mlb.com/all-star/ballot");

    var cookiesButton = await driver.wait(until.elementLocated(By.xpath('/html/body/div[7]/div[2]/div/div[1]/div/div[2]/div/button[2]')), 30000);
    await cookiesButton.click();

    for(let player of players) {
        var element = await driver.wait(until.elementLocated(By.xpath('//*[contains(text(), "' + player + '")]//ancestor::button')), 5000);
        console.log("clicking on " + player);
        retries = 10;
        while (retries > 0) {
            try {
                await element.click();
                break;
            } catch (ElementClickInterceptedError) {
                retries--;
                console.log("Button can't be clicked, scrolling up and retrying");
                driver.executeScript("window.scrollBy(0, -100)");
            }
        }
    }
    // Apply timeout for 10 seconds
    await driver.manage().setTimeouts( { implicit: 10000 } );
    var reviewButton = await driver.wait(until.elementLocated(By.xpath('//*[text()="Review Picks"]')), 5000);
    await reviewButton.click();

    await fillUserData(driver);

}

async function fillUserData(driver) {

    let rawdata = fs.readFileSync(personalInfoFile);
    let personalInfo = JSON.parse(rawdata);

    emailElement = await driver.wait(until.elementLocated(By.xpath('//*[@id="fieldjs56ohi2"]')), 5000);
    await emailElement.sendKeys(personalInfo["email"])
    
    zipcodeElement = await driver.wait(until.elementLocated(By.xpath('//*[@id="fieldjs56ohib"]')), 5000);
    await zipcodeElement.sendKeys(personalInfo["zipcode"])

    var bdayMonthElement = new Select(driver.findElement(By.xpath('//*[@autocomplete="bday-month"]')));
    bdayMonthElement.selectByVisibleText(personalInfo["bdayMonth"]);

    var bdayDayElement= new Select(driver.findElement(By.xpath('//*[@autocomplete="bday-day"]')));
    bdayDayElement.selectByVisibleText(personalInfo["bdayDay"]);

    var bdayYearElement = new Select(driver.findElement(By.xpath('//*[@autocomplete="bday-year"]')));
    bdayYearElement.selectByVisibleText(personalInfo["bdayYear"]);

    var countryElement = new Select(driver.findElement(By.xpath('//*[@id="fieldjvic2uf1"]')));
    countryElement.selectByVisibleText(personalInfo["country"]);

    var teamElement = new Select(driver.findElement(By.xpath('//*[@id="fieldliom0wda"]')));
    teamElement.selectByVisibleText(personalInfo["favTeam"]);

    driver.executeScript("window.scrollBy(0, 100)");

    var spamElement = driver.findElement(By.xpath('//*[@data-name="fieldliom0wdb"]'));
    spamElement.click();
    var spamElement2 = driver.findElement(By.xpath('//*[@data-name="fieldlhz7mgig"]'));
    spamElement2.click();    
}

test_case();