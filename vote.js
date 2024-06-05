const {By, Key, until, Builder, Select, WebDriverWait, ExpectedConditions} = require('selenium-webdriver');

require("chromedriver");
const fs = require('fs');


const personalInfoFile = "./.personalInfo.json"

const writeInNamePopUpXML = "/html/body/main/div/div[1]/div[5]/div/div/div[2]/input"

const clickNamePopUpXML = "/html/body/main/div/div[1]/div[5]/div/div/div[2]/div/div/div/button"

const writeInPositionXML = {
    "1B": "/html/body/main/div/div[1]/div[4]/div[1]/div[2]/button[16]/span",
    "2B": "/html/body/main/div/div[1]/div[4]/div[2]/div[2]/button[16]/span",
    "3B": "/html/body/main/div/div[1]/div[4]/div[3]/div[2]/button[16]/span",
    "SS": "/html/body/main/div/div[1]/div[4]/div[4]/div[2]/button[16]/span",
    "C": "/html/body/main/div/div[1]/div[4]/div[5]/div[2]/button[16]/span",
    "OF": "/html/body/main/div/div[1]/div[4]/div[6]/div[2]/button[46]/span",
    "OF1": "/html/body/main/div/div[1]/div[4]/div[6]/div[2]/button[46]/span",
    "OF2": "/html/body/main/div/div[1]/div[4]/div[6]/div[2]/button[46]/span",
    "DH": "/html/body/main/div/div[1]/div[4]/div[7]/div[2]/button[16]/span"
}

const players = {
    "1B": "Ty France", // 1B
    "2B": "Dylan Moore", // 2B
    "3B": "Josh Rojas", // 3B
    "SS": "J.P. Crawford", // SS
    "C": "Cal Raleigh", // C
    "OF": "Dominic Canzone", // OF
    "OF1": "Luke Raley", // OF
    "OF2": "Julio Rodríguez", // OF
    "DH": "Mitch Garver", // DH
}

async function test_case() {
    
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get("https://www.mlb.com/all-star/ballot");
    console.log("accepting cookies")
    var cookiesButton = await driver.wait(until.elementLocated(By.xpath('/html/body/div[9]/div[2]/div/div[1]/div/div[2]/div/button[2]')), 30000);
    await cookiesButton.click();

    for(let position in players) {
        let playerName = players[position];
        let shortPlayerName = truncateName(playerName)
        let positionXML = writeInPositionXML[position];
        try {
            // first try to click on the player
            var clickNameElement = await driver.wait(until.elementLocated(By.xpath('//*[contains(text(), "' + shortPlayerName + '")]//ancestor::button')), 1000);
            retries = 5;
            while (retries > 0) {
                try {
                    await clickNameElement.click();
                    break;
                } catch (ElementClickInterceptedError) {
                    retries--;
                    console.log("Button can't be clicked, scrolling up and retrying");
                    driver.executeScript("window.scrollBy(0, -100)");
                }
            }
        } catch (TimeoutError) {
            // Write in player name if not found
            try {
                var writeInElement = await driver.wait(until.elementLocated(By.xpath(positionXML)), 1000);
                await writeInElement.click();
                enterNameElement = await driver.wait(until.elementLocated(By.xpath(writeInNamePopUpXML)), 1000);
                await enterNameElement.sendKeys(playerName)
                var playerNameElement = await driver.wait(until.elementLocated(By.xpath(clickNamePopUpXML)), 1000);
                await playerNameElement.click();
            } catch (Error) {
                console.log("Could not find player " + playerName);
            }
        }
        console.log("Voted for " + playerName);
    }

    var reviewButton = await driver.wait(until.elementLocated(By.xpath('//*[text()="Review Picks"]')), 1000);
    await reviewButton.click();
    await fillUserData(driver);
}

function truncateName(name) {
    firstName = name.split(" ")[0];
    lastName = name.split(" ")[1];
    firstName = firstName.substring(0, 1) + ".";
    return firstName + " " + lastName;
}

async function fillUserData(driver) {

    let rawdata = fs.readFileSync(personalInfoFile);
    let personalInfo = JSON.parse(rawdata);

    emailElement = await driver.wait(until.elementLocated(By.xpath('//*[@id="fieldjs56ohi2"]')), 5000);
    await emailElement.sendKeys(personalInfo["email"])
    
    zipcodeElement = await driver.wait(until.elementLocated(By.xpath('//*[@id="fieldjs56ohib"]')), 5000);
    await zipcodeElement.sendKeys(personalInfo["zipcode"])

    var bdayMonthElement = new Select(driver.findElement(By.xpath('/html/body/main/div/div[2]/div/div[1]/bam-form/div/div[2]/div/div[2]/form/div[11]/div/div/div/div/div/div[1]/div[1]/select')));
    await bdayMonthElement.selectByVisibleText(personalInfo["bdayMonth"]);

    var bdayDayElement= new Select(driver.findElement(By.xpath('/html/body/main/div/div[2]/div/div[1]/bam-form/div/div[2]/div/div[2]/form/div[11]/div/div/div/div/div/div[1]/div[2]/select')));
    await bdayDayElement.selectByVisibleText(personalInfo["bdayDay"]);

    var bdayYearElement = new Select(driver.findElement(By.xpath('/html/body/main/div/div[2]/div/div[1]/bam-form/div/div[2]/div/div[2]/form/div[11]/div/div/div/div/div/div[1]/div[3]/select')));
    await bdayYearElement.selectByVisibleText(personalInfo["bdayYear"]);

    var countryElement = new Select(driver.findElement(By.xpath('/html/body/main/div/div[2]/div/div[1]/bam-form/div/div[2]/div/div[2]/form/div[12]/div[2]/div/div/div/div/select')));
    await countryElement.selectByVisibleText(personalInfo["country"]);

    var teamElement = new Select(driver.findElement(By.xpath('/html/body/main/div/div[2]/div/div[1]/bam-form/div/div[2]/div/div[2]/form/div[13]/div/div/div[1]/div/div/select')));
    await teamElement.selectByVisibleText(personalInfo["favTeam"]);

    driver.executeScript("window.scrollBy(0, 100)");

    var spamElement = driver.findElement(By.xpath('/html/body/main/div/div[2]/div/div[1]/bam-form/div/div[2]/div/div[2]/form/div[13]/div/div/div[2]/div/div/div[1]/div/div/label[1]'));
    spamElement.click();
    var spamElement2 = driver.findElement(By.xpath('/html/body/main/div/div[2]/div/div[1]/bam-form/div/div[2]/div/div[2]/form/div[14]/div/div/div[1]/div/div/label[1]'));
    spamElement2.click();

    console.log("This is as far as I can take you. Please complete the captcha and submit the form.")
}

test_case();