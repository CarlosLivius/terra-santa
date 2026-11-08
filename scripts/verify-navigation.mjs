import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  args: ['--enable-webgl', '--ignore-gpu-blocklist'],
})

try {
  for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } })) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.goto('http://127.0.0.1:5173')
    const origin = page.getByTestId('origin')
    await origin.waitFor({ state: 'visible' })
    assert.equal(await origin.getByRole('button').count(), 0)
    assert.equal(await origin.getByRole('navigation').count(), 0)
    assert.equal(await origin.locator('.brand').count(), 1)
    assert.equal(await origin.locator('.splash-progress').count(), 1)
    await page.screenshot({ path: `evidence/splash-${name}.png`, fullPage: false })
    await page.waitForTimeout(3500)
    const nav = page.getByRole('navigation', { name: 'Navegação principal' })
    await assert.doesNotReject(() => nav.waitFor({ state: 'visible' }))
    assert.equal(await nav.getByRole('button').count(), 4)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    const activeBefore = await page.locator('.wheel-house.is-active').getAttribute('data-testid')
    if(name==='desktop') {
      await page.getByTestId('territory').dispatchEvent('wheel', { deltaY: 120 })
      await page.waitForTimeout(500)
      const activeAfter = await page.locator('.wheel-house.is-active').getAttribute('data-testid')
      assert.notEqual(activeAfter, activeBefore)
    } else {
      await page.screenshot({ path: 'evidence/navigation-mobile-collapsed.png', fullPage: false })
    }
    assert.equal(await page.locator('.wheel-house.is-active').count(), 1)
    assert.equal(await page.locator('.wheel-selector button[aria-pressed="true"]').count(), 1)
    const optionBoxes = await page.locator('.wheel-selector button').evaluateAll(elements => elements.map(element => { const box=element.getBoundingClientRect(); return {top:box.top,bottom:box.bottom,left:box.left,right:box.right,center:box.top+box.height/2} }))
    assert.ok(optionBoxes.every(box => box.top >= 0 && box.bottom <= viewport.height && box.left >= 0 && box.right <= viewport.width))
    const centers=optionBoxes.map(box=>name==='mobile'?(box.left+box.right)/2:box.center)
    const gaps=centers.slice(1).map((center,index)=>center-centers[index])
    assert.ok(Math.max(...gaps)-Math.min(...gaps)<3,`Wheel options must be ${name==='mobile'?'horizontally':'vertically'} equidistant`)
    const titleBox=await page.locator('.wheel-impact').boundingBox()
    assert.ok(titleBox && titleBox.y+titleBox.height<optionBoxes[0].top,'Impact title must not overlap the first wheel option')
    assert.equal(await page.getByText('Visualizar residência', { exact: true }).count(), 0)
    let captionBox = await page.locator('.wheel-caption').boundingBox()
    assert.ok(captionBox && (name==='mobile'?captionBox.width>=viewport.width*.9:captionBox.width>=viewport.width*.35&&captionBox.width<=viewport.width*.58))
    assert.ok(titleBox && (name==='mobile'?titleBox.y+titleBox.height<optionBoxes[0].top:titleBox.x+titleBox.width<=captionBox.x+1),'Impact title must stay outside the information panel')
    const houseLabelBox=await page.locator('.wheel-house.is-active .wheel-house-label').boundingBox()
    assert.ok(houseLabelBox && (name==='mobile'?houseLabelBox.y+houseLabelBox.height<=captionBox.y+2:houseLabelBox.x+houseLabelBox.width<=captionBox.x+2),'House label must stay outside the information panel')
    const selectedBeforePanelScroll = await page.locator('.wheel-house.is-active').getAttribute('data-testid')
    if(name==='mobile') {
      await page.evaluate(() => window.scrollTo(0, document.querySelector('[data-testid="territory"]')?.scrollHeight || innerHeight))
      await page.waitForTimeout(450)
      assert.equal(await page.getByTestId('territory').getAttribute('data-sheet-expanded'),'true')
      assert.equal(await page.locator('.wheel-house.is-active').getAttribute('data-testid'),selectedBeforePanelScroll)
      captionBox=await page.locator('.wheel-caption').boundingBox()
      assert.ok(captionBox && captionBox.y<=2 && captionBox.width>=viewport.width-2,'Expanded mobile card must fill the viewport')
    }
    await page.locator('.wheel-info-scroll').evaluate(element => { element.scrollTop = 320; element.dispatchEvent(new WheelEvent('wheel',{deltaY:180,bubbles:true})) })
    await page.waitForTimeout(150)
    assert.equal(await page.locator('.wheel-house.is-active').getAttribute('data-testid'),selectedBeforePanelScroll)
    assert.ok(await page.locator('.wheel-info-image img').isVisible())
    assert.equal(await page.getByText('Sob análise financeira',{exact:true}).count(),1)
    await page.locator('.wheel-info-scroll').evaluate(element => { element.scrollTop = 0 })
    await page.waitForTimeout(120)
    await page.screenshot({ path: `evidence/navigation-${name}.png`, fullPage: false })
    assert.deepEqual(errors, [])
    console.log(`${name}: splash, wheel selection, navigation, viewport and console passed`)
    await page.close()
  }
} finally {
  await browser.close()
}
