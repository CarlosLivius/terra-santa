import { describe, expect, it } from 'vitest'
import { getConfirmedFeatureLabel, getResidenceSummary, residenceById, residences, type ResidenceId } from '../src/data/residences'
import { createSession, getRecommendation, loadSession, recordSignal, resetSession, saveSession, scoreResidences, SESSION_STORAGE_KEY, toggleFavorite, type PreferenceSession } from '../src/state/preferences'

const score = (session: PreferenceSession, id: ResidenceId) => scoreResidences(session).find((item) => item.residenceId === id)!.score

function memoryStorage(): Storage {
  const entries = new Map<string, string>()
  return {
    get length() { return entries.size },
    clear: () => entries.clear(),
    getItem: (key) => entries.get(key) ?? null,
    key: (index) => [...entries.keys()][index] ?? null,
    removeItem: (key) => { entries.delete(key) },
    setItem: (key, value) => { entries.set(key, value) },
  }
}

describe('TS-0003 — central facts and provisional concepts (FR-013 / AC-006)', () => {
  it('represents the three client-supplied homes and only their supplied architectural facts', () => {
    expect(residences.map((item) => item.id)).toEqual(['casa-1', 'casa-2', 'casa-3'])
    expect(residenceById['casa-1'].features.bedrooms).toMatchObject({ value: 2, confidence: 'confirmed' })
    expect(residenceById['casa-1'].features.bathrooms).toMatchObject({ value: 1, confidence: 'confirmed' })
    expect(residenceById['casa-1'].features.livingRoom.value).toBe(true)
    expect(residenceById['casa-1'].features.kitchen.value).toBe(true)
    expect(residenceById['casa-2'].features.bedrooms).toMatchObject({ value: 3, confidence: 'confirmed' })
    expect(residenceById['casa-2'].features.suites).toMatchObject({ value: 1, confidence: 'confirmed' })
    for (const residence of residences) {
      expect(residence.features.builtAreaM2.value).toBeNull()
      expect(residence.features.lotSize.value).toBeNull()
      expect(residence.features.parkingSpaces.value).toBeNull()
      for (const feature of Object.values(residence.features)) {
        if (feature.value !== null) expect(feature.confidence).toBe('confirmed')
      }
    }
    for (const id of ['casa-3'] as const) {
      expect(Object.values(residenceById[id].features).every((feature) => feature.value === null)).toBe(true)
      expect(getResidenceSummary(residenceById[id])).toBe('Informações a confirmar')
    }
  })

  it('keeps the received floor-plan association separate and explicitly unconfirmed', () => {
    const reference = residenceById['casa-2'].media.referenceFloorPlan!
    expect(reference.associationConfidence).toBe('inferred')
    expect(reference.caption).toContain('a confirmar')
    expect(residenceById['casa-2'].media.floorPlan).toMatch(/^procedural:/)
    expect(residenceById['casa-2'].features.bathrooms.value).toBeNull()
    expect(residenceById['casa-2'].hypotheses.join(' ')).toContain('não está confirmada')
  })

  it('provides four distinct pilot hotspots and replaceable conceptual visual data', () => {
    const pilot = residenceById['casa-1']
    expect(pilot.hotspots).toHaveLength(4)
    expect(new Set(pilot.hotspots.map((item) => item.id)).size).toBe(4)
    expect(new Set(residences.map((item) => item.visual.layout)).size).toBe(3)
    for (const residence of residences) {
      expect(residence.mediaMetadata.confidence).toBe('placeholder')
      expect(residence.tagNotice).toContain('conceituais')
      expect(residence.conceptualNotice).toContain('a confirmar')
      expect(residence.media.hero).toMatch(/\/assets\/(concept-exterior\.webp|casa1\/fachada-frontal\.jpeg|casa[123]\/.*\.(jpeg|png))/)
    }
    for (const hotspot of pilot.hotspots) {
      expect(hotspot.image).toMatch(/^\/assets\/concept-.*\.webp$/)
      expect(hotspot.position.x).toBeGreaterThan(0)
      expect(hotspot.position.x).toBeLessThan(1)
      expect(hotspot.position.y).toBeGreaterThan(0)
      expect(hotspot.position.y).toBeLessThan(1)
    }
    expect(pilot.hotspots.map((hotspot) => hotspot.position)).toEqual([
      { x: 0.29, y: 0.69 }, { x: 0.68, y: 0.7 }, { x: 0.32, y: 0.3 }, { x: 0.71, y: 0.32 },
    ])
    for (const id of ['casa-2', 'casa-3'] as const) {
      const positions = residenceById[id].hotspots.map((hotspot) => hotspot.position)
      expect(new Set(positions.map((position) => `${position.x},${position.y}`)).size).toBe(4)
      expect(positions).not.toEqual(pilot.hotspots.map((hotspot) => hotspot.position))
      expect(positions.every((position) => position.x > 0 && position.x < 1 && position.y > 0 && position.y < 1)).toBe(true)
    }
  })

  it('never promotes inferred or placeholder feature values to comparison facts', () => {
    expect(getConfirmedFeatureLabel({ value: 200, confidence: 'inferred' }, 'm²')).toBe('A confirmar')
    expect(getConfirmedFeatureLabel({ value: 200, confidence: 'placeholder' }, 'm²')).toBe('A confirmar')
    expect(getConfirmedFeatureLabel({ value: null, confidence: 'confirmed' }, 'quartos')).toBe('A confirmar')
    expect(getConfirmedFeatureLabel(residenceById['casa-1'].features.bedrooms, 'quartos')).toBe('2 quartos')
    expect(getResidenceSummary(residenceById['casa-2'])).toBe('3 quartos · 1 suíte')
  })
})

describe('TST-004 — favorites and comparison (FR-008 / FR-009)', () => {
  it('scores only the active favorite and removes its contribution when undone', () => {
    const initial = createSession()
    const favorite = toggleFavorite(initial, 'casa-2', 1)
    expect(initial.favorites).toEqual([])
    expect(favorite.favorites).toEqual(['casa-2'])
    expect(score(favorite, 'casa-2')).toBe(5)
    expect(getRecommendation(favorite)?.residenceId).toBe('casa-2')
    const again = recordSignal(favorite, { residenceId: 'casa-2', type: 'favorite', timestamp: 2 })
    expect(again).toBe(favorite)
    const undone = toggleFavorite(again, 'casa-2', 3)
    expect(score(undone, 'casa-2')).toBe(0)
    expect(undone.signals.filter((item) => item.type === 'favorite')).toHaveLength(0)
    expect(getRecommendation(undone)).toBeNull()
  })

  it('counts each compared residence once even when the pair is reopened', () => {
    let session = createSession()
    session = recordSignal(session, { residenceId: 'casa-1', type: 'compare', key: 'casa-2', timestamp: 1 })
    session = recordSignal(session, { residenceId: 'casa-2', type: 'compare', key: 'casa-1', timestamp: 1 })
    session = recordSignal(session, { residenceId: 'casa-1', type: 'compare', key: 'casa-3', timestamp: 2 })
    expect(score(session, 'casa-1')).toBe(2)
    expect(score(session, 'casa-2')).toBe(2)
    expect(session.signals).toHaveLength(2)
    expect(getRecommendation(session)?.reasons).toContain('Você incluiu esta residência na comparação.')
  })
})

describe('TST-005 — deterministic explanatory recommendation (FR-010 / FR-011)', () => {
  it('invites more exploration when no meaningful preference is available', () => {
    expect(getRecommendation(createSession())).toBeNull()
    let session = recordSignal(createSession(), { residenceId: 'casa-1', type: 'view', timestamp: 1 })
    expect(getRecommendation(session)).toBeNull()
    session = recordSignal(session, { residenceId: 'casa-1', type: 'hotspot-open', key: 'living', timestamp: 2 })
    expect(getRecommendation(session)).toBeNull()
  })

  it('deduplicates rooms, adds distinct tag affinity and explains the winner', () => {
    let session = createSession()
    session = recordSignal(session, { residenceId: 'casa-1', type: 'hotspot-open', key: 'living', timestamp: 1 })
    session = recordSignal(session, { residenceId: 'casa-1', type: 'hotspot-open', key: 'living', timestamp: 2 })
    session = recordSignal(session, { residenceId: 'casa-1', type: 'hotspot-open', key: 'bedroom', timestamp: 3 })
    expect(session.signals).toHaveLength(2)
    expect(score(session, 'casa-1')).toBe(6)
    expect(score(session, 'casa-2')).toBe(4)
    const recommendation = getRecommendation(session)!
    expect(recommendation.residenceId).toBe('casa-1')
    expect(recommendation.reasons).toHaveLength(2)
    expect(recommendation.reasons.join(' ')).toContain('conceitual')
    expect(recommendation.reasons.join(' ')).toContain('2 ambientes')
    expect(getRecommendation(session)).toEqual(recommendation)
  })

  it('deduplicates selected interests and distinguishes them from architectural facts', () => {
    let session = recordSignal(createSession(), { residenceId: 'casa-3', type: 'feature-focus', key: 'natureza', timestamp: 1 })
    session = recordSignal(session, { residenceId: 'casa-3', type: 'feature-focus', key: 'natureza', timestamp: 2 })
    expect(score(session, 'casa-3')).toBe(4)
    expect(score(session, 'casa-1')).toBe(0)
    expect(score(session, 'casa-2')).toBe(0)
    expect(session.signals).toHaveLength(1)
    expect(getRecommendation(session)?.reasons.join(' ')).toContain('conceitual')
  })

  it('adds return visits and suppresses duplicate events from the same instant', () => {
    let session = recordSignal(createSession(), { residenceId: 'casa-3', type: 'view', timestamp: 1 })
    session = recordSignal(session, { residenceId: 'casa-3', type: 'view', timestamp: 1 })
    expect(score(session, 'casa-3')).toBe(0)
    session = recordSignal(session, { residenceId: 'casa-3', type: 'view', timestamp: 2 })
    expect(score(session, 'casa-3')).toBe(2)
    expect(getRecommendation(session)?.reasons).toContain('Você voltou para explorar esta residência.')
  })

  it('caps relevant dwell time at three distinct 15-second intervals', () => {
    let session = createSession()
    for (const [index, seconds] of [0, 14, 15, 16, 30, 45, 60, 90].entries()) {
      session = recordSignal(session, { residenceId: 'casa-2', type: 'time-spent', key: String(seconds), timestamp: index })
    }
    expect(session.signals.map((item) => item.key)).toEqual(['1', '2', '3'])
    expect(score(session, 'casa-2')).toBe(3)
    expect(getRecommendation(session)?.residenceId).toBe('casa-2')
  })

  it('breaks ties by exploration, then by stable model order', () => {
    let session = toggleFavorite(createSession(), 'casa-1', 1)
    session = toggleFavorite(session, 'casa-2', 2)
    expect(getRecommendation(session)?.residenceId).toBe('casa-1')
    session = recordSignal(session, { residenceId: 'casa-2', type: 'view', timestamp: 3 })
    expect(getRecommendation(session)?.residenceId).toBe('casa-2')
  })

  it('ignores invalid residences, invalid rooms and invalid timestamps', () => {
    const initial = createSession()
    expect(recordSignal(initial, { residenceId: 'casa-9' as ResidenceId, type: 'view' })).toBe(initial)
    expect(recordSignal(initial, { residenceId: 'casa-1', type: 'hotspot-open', key: 'not-a-room' })).toBe(initial)
    expect(recordSignal(initial, { residenceId: 'casa-1', type: 'view', timestamp: Number.NaN })).toBe(initial)
  })
})

describe('TST-006 — local session and complete reset (FR-014)', () => {
  it('restores deduplicated favorites and weighted signals without transmitting data', () => {
    const storage = memoryStorage()
    let session = toggleFavorite(createSession(), 'casa-3', 1)
    session = recordSignal(session, { residenceId: 'casa-3', type: 'feature-focus', key: 'natureza', timestamp: 2 })
    session = recordSignal(session, { residenceId: 'casa-3', type: 'time-spent', key: '15', timestamp: 3 })
    expect(saveSession(session, storage)).toBe(true)
    const restored = loadSession(storage)
    expect(restored.favorites).toEqual(['casa-3'])
    expect(scoreResidences(restored)).toEqual(scoreResidences(session))
    expect(getRecommendation(restored)).toEqual(getRecommendation(session))
    const reset = resetSession()
    expect(saveSession(reset, storage)).toBe(true)
    expect(loadSession(storage)).toEqual(createSession())
    expect(getRecommendation(loadSession(storage))).toBeNull()
  })

  it('safely handles corrupt, obsolete and unavailable browser storage', () => {
    const storage = memoryStorage()
    for (const raw of ['{', 'null', '{"version":0,"signals":[],"favorites":[]}']) {
      storage.setItem(SESSION_STORAGE_KEY, raw)
      expect(loadSession(storage)).toEqual(createSession())
    }
    const blocked = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('full') } } as unknown as Storage
    expect(loadSession(blocked)).toEqual(createSession())
    expect(saveSession(createSession(), blocked)).toBe(false)
  })

  it('recomputes stored weights and ignores unknown model ids', () => {
    const storage = memoryStorage()
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
      version: 1, favorites: ['casa-9', 'casa-1', 'casa-1'], signals: [
        { residenceId: 'casa-2', type: 'compare', weight: 999, timestamp: 1 },
        { residenceId: 'casa-9', type: 'view', weight: 999, timestamp: 2 },
      ],
    }))
    const restored = loadSession(storage)
    expect(restored.favorites).toEqual(['casa-1'])
    expect(score(restored, 'casa-2')).toBe(2)
    expect(restored.signals).toHaveLength(2)
  })
})
