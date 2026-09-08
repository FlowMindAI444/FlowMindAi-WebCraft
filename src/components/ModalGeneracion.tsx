import { useEffect, useRef, useState } from 'react'
import { Palomita } from './Iconos'
import { MicroEtiqueta } from './MicroEtiqueta'

const MENSAJES = ['Redactando el contenido…', 'Armando las secciones…', 'Publicando…']
const ESPERA = 1200
const URL_DEMO = 'demo-cliente.pages.dev'

export function ModalGeneracion({ onCerrar }: { onCerrar: () => void }) {
  const [listos, setListos] = useState(0)
  const dialogo = useRef<HTMLDivElement>(null)
  const terminado = listos >= MENSAJES.length

  useEffect(() => {
    dialogo.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (terminado) return
    const temporizador = window.setTimeout(() => setListos((previos) => previos + 1), ESPERA)
    return () => window.clearTimeout(temporizador)
  }, [listos, terminado])

  return (
    <div
      ref={dialogo}
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label="Generando la página"
      tabIndex={-1}
      onKeyDown={(evento) => {
        if (evento.key === 'Escape') onCerrar()
      }}
    >
      <div className="modal-barra">
        <MicroEtiqueta>{terminado ? 'Listo' : 'Generando'}</MicroEtiqueta>
        <button type="button" className="boton-texto" onClick={onCerrar}>
          CERRAR
        </button>
      </div>

      <div className="modal-cuerpo">
        <ol className="modal-pasos" aria-live="polite">
          {MENSAJES.map((mensaje, indice) => {
            const completo = indice < listos
            const enCurso = indice === listos
            return (
              <li
                key={mensaje}
                className={`modal-paso${completo ? ' es-completo' : ''}${
                  enCurso ? ' es-en-curso' : ''
                }`}
              >
                <span className="modal-paso-marca" aria-hidden="true">
                  {completo ? <Palomita tamano={14} /> : null}
                </span>
                {mensaje}
              </li>
            )
          })}
        </ol>

        {terminado ? (
          <div className="modal-final">
            <span className="modal-palomita" aria-hidden="true">
              <Palomita tamano={48} />
            </span>
            <h2 className="titulo titulo--modal">Tu página está lista</h2>
            <p className="mono modal-url">{URL_DEMO}</p>
            <button type="button" className="boton-primario">
              VER SITIO
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
