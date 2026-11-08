import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' })
try {
  for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } })) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
    await page.goto('http://127.0.0.1:5173')
    await page.getByTestId('model-casa-1').click()
    const underlay = page.getByTestId('pilot-reference-underlay').locator('image')
    await underlay.waitFor()
    assert.equal(await underlay.getAttribute('href'), '/assets/casa1-foundation-generated-v2.png')
    assert.equal(await underlay.getAttribute('width'), '1000')
    await page.waitForTimeout(1000)
    await page.screenshot({ path: `evidence/alignment-${name}.png` })
    await page.getByTestId('construction-progress').fill('25')
    await page.waitForTimeout(300)
    assert.equal(await page.getByTestId('residence-scene').getAttribute('data-progress'), '25')
    await page.screenshot({ path: `evidence/alignment-walls-${name}.png` })
    await page.getByTestId('construction-progress').fill('100')
    await page.waitForTimeout(300)
    assert.equal(await page.getByTestId('pilot-environment').getAttribute('data-finish'), '1')
    await page.screenshot({ path: `evidence/materials-complete-${name}.png` })
    await page.getByTestId('construction-progress').fill('0')
    await page.waitForTimeout(300)
    assert.equal(await page.getByTestId('residence-scene').getAttribute('data-progress'), '0')
    await page.close()
  }
  console.log('TST-002/007 alignment and reversible progress: passed desktop/mobile')
} finally { await browser.close() }
