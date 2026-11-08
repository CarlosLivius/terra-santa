export default function Topography({ className = '' }: { className?: string }) {
  return <svg className={`topography ${className}`} viewBox="0 0 1100 900" fill="none" aria-hidden="true">
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${-200+i*37} ${700+i*23} C ${-80+i*14} ${400-i*13}, ${220+i*20} ${690-i*37}, ${260+i*31} ${420-i*29} S ${520+i*33} ${220-i*26}, ${720+i*26} ${220-i*25} S ${1060+i*28} ${310-i*39}, ${1200+i*28} ${-50-i*20}`} />)}
  </svg>;
}
