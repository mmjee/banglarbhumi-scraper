const { getWebDriver } = require('bbs/webdriver')

const EXTREME_TIMEOUT = 30000 * 30

class SelectFormError extends Error {}

async function selectForm (page, selector, opt) {
  const districtEl = await page.$(selector)
  const options = await Promise.all((await page.$$(selector + ' > *')).map(async (el) => {
    return el.evaluate((el) => {
      return [el.getAttribute('value'), el.innerText]
    })
  }))

  const relevantOption = options.find(x => {
    return x[1].toLowerCase().indexOf(opt) !== -1
  })
  if (!relevantOption) {
    throw new SelectFormError()
  }

  const selectedValues = await districtEl.select(relevantOption[0])
  if (selectedValues.length !== 1) {
    throw new SelectFormError()
  }

  // This is a heuristic, and I have tried every other method, and nothing works
  // Things tried: waiting for selector on the 2nd element of the select, waiting for network
  await page.waitForTimeout(2000)
}

async function acquirePlotInfo (page, req) {
  const timeout = EXTREME_TIMEOUT

  await page.goto('https://banglarbhumi.gov.in/BanglarBhumi/Home', {
    waitUntil: 'networkidle0',
    timeout
  })

  {
    const kypButton = await page.$('.top_link_icon > a:nth-child(4)')
    await kypButton.click()
    await page.waitForNavigation({
      timeout
    })
  }

  try {
    await selectForm(page, '#lstDistrictCode1', req.body.district.toLowerCase())
    await selectForm(page, '#lstBlockCode1', req.body.block.toLowerCase())
    await selectForm(page, '#lstMouzaList', req.body.mouza.toLowerCase())
  } catch (e) {
    if (e instanceof SelectFormError) {
      return {
        error: true,
        errorCode: 'FORM_HANDLE_ERROR'
      }
    } else {
      throw e
    }
  }

  {
    const switchToPlot = await page.$('#r2')
    await switchToPlot.click()
    await page.waitForSelector('#txtPlotNo', {
      timeout
    })
  }

  {
    const plotNo1 = await page.$('#txtPlotNo')
    await plotNo1.type(req.body.part1)
  }

  if (req.body.plot2 && req.body.plot2.length !== 0) {
    const plotNo2 = await page.$('#txtBataPlotNo')
    await plotNo2.type(req.body.plot2)
  }

  {
    const captchaData = await page.$('#captchaText')
    const value = await (await captchaData.getProperty('value')).jsonValue()
    const captchaValue = value.replaceAll(' ', '')

    const captcha = await page.$('#drawText1')
    await captcha.type(captchaValue)
  }

  {
    const viewBtn = await page.$('#plbutton')
    await viewBtn.click()
  }

  await page.waitForSelector('#plotdetails', {
    visible: true,
    timeout
  })
  await page.waitForTimeout(2000)
  const plotDetails = {}
  try {
    {
      const classification = await page.$('#plotdetails > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)')
      plotDetails.classification = await classification.evaluate(n => n.innerText)
    }
    {
      const totalArea = await page.$('#plotdetails > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(3)')
      plotDetails.totalArea = await totalArea.evaluate(n => n.innerText)
    }
  } catch (e) {
  }

  const holders = []
  {
    // TODO: Fix this selector
    const rows = await page.$$('.tables-fixed > tbody:nth-child(2) > tr')
    for (const row of rows) {
      const unprocessedRowResult = await row.evaluate(trEl => {
        return Array.from(trEl.children).map(ch => ch.innerText)
      })

      // Process a little bit for humanity
      holders.push({
        khatianNo: unprocessedRowResult[0],
        ownerName: unprocessedRowResult[1],
        fatherOrHusband: unprocessedRowResult[2],
        share: unprocessedRowResult[3],
        shareArea: unprocessedRowResult[4],
        remarks: unprocessedRowResult[5]
      })
    }
  }

  return {
    plotDetails,
    holders
  }
}

async function getPlotInfo (req, reply) {
  const browser = await getWebDriver()
  try {
    const page = await browser.newPage()
    return await acquirePlotInfo(page, req)
  } finally {
    await browser.close()
  }
}

exports.getPlotInfo = getPlotInfo
