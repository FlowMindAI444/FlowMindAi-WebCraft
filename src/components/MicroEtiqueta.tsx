import type { ReactNode } from 'react'

/** "—— 03 — ESTILO": línea corta + texto en mayúsculas, 11px, tracked. */
export function MicroEtiqueta({
  children,
  centrado = false,
  className,
}: {
  children: ReactNode
  centrado?: boolean
  className?: string
}) {
  return (
    <p className={`micro${centrado ? ' micro--centrado' : ''}${className ? ` ${className}` : ''}`}>
      <span className="micro-linea" aria-hidden="true" />
      {children}
    </p>
  )
}
