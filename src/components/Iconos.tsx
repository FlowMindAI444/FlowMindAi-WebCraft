/** Mismo trazo fino que el menú de servicios, a 20px. */
export const propsIcono = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
} as const

export function IconoLanding() {
  return (
    <svg {...propsIcono}>
      <rect x="5" y="2.5" width="14" height="19" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="10.5" x2="13" y2="10.5" />
      <rect x="8" y="14" width="6" height="3" />
    </svg>
  )
}

export function IconoPortafolio() {
  return (
    <svg {...propsIcono}>
      <rect x="3" y="4" width="7.5" height="7.5" />
      <rect x="13.5" y="4" width="7.5" height="7.5" />
      <rect x="3" y="14" width="7.5" height="6" />
      <rect x="13.5" y="14" width="7.5" height="6" />
    </svg>
  )
}

export function IconoSitio() {
  return (
    <svg {...propsIcono}>
      <rect x="3" y="3" width="14" height="14" />
      <path d="M7 21h14V7" />
    </svg>
  )
}

export function IconoAgendar() {
  return (
    <svg {...propsIcono}>
      <rect x="3.5" y="5" width="17" height="15" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
      <line x1="8" y1="3" x2="8" y2="6.5" />
      <line x1="16" y1="3" x2="16" y2="6.5" />
      <path d="m9 14.5 2 2 4-4" />
    </svg>
  )
}

export function IconoCaptar() {
  return (
    <svg {...propsIcono}>
      <rect x="4" y="3.5" width="16" height="17" />
      <line x1="7.5" y1="8" x2="16.5" y2="8" />
      <line x1="7.5" y1="12" x2="16.5" y2="12" />
      <rect x="7.5" y="15.5" width="6" height="2.5" />
    </svg>
  )
}

export function IconoVender() {
  return (
    <svg {...propsIcono}>
      <path d="M4 7h16l-1.5 12.5h-13Z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  )
}

export function IconoMostrar() {
  return (
    <svg {...propsIcono}>
      <rect x="3" y="5" width="18" height="14" />
      <path d="m3 16 5-4.5 4 3.5 3.5-3 5.5 4.5" />
      <line x1="7.5" y1="8.5" x2="9.5" y2="8.5" />
    </svg>
  )
}

export function IconoArrastre() {
  return (
    <svg {...propsIcono} width={14} height={14}>
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  )
}

export function IconoQuitar() {
  return (
    <svg {...propsIcono} width={14} height={14}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  )
}

export function Palomita({ tamano = 12 }: { tamano?: number }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden="true"
    >
      <path d="m4 13 5.5 5.5L20 6" />
    </svg>
  )
}
