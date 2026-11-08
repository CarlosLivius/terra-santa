import { getImageSource } from '../data/imageSources'

export type ConceptImageProps = {
  src: string | undefined
  alt: string
  loading?: 'lazy' | 'eager'
  className?: string
  width?: number
  height?: number
}

export function ConceptImage({ src, alt, loading = 'lazy', className, width, height }: ConceptImageProps) {
  if (!src) return null
  const source = getImageSource(src)
  return (
    <picture>
      {source && <source type="image/webp" srcSet={source.srcSet} sizes="(max-width: 480px) 100vw, (max-width: 900px) 70vw, 1100px" />}
      <img src={source?.fallback ?? src} alt={alt} loading={loading} decoding="async" className={className} width={width} height={height} />
    </picture>
  )
}
