import type { HeroVariante } from '../lib/spec'

/**
 * Wireframe de la composición del hero: logo, navbar, título, botón e imagen.
 * Usa currentColor para que también se lea sobre una fila seleccionada.
 */
export function WireframeHero({ variante }: { variante: HeroVariante }) {
  return (
    <svg
      className="wireframe"
      width="96"
      height="64"
      viewBox="0 0 96 64"
      aria-hidden="true"
      fill="currentColor"
    >
      <rect x="0.5" y="0.5" width="95" height="63" fill="none" stroke="currentColor" strokeOpacity="0.2" />

      {variante === 'fondo' ? <rect x="1" y="1" width="94" height="62" opacity="0.12" /> : null}

      {/* Logo y navbar */}
      <rect x="8" y="8" width="14" height="4" opacity="0.45" />
      <rect x="62" y="9" width="9" height="2" opacity="0.3" />
      <rect x="74" y="9" width="9" height="2" opacity="0.3" />

      {variante === 'centrado' ? (
        <>
          <rect x="24" y="24" width="48" height="7" opacity="0.45" />
          <rect x="32" y="35" width="32" height="3" opacity="0.25" />
          <rect x="38" y="44" width="20" height="7" opacity="0.5" />
        </>
      ) : null}

      {variante === 'dividido' ? (
        <>
          <rect x="8" y="24" width="34" height="6" opacity="0.45" />
          <rect x="8" y="34" width="26" height="3" opacity="0.25" />
          <rect x="8" y="43" width="20" height="7" opacity="0.5" />
          <rect x="52" y="20" width="36" height="34" opacity="0.18" />
        </>
      ) : null}

      {variante === 'fondo' ? (
        <>
          <rect x="8" y="28" width="46" height="6" opacity="0.45" />
          <rect x="8" y="38" width="30" height="3" opacity="0.25" />
          <rect x="8" y="47" width="20" height="7" opacity="0.5" />
        </>
      ) : null}
    </svg>
  )
}
