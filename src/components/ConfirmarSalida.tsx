import { useEffect, useRef } from 'react'

/** Aviso antes de abandonar el flujo: al salir el spec se reinicia. */
export function ConfirmarSalida({
  onCancelar,
  onSalir,
}: {
  onCancelar: () => void
  onSalir: () => void
}) {
  const dialogo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dialogo.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="confirmar-fondo" onClick={onCancelar}>
      <div
        ref={dialogo}
        className="confirmar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmar-texto"
        tabIndex={-1}
        onClick={(evento) => evento.stopPropagation()}
        onKeyDown={(evento) => {
          if (evento.key === 'Escape') onCancelar()
        }}
      >
        <p className="confirmar-texto" id="confirmar-texto">
          Vas a salir y se perderá lo que llevas. ¿Continuar?
        </p>

        <div className="confirmar-acciones">
          <button type="button" className="boton-texto" onClick={onCancelar}>
            CANCELAR
          </button>
          <button
            type="button"
            className="boton-primario boton-primario--chico"
            onClick={onSalir}
          >
            SALIR
          </button>
        </div>
      </div>
    </div>
  )
}
