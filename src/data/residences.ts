export type Confidence = 'confirmed' | 'inferred' | 'placeholder'
export type ResidenceId = 'casa-1' | 'casa-2' | 'casa-3' | 'casa-4'

export type ResidenceFeature<T> = {
  value: T | null
  confidence: Confidence
  source?: string
}

export type ResidenceHotspot = {
  id: string
  label: string
  roomType: string
  position: { x: number; y: number; z?: number }
  image?: string
  description?: string
  tags: string[]
}

export type Residence = {
  id: ResidenceId
  name: string
  tagline: string
  status: Confidence
  description: string
  conceptualNotice: string
  features: {
    bedrooms: ResidenceFeature<number>
    suites: ResidenceFeature<number>
    bathrooms: ResidenceFeature<number>
    parkingSpaces: ResidenceFeature<number>
    builtAreaM2: ResidenceFeature<number>
    lotSize: ResidenceFeature<string>
    livingRoom: ResidenceFeature<boolean>
    kitchen: ResidenceFeature<boolean>
  }
  profile: {
    household: ResidenceFeature<string>
    incomeRange: ResidenceFeature<string>
  }
  /** Tags describe the exploratory concept, never approved architecture. */
  lifestyleTags: string[]
  tagNotice: string
  visual: {
    layout: 'compact' | 'linear' | 'courtyard' | 'split'
    roof: 'gable' | 'flat' | 'mono'
    tone: 'sand' | 'ivory' | 'terracotta' | 'leaf'
  }
  media: {
    hero: string
    planImage?: string
    gallery: string[]
    exteriorAngles: string[]
    floorPlan?: string
    openTop?: string
    constructionStages: string[]
    interiors: string[]
    editorialGifs: string[]
    model3d?: string
    referenceFloorPlan?: {
      src: string
      caption: string
      associationConfidence: 'inferred'
    }
  }
  mediaMetadata: { confidence: Confidence; source: string; alt: string }
  hotspots: ResidenceHotspot[]
  hypotheses: string[]
}

const unknown = <T>(): ResidenceFeature<T> => ({ value: null, confidence: 'placeholder' })
const confirmed = <T>(value: T): ResidenceFeature<T> => ({
  value,
  confidence: 'confirmed',
  source: 'Pacote SpecDrive, 01-product-spec.md, seção 7',
})
const inferred = <T>(value: T, source: string): ResidenceFeature<T> => ({ value, confidence: 'inferred', source })
const blankProfile = (): Residence['profile'] => ({ household: unknown<string>(), incomeRange: unknown<string>() })

const blankFeatures = (): Residence['features'] => ({
  bedrooms: unknown<number>(),
  suites: unknown<number>(),
  bathrooms: unknown<number>(),
  parkingSpaces: unknown<number>(),
  builtAreaM2: unknown<number>(),
  lotSize: unknown<string>(),
  livingRoom: unknown<boolean>(),
  kitchen: unknown<boolean>(),
})

const conceptualNotice = 'Estudo visual conceitual. Proporções, materiais e implantação a confirmar.'
const tagNotice = 'Interesses conceituais para explorar; não são características arquitetônicas confirmadas.'

const pilotHotspots: ResidenceHotspot[] = [
  {
    id: 'living', label: 'Sala', roomType: 'living', position: { x: 0.29, y: 0.69 },
    image: '/assets/concept-living.webp',
    description: 'Um estudo de convivência. Imagem e disposição conceituais.', tags: ['convivência', 'luz'],
  },
  {
    id: 'kitchen', label: 'Cozinha', roomType: 'kitchen', position: { x: 0.68, y: 0.7 },
    image: '/assets/concept-kitchen.webp',
    description: 'Um olhar para os encontros do dia a dia. Imagem e disposição conceituais.', tags: ['convivência'],
  },
  {
    id: 'bedroom', label: 'Quarto', roomType: 'bedroom', position: { x: 0.32, y: 0.3 },
    image: '/assets/concept-bedroom.webp',
    description: 'Uma pausa para imaginar seu ritmo. Imagem e disposição conceituais.', tags: ['contemplação', 'luz'],
  },
  {
    id: 'bath', label: 'Banheiro', roomType: 'bath', position: { x: 0.71, y: 0.32 },
    image: '/assets/concept-bath.webp',
    description: 'Uma atmosfera de cuidado. Imagem e disposição conceituais.', tags: ['contemplação'],
  },
]

const studyPositions: Record<Exclude<ResidenceId, 'casa-1'>, [number, number][]> = {
  'casa-2': [[0.25, 0.90], [0.75, 0.90], [0.25, 0.10], [0.75, 0.10]],
  'casa-3': [[0.14, 0.75], [0.48, 0.20], [0.14, 0.20], [0.83, 0.20]],
  'casa-4': [[0.25, 0.85], [0.75, 0.85], [0.25, 0.12], [0.75, 0.12]],
}

const studyHotspots = (id: Exclude<ResidenceId, 'casa-1'>): ResidenceHotspot[] => pilotHotspots.map((hotspot, index) => ({
  ...hotspot,
  label: `Estudo · ${hotspot.label.toLocaleLowerCase('pt-BR')}`,
  description: 'Ambiente ilustrativo para explorar a experiência. Existência, configuração e materiais a confirmar.',
  tags: [...hotspot.tags],
  position: { x: studyPositions[id][index][0], y: studyPositions[id][index][1] },
}))

const mediaFor = (id: ResidenceId): Residence['media'] => ({
  hero: '/assets/concept-exterior.webp',
  gallery: ['/assets/concept-exterior.webp', '/assets/concept-living.webp', '/assets/concept-bedroom.webp'],
  exteriorAngles: [0, 90, 180, 270].map((angle) => `procedural://${id}/exterior/${angle}`),
  floorPlan: `procedural://${id}/floor-plan`,
  openTop: `procedural://${id}/open-top`,
  constructionStages: ['terrain', 'plan', 'structure', 'complete'].map((stage) => `procedural://${id}/${stage}`),
  interiors: pilotHotspots.map((hotspot) => hotspot.image!),
  editorialGifs: ['exterior', 'living', 'kitchen', 'bedroom', 'bath'].map((name) => `/assets/editorial-${name}.gif`),
})

const mediaMetadata: Residence['mediaMetadata'] = {
  confidence: 'placeholder',
  source: 'Ilustrações e cena procedimental conceituais do protótipo; não derivadas de projeto executivo.',
  alt: 'Estudo conceitual de residência, com materiais e proporções a confirmar.',
}

const allResidences: Residence[] = [
  {
    id: 'casa-1', name: 'Casa Buriti', tagline: 'Seu tempo, seu lugar.', status: 'confirmed',
    description: 'Conheça a casa-piloto e explore seus ambientes no seu ritmo.',
    conceptualNotice,
    features: { ...blankFeatures(), bedrooms: confirmed(2), bathrooms: confirmed(1), livingRoom: confirmed(true), kitchen: confirmed(true) },
    profile: { ...blankProfile(), household: inferred('2 a 4 pessoas', 'Hipótese de público solicitada para o protótipo; validar com o cliente.') },
    lifestyleTags: ['convivência', 'contemplação'], tagNotice,
    visual: { layout: 'compact', roof: 'gable', tone: 'sand' },
    media: { ...mediaFor('casa-1'), planImage: '/assets/casa1/planta.png', hero: '/assets/casa1/fachada-gerada.png', gallery: ['/assets/casa1/fachada-gerada.png', '/assets/casa1/fachada-frontal.jpeg', '/assets/casa1/fachada-lateral.jpeg', '/assets/casa1/ambientacao-sala.png', '/assets/casa1/familia-sala.png', '/assets/casa1/sala-cozinha.jpeg', '/assets/casa1/quarto.jpeg'] }, mediaMetadata: { ...mediaMetadata, source: 'Referências fornecidas pelo cliente em 13/10/2026, imagens geradas a partir da leitura da planta e cena procedimental conceitual.' }, hotspots: pilotHotspots, hypotheses: [],
  },
  {
    id: 'casa-2', name: 'Casa Rio Corrente', tagline: 'Outras formas de pertencer.', status: 'confirmed',
    description: 'Explore uma interpretação visual provisória deste modelo.',
    conceptualNotice,
    features: { ...blankFeatures(), bedrooms: confirmed(3), suites: confirmed(1) },
    profile: blankProfile(), lifestyleTags: ['luz', 'convivência'], tagNotice,
    visual: { layout: 'linear', roof: 'flat', tone: 'ivory' },
    media: {
      ...mediaFor('casa-2'), hero: '/assets/casa2/fachada-aerea-gerada.png', planImage: '/assets/casa2/planta.png',
      gallery: ['/assets/casa2/fachada-aerea-gerada.png', '/assets/casa2/ambientacao-sala.png', '/assets/casa2/familia-cozinha.png', '/assets/casa2/planta.png'],
      referenceFloorPlan: {
        src: '/assets/floor-plan-reference-provisional.webp',
        caption: 'Referência recebida · associação a confirmar',
        associationConfidence: 'inferred',
      },
    },
    mediaMetadata, hotspots: studyHotspots('casa-2'),
    hypotheses: ['A planta recebida aparenta três espaços de dormir, dois sanitários, ambientes integrados e jardins. Sua associação a este modelo não está confirmada.'],
  },
  {
    id: 'casa-3', name: 'Casa Vereda', tagline: 'Um encontro com a natureza.', status: 'placeholder',
    description: 'Um território visual para descobrir. Informações do modelo a confirmar.',
    conceptualNotice,
    features: blankFeatures(), profile: blankProfile(), lifestyleTags: ['natureza', 'contemplação'], tagNotice,
    visual: { layout: 'courtyard', roof: 'mono', tone: 'terracotta' },
    media: { ...mediaFor('casa-3'), hero: '/assets/casa3/fachada-gerada.png', planImage: '/assets/casa3/planta.png', gallery: ['/assets/casa3/fachada-gerada.png', '/assets/casa3/casa-panoramica-transparente.png', '/assets/casa3/ambientacao-sala.png', '/assets/casa3/familia-varanda.png', '/assets/casa3/planta.png'] }, mediaMetadata, hotspots: studyHotspots('casa-3'), hypotheses: [],
  },
  {
    id: 'casa-4', name: 'Casa 4', tagline: 'Espaço para imaginar.', status: 'placeholder',
    description: 'Outra atmosfera para explorar. Informações do modelo a confirmar.',
    conceptualNotice,
    features: blankFeatures(), profile: blankProfile(), lifestyleTags: ['natureza', 'luz'], tagNotice,
    visual: { layout: 'split', roof: 'flat', tone: 'leaf' },
    media: mediaFor('casa-4'), mediaMetadata, hotspots: studyHotspots('casa-4'), hypotheses: [],
  },
]

// The public catalog contains exactly the three client-supplied homes. Casa 4
// remains in the internal map only for compatibility with older saved sessions.
export const residences: Residence[] = allResidences.filter((residence) => residence.id !== 'casa-4')
export const residenceById = Object.fromEntries(allResidences.map((residence) => [residence.id, residence])) as Record<ResidenceId, Residence>

// Editorial variations generated in Higgsfield for the three public homes.
// They are intentionally one-per-residence so the home and story cards never
// reuse the same hero image across the catalogue.
export const editorialImageByResidence: Record<'casa-1' | 'casa-2' | 'casa-3', string> = {
  'casa-1': 'https://d8j0ntlcm91z4.cloudfront.net/user_3K6fpbMj6stHvAm1aCZLyswGvP6/hf_20261028_142026_5bd6b227-3f1e-46fd-93ee-77ec03c1be3f.png',
  'casa-2': 'https://d8j0ntlcm91z4.cloudfront.net/user_3K6fpbMj6stHvAm1aCZLyswGvP6/hf_20261028_142027_5096288e-0702-4b7d-a244-e2b2856794b7.png',
  'casa-3': 'https://d8j0ntlcm91z4.cloudfront.net/user_3K6fpbMj6stHvAm1aCZLyswGvP6/hf_20261028_142029_fc805aff-aa0a-4059-829b-023a4c798475.png',
}


export function getConfirmedFeatureLabel<T>(feature: ResidenceFeature<T>, unit: string): string {
  if (feature.confidence !== 'confirmed' || feature.value === null) return 'A confirmar'
  if (typeof feature.value === 'boolean') return feature.value ? 'Sim' : 'Não'
  return `${feature.value} ${unit}`.trim()
}

export function getResidenceSummary(residence: Residence): string {
  const { bedrooms, bathrooms, suites } = residence.features
  const parts: string[] = []
  if (bedrooms.confidence === 'confirmed' && bedrooms.value !== null) parts.push(`${bedrooms.value} quartos`)
  if (bathrooms.confidence === 'confirmed' && bathrooms.value !== null) parts.push(`${bathrooms.value} ${bathrooms.value === 1 ? 'banheiro' : 'banheiros'}`)
  if (suites.confidence === 'confirmed' && suites.value !== null) parts.push(`${suites.value} ${suites.value === 1 ? 'suíte' : 'suítes'}`)
  return parts.length ? parts.join(' · ') : 'Informações a confirmar'
}
