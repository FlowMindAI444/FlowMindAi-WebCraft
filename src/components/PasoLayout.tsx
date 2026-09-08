import type { ReactNode } from 'react'
import { MicroEtiqueta } from './MicroEtiqueta'
import { PASOS } from '../lib/pasos'

/** Panel derecho del paso: encabezado, cuerpo y la acción de continuar. */
export function PasoLayout({
  paso,
  ancho = 'normal',
  ayuda,
  children,
  onContinuar,
}: {
  paso: number
  ancho?: 'normal' | 'ancho'
  ayuda?: string
  children: ReactNode
  onContinuar: () => void
}) {
  const info = PASOS[paso - 1]
  const numero = String(paso).padStart(2, '0')

  return (
    <div className={`paso-panel paso-panel--${ancho}`}>
      <div className="paso-encabezado">
        <MicroEtiqueta centrado>{`${numero} — ${info.nombre.toUpperCase()}`}</MicroEtiqueta>
        <h1 className="titulo">{info.titulo}</h1>
        {ayuda ? <p className="paso-ayuda">{ayuda}</p> : null}
      </div>

      <div className="paso-cuerpo">{children}</div>

      <div className="paso-acciones">
        <button type="button" className="boton-primario" onClick={onContinuar}>
          CONTINUAR →
        </button>
      </div>
    </div>
  )
}
