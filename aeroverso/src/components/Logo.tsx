export default function Logo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <div style={{display:'flex', justifyContent:'center', padding:'1rem 0',}}>
      <div style={{position:'relative', width:'60px', height:'240px', display:'flex', alignItems:'center', justifyContent:'center',}}>
        <svg width="120" height="120" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#1d4ed8" strokeWidth="1.8" opacity="0.85"></circle>
          <circle cx="50" cy="12" r="9" fill="#1d4ed8" opacity="0.08"></circle>
          <circle cx="50" cy="12" r="6.5" fill="#1d4ed8" opacity="0.18"></circle>
          <circle cx="50" cy="12" r="4" fill="#1d4ed8" opacity="0.4"></circle>
          <circle cx="50" cy="12" r="2.2" fill="#3b82f6"></circle>
          <path d="M50,18 L57,52 L83,72 L58,66 L50,84 L42,66 L17,72 L43,52 Z" fill="#f2f5fa"></path>
        </svg>
      </div>
  </div>
  )
}