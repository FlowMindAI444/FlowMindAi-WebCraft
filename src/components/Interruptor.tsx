/** Switch rectangular, sin radius. */
export function Interruptor({
  activo,
  etiqueta,
  bloqueado = false,
  onCambio,
}: {
  activo: boolean
  etiqueta: string
  bloqueado?: boolean
  onCambio: (activo: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={etiqueta}
      disabled={bloqueado}
      className={`interruptor${activo ? ' es-activo' : ''}${bloqueado ? ' es-bloqueado' : ''}`}
      onClick={() => onCambio(!activo)}
    >
      <span className="interruptor-perilla" aria-hidden="true" />
    </button>
  )
}
