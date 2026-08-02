export default function Logo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      {/* Anel de órbita — remete ao "verso"/universo do nome, sutil ao fundo */}
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
      {/* Aviãozinho de papel — remete à aviação de forma leve, não literal demais */}
      <path
        d="M3 11L21 3L13 21L11 13L3 11Z"
        fill="currentColor"
      />
    </svg>
  )
}