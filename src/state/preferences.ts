import { residenceById, residences, type ResidenceId } from '../data/residences'

export type PreferenceSignalType = 'view' | 'favorite' | 'hotspot-open' | 'feature-focus' | 'compare' | 'time-spent'
export type PreferenceSignal = {
  residenceId: ResidenceId
  type: PreferenceSignalType
  key?: string
  weight: number
  timestamp: number
}
export type PreferenceSignalInput = Omit<PreferenceSignal, 'weight' | 'timestamp'> & { timestamp?: number }
export type PreferenceSession = { version: 1; favorites: ResidenceId[]; signals: PreferenceSignal[] }
export type RankedResidence = { residenceId: ResidenceId; score: number; explorationCount: number; reasons: string[] }
export type Recommendation = RankedResidence & { rankings: RankedResidence[] }

export const SESSION_STORAGE_KEY = 'terra-santa-session-v1'
const signalTypes: PreferenceSignalType[] = ['view', 'favorite', 'hotspot-open', 'feature-focus', 'compare', 'time-spent']
const isResidenceId = (id: unknown): id is ResidenceId => typeof id === 'string' && residences.some((residence) => residence.id === id)

export function createSession(): PreferenceSession {
  return { version: 1, favorites: [], signals: [] }
}

export const resetSession = createSession

/** Favorite contributions reflect active state, never a history of toggles. */
export function toggleFavorite(session: PreferenceSession, residenceId: ResidenceId, timestamp = Date.now()): PreferenceSession {
  if (!isResidenceId(residenceId)) return session
  const active = session.favorites.includes(residenceId)
  return {
    ...session,
    favorites: active ? session.favorites.filter((id) => id !== residenceId) : [...session.favorites, residenceId],
    signals: [
      ...session.signals.filter((signal) => signal.type !== 'favorite' || signal.residenceId !== residenceId),
      ...(!active ? [{ residenceId, type: 'favorite' as const, weight: 5, timestamp }] : []),
    ],
  }
}

/** All scoring weights originate here rather than in interface event handlers. */
export function recordSignal(session: PreferenceSession, input: PreferenceSignalInput): PreferenceSession {
  if (!isResidenceId(input.residenceId) || !signalTypes.includes(input.type)) return session
  if (input.type === 'favorite') {
    return session.favorites.includes(input.residenceId) ? session : toggleFavorite(session, input.residenceId, input.timestamp)
  }
  const { residenceId, type } = input
  const timestamp = input.timestamp ?? Date.now()
  if (!Number.isFinite(timestamp)) return session
  let key = input.key?.trim()
  let weight = 0
  const existing = session.signals.filter((signal) => signal.residenceId === residenceId && signal.type === type)

  if (type === 'view') {
    // A duplicate event at the same instant is not a deliberate return.
    if (existing.some((signal) => signal.timestamp === timestamp)) return session
    weight = existing.length ? 2 : 0
  } else if (type === 'compare') {
    if (existing.length) return session
    weight = 2
  } else if (type === 'hotspot-open') {
    if (!key || !residenceById[residenceId].hotspots.some((hotspot) => hotspot.id === key)) return session
    if (existing.some((signal) => signal.key === key)) return session
    weight = 1
  } else if (type === 'feature-focus') {
    if (!key || existing.some((signal) => signal.key === key)) return session
    weight = 2
  } else if (type === 'time-spent') {
    // Callers pass elapsed seconds; each complete 15 s interval counts once.
    const seconds = Number(key)
    if (!Number.isFinite(seconds) || seconds < 15 || existing.length >= 3) return session
    key = String(Math.min(3, Math.floor(seconds / 15)))
    if (existing.some((signal) => signal.key === key)) return session
    weight = 1
  }

  return { ...session, signals: [...session.signals, { residenceId, type, key, weight, timestamp }] }
}

function exploredTags(session: PreferenceSession): Set<string> {
  const tags = new Set<string>()
  for (const signal of session.signals) {
    if (signal.type === 'feature-focus' && signal.key) tags.add(signal.key)
    if (signal.type === 'hotspot-open') {
      const hotspot = residenceById[signal.residenceId].hotspots.find((item) => item.id === signal.key)
      for (const tag of hotspot?.tags ?? []) tags.add(tag)
    }
  }
  return tags
}

export function scoreResidences(session: PreferenceSession): RankedResidence[] {
  const tags = exploredTags(session)
  return residences.map((residence): RankedResidence => {
    const signals = session.signals.filter((signal) => signal.residenceId === residence.id && signal.type !== 'favorite')
    const favorite = session.favorites.includes(residence.id)
    const matches = residence.lifestyleTags.filter((tag) => tags.has(tag))
    const affinityScore = matches.length * 2
    const score = (favorite ? 5 : 0) + signals.reduce((total, signal) => total + signal.weight, 0) + affinityScore
    const explanations: { weight: number; text: string }[] = []
    if (favorite) explanations.push({ weight: 5, text: 'Você marcou esta residência como favorita.' })
    const hotspots = signals.filter((signal) => signal.type === 'hotspot-open').length
    const returns = signals.filter((signal) => signal.type === 'view').length - 1
    const selected = signals.filter((signal) => signal.type === 'feature-focus').length
    const time = signals.filter((signal) => signal.type === 'time-spent').length
    if (hotspots) explanations.push({ weight: hotspots, text: `Você abriu ${hotspots} ${hotspots === 1 ? 'ambiente' : 'ambientes'} deste estudo.` })
    if (returns > 0) explanations.push({ weight: returns * 2, text: 'Você voltou para explorar esta residência.' })
    if (selected) explanations.push({ weight: selected * 2, text: 'Você escolheu interesses nesta interpretação conceitual.' })
    if (time) explanations.push({ weight: time, text: 'Você dedicou tempo à exploração desta residência.' })
    if (signals.some((signal) => signal.type === 'compare')) explanations.push({ weight: 2, text: 'Você incluiu esta residência na comparação.' })
    if (matches.length) explanations.push({ weight: affinityScore, text: `Seu interesse por ${matches.join(' e ')} dialoga com a atmosfera conceitual deste estudo.` })
    explanations.sort((a, b) => b.weight - a.weight)
    return {
      residenceId: residence.id,
      score,
      explorationCount: signals.filter((signal) => signal.type !== 'compare').length,
      reasons: explanations.slice(0, 3).map((item) => item.text),
    }
  }).sort((a, b) => b.score - a.score || b.explorationCount - a.explorationCount || residences.findIndex((item) => item.id === a.residenceId) - residences.findIndex((item) => item.id === b.residenceId))
}

export function getRecommendation(session: PreferenceSession): Recommendation | null {
  const substantive = session.signals.filter((signal) => signal.type !== 'view' && signal.type !== 'favorite')
  const hasReturn = residences.some((residence) => session.signals.filter((signal) => signal.residenceId === residence.id && signal.type === 'view').length > 1)
  // One first visit or one opened room is not sufficient evidence of a preference.
  const sufficient = session.favorites.length > 0 || hasReturn || substantive.length >= 2 || substantive.some((signal) => signal.type === 'compare' || signal.type === 'feature-focus')
  if (!sufficient) return null
  const rankings = scoreResidences(session)
  return rankings[0].score > 0 ? { ...rankings[0], rankings } : null
}

function browserStorage(): Storage | undefined {
  try { return typeof window === 'undefined' ? undefined : window.sessionStorage } catch { return undefined }
}

export function saveSession(session: PreferenceSession, storage = browserStorage()): boolean {
  try {
    if (!storage) return false
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    return true
  } catch { return false }
}

/** Reject malformed or obsolete snapshots. Recompute weights on restore. */
export function loadSession(storage = browserStorage()): PreferenceSession {
  try {
    const raw = storage?.getItem(SESSION_STORAGE_KEY)
    if (!raw) return createSession()
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return createSession()
    const snapshot = parsed as Record<string, unknown>
    if (snapshot.version !== 1 || !Array.isArray(snapshot.signals) || !Array.isArray(snapshot.favorites)) return createSession()
    let session = createSession()
    for (const entry of snapshot.signals) {
      if (!entry || typeof entry !== 'object') continue
      const signal = entry as Record<string, unknown>
      if (!isResidenceId(signal.residenceId) || !signalTypes.includes(signal.type as PreferenceSignalType) || typeof signal.timestamp !== 'number' || !Number.isFinite(signal.timestamp)) continue
      if (signal.type === 'favorite') continue
      // Persisted time keys are interval numbers, input keys are elapsed seconds.
      const key = signal.type === 'time-spent' && typeof signal.key === 'string' ? String(Number(signal.key) * 15) : typeof signal.key === 'string' ? signal.key : undefined
      session = recordSignal(session, { residenceId: signal.residenceId, type: signal.type as PreferenceSignalType, timestamp: signal.timestamp, key })
    }
    for (const id of snapshot.favorites) if (isResidenceId(id) && !session.favorites.includes(id)) session = toggleFavorite(session, id, 0)
    return session
  } catch { return createSession() }
}
