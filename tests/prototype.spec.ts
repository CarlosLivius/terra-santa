import { test, expect, type Locator, type Page, type TestInfo } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mkdir } from 'node:fs/promises'

/* SpecDrive gate: test IDs name stable user-visible scenes/controls, never algorithm internals.
 * TST-001 FR-001/002 · TS-0301/0302 · AC-001/002/007 · MOT-004
 * TST-002 FR-003/004/007 · TS-0303/0304/0306 · MOT-001/005 · NFR-007
 * TST-003 FR-005/006 · TS-0305 · NFR-008
 * TST-004 FR-008/009 · TS-0401/0402 · AC-006
 * TST-005 FR-010/011/012 · TS-0403/0404/0405 · AC-007
 * TST-006 FR-014 · TS-0406
 * TST-007 AC-001..007 · TS-0103/0503/0505/0506 · NFR-006..010
 * TST-008 FR-004 · TS-0501/0502 · MOT-006 · NFR-004/005/007
 */

const failures = new WeakMap<Page, string[]>()

test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  failures.set(page, errors)
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
})

test.afterEach(async ({ page }) => {
  expect(failures.get(page), 'AC-005: no browser errors during the tested journey').toEqual([])
})

async function snapshot(page: Page, info: TestInfo, name: string) {
  await mkdir('evidence/screenshots', { recursive: true })
  await page.screenshot({ path: `evidence/screenshots/${info.project.name}-${name}.png`, animations: 'disabled' })
  await page.screenshot({ path: `evidence/screenshots/${info.project.name}-${name}-full.png`, fullPage: true, animations: 'disabled' })
}

async function imageDecoded(image: Locator) {
  await expect(image).toHaveJSProperty('complete', true)
  await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth), { message: 'NFR-003/008: informative image loads and decodes' }).toBeGreaterThan(0)
  await image.evaluate(element => (element as HTMLImageElement).decode())
}

async function start(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: /pular/i }).click()
  await expect(page.getByTestId('territory')).toBeVisible()
}

async function navigate(page: Page, destination: 'territory' | 'comparison' | 'recommendation' | 'reset') {
  await page.getByTestId('menu-button').click()
  await expect(page.getByTestId('menu-panel')).toBeVisible()
  await page.getByTestId(`nav-${destination}`).click()
}

async function openResidence(page: Page, id = 'casa-1') {
  await page.getByTestId(`model-${id}`).click()
  await expect(page.getByTestId('residence-scene')).toBeVisible()
  await expect(page.getByRole('heading', { name: new RegExp(`^Casa ${id.slice(-1)}(?:\\s|$)`) }).first()).toBeVisible()
}

async function setRange(page: Page, id: string, value: number) {
  const range = page.getByTestId(id)
  await range.evaluate((element, nextValue) => {
    const input = element as HTMLInputElement
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
    setter.call(input, String(nextValue))
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, value)
  await expect(range).toHaveValue(String(value))
}

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'AC-003/004: no horizontal overflow').toBe(true)
  await expect(page.locator('body')).not.toContainText(/showroom digital/i)
}

async function accessible(page: Page) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  expect(result.violations.map(violation => ({ id: violation.id, impact: violation.impact, targets: violation.nodes.map(node => node.target) })), 'NFR-006..010: WCAG AA audit').toEqual([])
}

async function touchTargets(page: Page) {
  const smallTargets = await page.locator('button, input[type="range"], select').evaluateAll(controls => controls.filter(control => {
    const rect = control.getBoundingClientRect()
    const style = getComputedStyle(control)
    return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0 && (rect.width < 43.9 || rect.height < 43.9)
  }).map(control => ({ name: control.getAttribute('aria-label') || control.textContent, width: control.getBoundingClientRect().width, height: control.getBoundingClientRect().height })))
  expect(smallTargets, 'NFR-007: controls have at least 44 × 44 px touch areas').toEqual([])
}

test('TST-001 · skip opening, automatic release, and all four residences', async ({ page }, info) => {
  const detailedAssets: string[] = []
  page.on('request', request => { if (/\/assets\/(concept-|floor-plan-reference)/.test(request.url())) detailedAssets.push(request.url()) })
  await page.goto('/')
  await expect(page.getByRole('button', { name: /pular/i })).toBeVisible()
  await snapshot(page, info, 'origin')
  await page.getByRole('button', { name: /pular/i }).click()
  await expect(page.getByTestId('territory')).toBeVisible()
  await accessible(page)
  await noOverflow(page)
  await snapshot(page, info, 'territory')
  expect(detailedAssets, 'NFR-001/002: detailed residence imagery loads only after user intent').toEqual([])
  for (const id of ['casa-1', 'casa-2', 'casa-3', 'casa-4']) {
    await openResidence(page, id)
    await expect(page.locator('body')).toContainText(/conceitual/i)
    await noOverflow(page)
    await snapshot(page, info, id)
    if (id === 'casa-2') {
      await setRange(page, 'construction-progress', 100)
      await page.getByTestId('roof-toggle').click()
      await page.getByRole('button', { name: /ver a referência recebida/i }).click()
      await expect(page.getByTestId('reference-plan')).toContainText('Referência recebida · associação a confirmar')
      await accessible(page)
      await snapshot(page, info, 'reference-plan-provisional')
      await page.getByRole('button', { name: /fechar planta de referência/i }).click()
    }
    await navigate(page, 'territory')
  }
  await page.goto('/')
  await expect(page.getByTestId('territory')).toBeVisible({ timeout: 4_000 })
})

test('TST-002 · construction reversible with range and buttons; angle, zoom, and atmosphere', async ({ page }, info) => {
  await start(page)
  await openResidence(page)
  await setRange(page, 'construction-progress', 0)
  await expect(page.getByTestId('construction-stage')).toContainText(/planta/i)
  await snapshot(page, info, 'construction-plan-origin')
  await page.getByTestId('construction-forward').click()
  await expect(page.getByTestId('construction-stage')).toContainText(/estrutura/i)
  await snapshot(page, info, 'construction-structure-start')
  await page.getByTestId('construction-forward').click()
  await expect(page.getByTestId('construction-stage')).toContainText(/aberturas|atmosfera/i)
  await snapshot(page, info, 'construction-openings')
  await page.getByTestId('construction-forward').click()
  await expect(page.getByTestId('construction-stage')).toContainText(/casa|presença/i)
  await snapshot(page, info, 'construction-complete')
  for (const stage of [/aberturas|atmosfera/i, /estrutura/i, /planta/i]) {
    await page.getByTestId('construction-back').click()
    await expect(page.getByTestId('construction-stage')).toContainText(stage)
  }
  await setRange(page, 'construction-progress', 100)
  await expect(page.getByTestId('construction-stage')).toContainText(/casa|presença/i)
  await page.getByTestId('construction-progress').press('Home')
  await expect(page.getByTestId('construction-stage')).toContainText(/planta/i)
  await page.getByTestId('construction-progress').press('End')
  await expect(page.getByTestId('construction-stage')).toContainText(/casa|presença/i)
  const scene = page.getByTestId('residence-scene')
  const firstView = await scene.screenshot({ animations: 'disabled' })
  await setRange(page, 'rotation-angle', 90)
  expect(await scene.screenshot({ animations: 'disabled' })).not.toEqual(firstView)
  const zoomRange = page.getByTestId('scene-zoom')
  const zoomBounds = await zoomRange.evaluate(element => ({ min: Number((element as HTMLInputElement).min), max: Number((element as HTMLInputElement).max) }))
  expect(zoomBounds.max).toBeGreaterThan(zoomBounds.min)
  expect(Number.isFinite(zoomBounds.max)).toBe(true)
  await setRange(page, 'scene-zoom', zoomBounds.max)
  await snapshot(page, info, 'exterior-angle')
  await page.getByTestId('atmosphere-toggle').click()
  const duskView = await scene.screenshot({ animations: 'disabled' })
  await expect(page.getByTestId('atmosphere-toggle')).toHaveAttribute('aria-pressed', 'true')
  await snapshot(page, info, 'atmosphere-dusk')
  await page.getByTestId('atmosphere-toggle').click()
  expect(await scene.screenshot({ animations: 'disabled' })).not.toEqual(duskView)
  await accessible(page)
  await noOverflow(page)
  await touchTargets(page)
})

test('TST-003 · received plan becomes an open house and all four rooms return to the same floor plan', async ({ page }, info) => {
  await start(page)
  await openResidence(page)
  await setRange(page, 'construction-progress', 100)
  await page.getByTestId('roof-toggle').click()
  await expect(page.getByTestId('roof-toggle')).toHaveAttribute('aria-pressed', 'true')
  await snapshot(page, info, 'open-floor-plan')
  await expect(page.getByTestId('house-scene')).toHaveAttribute('data-source-plan', 'reference-received')
  await accessible(page)
  for (const [id, title] of [['living', 'Sala'], ['kitchen', 'Cozinha'], ['bedroom', 'Quarto'], ['bath', 'Banheiro']]) {
    await page.getByTestId(`hotspot-${id}`).click()
    await expect(page.getByTestId('room-panel')).toBeVisible()
    await expect(page.getByTestId('room-panel').getByRole('heading', { name: title, exact: true })).toBeVisible()
    await expect(page.getByTestId('room-panel')).toContainText(/conceitua/i)
    await imageDecoded(page.getByTestId('room-panel').locator('img'))
    await noOverflow(page)
    await accessible(page)
    await snapshot(page, info, `room-${id}`)
    await page.getByRole('button', { name: /voltar à planta/i }).click()
    await expect(page.getByTestId('room-panel')).toBeHidden()
    await expect(page.getByTestId('roof-toggle')).toHaveAttribute('aria-pressed', 'true')
  }
  const chapters = page.locator('[data-pilot-progress]')
  await expect(chapters).toHaveCount(4)
  for (let index = 0; index < 4; index++) {
    await chapters.nth(index).scrollIntoViewIfNeeded()
    await expect(page.getByTestId('house-scene')).toHaveAttribute('data-stage', ['terrain', 'plan', 'structure', 'complete'][index])
    await snapshot(page, info, `pilot-scroll-${index + 1}`)
  }
  await noOverflow(page)
  await accessible(page)
})

test('TST-004 · favorites survive refresh, comparison uses confirmed facts, and unfavorite works', async ({ page }, info) => {
  await start(page)
  await openResidence(page)
  await page.getByTestId('favorite-casa-1').click()
  await expect(page.getByTestId('favorite-casa-1')).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  if (await page.getByRole('button', { name: /pular/i }).isVisible()) await page.getByRole('button', { name: /pular/i }).click()
  if (await page.getByTestId('territory').isVisible()) await openResidence(page)
  await expect(page.getByTestId('favorite-casa-1')).toHaveAttribute('aria-pressed', 'true')
  await navigate(page, 'comparison')
  await page.getByTestId('compare-left').selectOption('casa-1')
  await page.getByTestId('compare-right').selectOption('casa-2')
  const comparison = page.getByTestId('comparison')
  const bedrooms = comparison.locator('.comparison-row').filter({ hasText: 'QUARTOS' })
  await expect(bedrooms.locator('span').nth(1)).toHaveText('2')
  await expect(bedrooms.locator('span').nth(2)).toHaveText('3')
  const bathrooms = comparison.locator('.comparison-row').filter({ hasText: 'BANHEIROS' })
  await expect(bathrooms.locator('span').nth(1)).toHaveText('1')
  await expect(bathrooms.locator('span').nth(2)).toHaveText(/a confirmar/i)
  const suites = comparison.locator('.comparison-row').filter({ hasText: 'SUÍTES' })
  await expect(suites.locator('span').nth(1)).toHaveText(/a confirmar/i)
  await expect(suites.locator('span').nth(2)).toHaveText('1')
  const areas = comparison.locator('.comparison-row').filter({ hasText: 'ÁREA' })
  await expect(areas.locator('span').nth(1)).toHaveText(/a confirmar/i)
  await expect(areas.locator('span').nth(2)).toHaveText(/a confirmar/i)
  await expect(comparison).toContainText(/a confirmar/i)
  await snapshot(page, info, 'comparison')
  await accessible(page)
  await noOverflow(page)
  await page.getByTestId('compare-right').selectOption('casa-3')
  await expect(comparison).toContainText(/a confirmar/i)
  await page.getByTestId('favorite-casa-1').click()
  await expect(page.getByTestId('favorite-casa-1')).toHaveAttribute('aria-pressed', 'false')
})

test('TST-005 · recommendation empty state, explained preference signals, and simulated interest sends nothing', async ({ page }, info) => {
  await start(page)
  await navigate(page, 'recommendation')
  await expect(page.getByTestId('recommendation')).toContainText(/explor/i)
  await expect(page.getByTestId('recommendation-reasons')).toHaveCount(0)
  await snapshot(page, info, 'recommendation-empty')
  await navigate(page, 'territory')
  await openResidence(page)
  await page.getByTestId('favorite-casa-1').click()
  await setRange(page, 'construction-progress', 100)
  await page.getByTestId('roof-toggle').click()
  await page.getByTestId('hotspot-living').click()
  await page.getByRole('button', { name: /voltar à planta/i }).click()
  await page.getByTestId('feature-convivência').click()
  await navigate(page, 'recommendation')
  await expect(page.getByTestId('recommendation')).toContainText('Casa 1')
  await expect(page.getByTestId('recommendation-reasons')).toContainText(/favorit/i)
  await expect(page.getByTestId('recommendation-reasons')).toContainText(/ambiente|sala|convivência/i)
  await expect(page.getByTestId('recommendation')).not.toContainText(/inteligência artificial|\bIA\b/)
  await snapshot(page, info, 'recommendation-signals')
  await accessible(page)
  await noOverflow(page)
  const outbound: string[] = []
  page.on('request', request => {
    if (['fetch', 'xhr', 'ping', 'document'].includes(request.resourceType()) || request.method() !== 'GET') outbound.push(`${request.method()} ${request.url()}`)
  })
  await page.getByRole('button', { name: /tenho interesse/i }).click()
  await expect(page.getByTestId('interest-confirmation')).toBeVisible()
  await expect(page.getByTestId('interest-confirmation')).toContainText(/simulad|protótipo/i)
  await expect(page.getByTestId('interest-confirmation')).toContainText(/nenhum|não.*enviad/i)
  expect(outbound, 'FR-012: interest has no data transmission').toEqual([])
  await accessible(page)
  await snapshot(page, info, 'interest-confirmation')
})

test('TST-006 · reset clears favorites, signals, recommendation, and returns to territory', async ({ page }, info) => {
  await start(page)
  await openResidence(page)
  await page.getByTestId('favorite-casa-1').click()
  await navigate(page, 'recommendation')
  await expect(page.getByTestId('recommendation-reasons')).toBeVisible()
  await navigate(page, 'reset')
  await expect(page.getByTestId('territory')).toBeVisible()
  await snapshot(page, info, 'session-reset')
  await page.reload()
  await page.getByRole('button', { name: /pular/i }).click()
  await expect(page.getByTestId('territory')).toBeVisible()
  await navigate(page, 'recommendation')
  await expect(page.getByTestId('recommendation-reasons')).toHaveCount(0)
  await expect(page.getByTestId('recommendation')).toContainText(/explor/i)
  await navigate(page, 'territory')
  await openResidence(page)
  await expect(page.getByTestId('favorite-casa-1')).toHaveAttribute('aria-pressed', 'false')
})

test('TST-007 · responsive shell, touch targets, accessible menu, and keyboard focus', async ({ page }, info) => {
  await start(page)
  await noOverflow(page)
  await page.getByTestId('menu-button').click()
  await expect(page.getByTestId('menu-panel')).toBeVisible()
  await accessible(page)
  await snapshot(page, info, 'menu')
  await touchTargets(page)
  await page.keyboard.press('Tab')
  const focus = await page.evaluate(() => {
    const element = document.activeElement as HTMLElement
    const css = getComputedStyle(element)
    return { tag: element.tagName, outline: css.outlineStyle, outlineWidth: css.outlineWidth, shadow: css.boxShadow }
  })
  expect(focus.tag).not.toBe('BODY')
  expect(focus.outline !== 'none' && Number.parseFloat(focus.outlineWidth) > 0 || focus.shadow !== 'none', 'NFR-010: visible keyboard focus').toBe(true)
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('menu-panel')).toBeHidden()
  await openResidence(page)
  await accessible(page)
  await noOverflow(page)
  await touchTargets(page)
  await page.getByTestId('menu-button').click()
  await page.getByTestId('nav-recommendation').click()
  await accessible(page)
})

test('TST-008 · reduced motion and no WebGL retain the complete essential journey', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
      if (/webgl/i.test(kind)) return null
      return Reflect.apply(original, this, [kind, ...args])
    } as typeof HTMLCanvasElement.prototype.getContext
  })
  await start(page)
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)
  await openResidence(page)
  await setRange(page, 'construction-progress', 100)
  await page.getByTestId('roof-toggle').click()
  await page.getByTestId('hotspot-living').click()
  await expect(page.getByTestId('room-panel')).toBeVisible()
  await imageDecoded(page.getByTestId('room-panel').locator('img'))
  await page.getByRole('button', { name: /voltar à planta/i }).click()
  await page.getByTestId('atmosphere-toggle').click()
  await page.getByTestId('favorite-casa-1').click()
  await navigate(page, 'recommendation')
  await expect(page.getByTestId('recommendation-reasons')).toBeVisible()
  await page.getByRole('button', { name: /tenho interesse/i }).click()
  await expect(page.getByTestId('interest-confirmation')).toBeVisible()
  await snapshot(page, info, 'reduced-motion-no-webgl')
  const longAnimations = await page.evaluate(() => document.getAnimations().filter(animation => {
    const timing = animation.effect?.getComputedTiming()
    return timing && typeof timing.duration === 'number' && timing.duration > 150 && animation.playState === 'running'
  }).length)
  expect(longAnimations, 'MOT-006: no long active animations with reduced motion').toBe(0)
  await noOverflow(page)
  await accessible(page)
})
