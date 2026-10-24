console.log("Tugas Pertemuan 10 - Debora Sidabutar");
console.log("--------------------------------------");

const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("node:assert/strict");

const BASE_URL = "https://belajar-bareng.onrender.com/";
const PAUSE_MS = 3000;

const USERNAME_INPUT = By.css('[data-testid="username-input"]');
const PASSWORD_INPUT = By.css('[data-testid="password-input"]');
const LOGIN_BUTTON = By.css('[data-testid="login-button"]');
const ERROR_MESSAGE = By.css("p.error");

function createDriver() {
  const options = new chrome.Options();

  options.setPageLoadStrategy("eager");
  options.excludeSwitches("enable-logging");
  options.addArguments("--log-level=3");

  return new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
}

describe("Web UI Automation - Login", function () {
  this.timeout(60000);

  let driver;

  before(async function () {
    driver = await createDriver();
  });

  beforeEach(async function () {
    await driver.get(BASE_URL);
  });

  afterEach(async function () {
    if (driver) {
      await driver.manage().deleteAllCookies();
      await driver.sleep(PAUSE_MS);
    }
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      driver = null;
    }
  });

  // TC01: Login dengan data valid
  it("TC01 - Login dengan data valid", async function () {
    await driver.findElement(USERNAME_INPUT).sendKeys("admin");
    await driver.findElement(PASSWORD_INPUT).sendKeys("admin");
    await driver.findElement(LOGIN_BUTTON).click();

    await driver.wait(until.urlContains("/users"), 20000);

    const currentUrl = await driver.getCurrentUrl();

    assert.ok(
      currentUrl.includes("/users"),
      `URL harus berisi /users, diterima ${currentUrl}`
    );

    const heading = await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(),'List Users')]")
      ),
      20000
    );

    assert.equal(
      await heading.isDisplayed(),
      true,
      "Judul List Users harus tampil"
    );
  });

  // TC02: Login dengan password salah
  it("TC02 - Login dengan password salah", async function () {
    await driver.findElement(USERNAME_INPUT).sendKeys("admin");
    await driver.findElement(PASSWORD_INPUT).sendKeys("salah123");
    await driver.findElement(LOGIN_BUTTON).click();

    const errorMessage = await driver.wait(
      until.elementLocated(ERROR_MESSAGE),
      10000
    );

    await driver.wait(
      async () => (await errorMessage.getText()).trim().length > 0,
      10000
    );

    const currentUrl = await driver.getCurrentUrl();

    assert.ok(
      !currentUrl.includes("/users"),
      "Login dengan password salah tidak boleh masuk ke halaman users"
    );

    assert.ok(
      (await errorMessage.getText()).trim().length > 0,
      "Pesan error harus tampil"
    );
  });

  // TC03: Login dengan username tidak valid
  it("TC03 - Login dengan username tidak valid", async function () {
    await driver.findElement(USERNAME_INPUT)
      .sendKeys("user_tidak_terdaftar");

    await driver.findElement(PASSWORD_INPUT).sendKeys("admin");
    await driver.findElement(LOGIN_BUTTON).click();

    const currentUrl = await driver.getCurrentUrl();

    assert.ok(
      !currentUrl.includes("/users"),
      "Username tidak valid tidak boleh masuk ke halaman users"
    );
  });

  // TC04: Login dengan form kosong
  it("TC04 - Login dengan semua field kosong", async function () {
    await driver.findElement(LOGIN_BUTTON).click();

    const currentUrl = await driver.getCurrentUrl();

    assert.ok(
      !currentUrl.includes("/users"),
      "Form kosong tidak boleh berhasil login"
    );
  });
});
