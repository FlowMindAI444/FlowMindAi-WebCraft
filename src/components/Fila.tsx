import { useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

/**
 * Fila numerada del menú de servicios, extraída para reutilizarse en todas las
 * listas de selección: número, icono, título, descripción y flecha.
 */
export function Fila({
  num,
  titulo,
  desc,
  icono,
  badge,
  seleccionada = false,
  desactivada = false,
  grande = false,
  onClick,
}: {
  num: string
  titulo: string
  desc?: string
  icono?: ReactNode
  badge?: string
  seleccionada?: boolean
  desactivada?: boolean
  grande?: boolean
  onClick?: () => void
}) {
  const clases = [
    'fila',
    grande ? 'fila--grande' : '',
    seleccionada ? 'es-seleccionada' : '',
    desactivada ? 'es-desactivada' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      data-fila
      className={clases}
      onClick={onClick}
      disabled={desactivada}
      aria-pressed={onClick && !desactivada ? seleccionada : undefined}
    >
      <span className="fila-interior">
        {icono ? (
          <span className="fila-icono" aria-hidden="true">
            {icono}
          </span>
        ) : null}
        <span className="fila-cuerpo">
          <span className="fila-num">{num}</span>
          <span className="fila-titulo">{titulo}</span>
          {desc ? <span className="fila-desc">{desc}</span> : null}
        </span>
        {badge ? <span className="fila-badge">{badge}</span> : null}
        {!desactivada ? (
          <span className="fila-flecha" aria-hidden="true">
            →
          </span>
        ) : null}
      </span>
    </button>
  )
}

/** Contenedor de filas con navegación por teclado (flechas, inicio y fin). */
export function ListaSeleccion({
  etiqueta,
  children,
  className,
}: {
  etiqueta: string
  children: ReactNode
  className?: string
}) {
  const contenedor = useRef<HTMLDivElement>(null)

  function alTeclado(evento: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(evento.key)) return
    const filas = Array.from(
      contenedor.current?.querySelectorAll<HTMLButtonElement>('button[data-fila]:not([disabled])') ??
        [],
    )
    if (filas.length === 0) return

    evento.preventDefault()
    const actual = filas.indexOf(document.activeElement as HTMLButtonElement)
    let destino = 0
    if (evento.key === 'ArrowDown') destino = actual < 0 ? 0 : (actual + 1) % filas.length
    if (evento.key === 'ArrowUp') destino = actual <= 0 ? filas.length - 1 : actual - 1
    if (evento.key === 'End') destino = filas.length - 1
    filas[destino].focus()
  }

  return (
    <div
      ref={contenedor}
      className={`lista${className ? ` ${className}` : ''}`}
      role="group"
      aria-label={etiqueta}
      onKeyDown={alTeclado}
    >
      {children}
    </div>
  )
}
