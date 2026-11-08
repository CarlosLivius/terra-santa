export type ResponsiveImageSource = {
  src: string
  srcSet: string
  fallback: string
}

const responsive = (name: string): ResponsiveImageSource => ({
  src: `/assets/concept-${name}.webp`,
  srcSet: [400, 700, 1100].map((width) => `/assets/concept-${name}-${width}.webp ${width}w`).join(', '),
  fallback: `/assets/concept-${name}.jpg`,
})

/** Derivatives remain replaceable without changing gallery or room components. */
export const imageSources: Record<string, ResponsiveImageSource> = Object.fromEntries(
  ['exterior', 'living', 'kitchen', 'bedroom', 'bath'].map((name) => {
    const source = responsive(name)
    return [source.src, source]
  }),
)

export function getImageSource(src: string): ResponsiveImageSource | undefined {
  return imageSources[src]
}
