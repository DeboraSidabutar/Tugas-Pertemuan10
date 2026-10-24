# Web UI Automation - Login

Automation testing halaman login menggunakan JavaScript, Selenium WebDriver, dan Mocha.

## Test Scenarios
- TC01: Login dengan data valid
- TC02: Login dengan password salah
- TC03: Login dengan username tidak valid
- TC04: Login dengan semua field kosong

## Hooks
- before()
- beforeEach()
- afterEach()
- after()

## Run Test
npx mocha login.test.js --timeout 60000
