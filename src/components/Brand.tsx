export default function Brand({ large = false }: { large?: boolean }) {
  return <span className={`brand ${large ? 'brand-large' : ''}`}>
    <img src="/assets/brand-tree.webp" width="80" height="64" alt="" />
    <span>Terra Santa<small>INCORPORADORA</small></span>
  </span>;
}
