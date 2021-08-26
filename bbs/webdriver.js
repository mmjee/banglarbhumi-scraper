const puppeteer = require('puppeteer-extra')

const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

exports.getWebDriver = function getWebDriver () {
  return puppeteer.launch({
    headless: process.env.NODE_ENV === 'production',
    args: process.env.NODE_ENV === 'production'
      ? [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-sandbox'
        ]
      : [],
    defaultViewport: {
      width: 1920,
      height: 1080
    }
  })
}
