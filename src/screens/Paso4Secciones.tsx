import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconoArrastre } from '../components/Iconos'
import { Interruptor } from '../components/Interruptor'
import { PasoLayout } from '../components/PasoLayout'
import { rutaSiguiente } from '../lib/pasos'
import { DESCRIPCION_SECCION } from '../lib/presets'
import { validarPaso4 } from '../lib/spec'
import { useErrores } from '../store/useErrores'
import { useSpec } from '../store/useSpec'

export function Paso4Secciones() {
  const { spec, establecerSecciones } = useSpec()
  const { errores, setErrores } = useErrores()
  const [arrastrada, setArrastrada] = useState<number | null>(null)
  const navigate = useNavigate()

  const secciones = spec.secciones

  /** Hero y footer están bloqueados: no se mueven ni se apagan. */
  function movible(indice: number) {
    return Boolean(secciones[indice]) && !secciones[indice].bloqueada
  }

  function mover(desde: number, hasta: number) {
    if (desde === hasta || !movible(desde) || !movible(hasta)) return
    const orden = [...secciones]
    const [seccion] = orden.splice(desde, 1)
    orden.splice(hasta, 0, seccion)
    establecerSecciones(orden)
  }

  function alternar(indice: number, activa: boolean) {
    establecerSecciones(
      secciones.map((seccion, posicion) => (posicion === indice ? { ...seccion, activa } : seccion)),
    )
    setErrores({})
  }

  function alTecladoHandle(evento: KeyboardEvent<HTMLButtonElement>, indice: number) {
    if (evento.key !== 'ArrowUp' && evento.key !== 'ArrowDown') return
    evento.preventDefault()
    const destino = evento.key === 'ArrowUp' ? indice - 1 : indice + 1
    mover(indice, destino)
  }

  function continuar() {
    const encontrados = validarPaso4(spec)
    setErrores(encontrados)
    if (Object.keys(encontrados).length === 0) navigate(rutaSiguiente(4))
  }

  return (
    <PasoLayout
      paso={4}
      ayuda="Preseleccionamos las secciones según tu objetivo. Puedes quitarlas o reordenarlas."
      onContinuar={continuar}
    >
      <ol className="secciones">
        {secciones.map((seccion, indice) => (
          <li
            key={seccion.id}
            className={[
              'seccion',
              seccion.bloqueada ? 'es-bloqueada' : '',
              seccion.activa ? '' : 'es-apagada',
              arrastrada === indice ? 'es-arrastrando' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            draggable={!seccion.bloqueada}
            onDragStart={(evento) => {
              evento.dataTransfer.effectAllowed = 'move'
              evento.dataTransfer.setData('text/plain', seccion.id)
              setArrastrada(indice)
            }}
            onDragOver={(evento) => {
              evento.preventDefault()
              evento.dataTransfer.dropEffect = 'move'
              if (arrastrada === null || arrastrada === indice) return
              mover(arrastrada, indice)
              setArrastrada(indice)
            }}
            onDrop={(evento) => {
              evento.preventDefault()
              setArrastrada(null)
            }}
            onDragEnd={() => setArrastrada(null)}
          >
            <span className="seccion-handle">
              {seccion.bloqueada ? null : (
                <button
                  type="button"
                  className="handle"
                  aria-label={`Mover ${seccion.nombre}. Usa las flechas arriba y abajo.`}
                  onKeyDown={(evento) => alTecladoHandle(evento, indice)}
                >
                  <IconoArrastre />
                </button>
              )}
            </span>

            <span className="seccion-num">{String(indice + 1).padStart(2, '0')}</span>

            <span className="seccion-cuerpo">
              <span className="seccion-nombre">{seccion.nombre}</span>
              <span className="fila-desc">{DESCRIPCION_SECCION[seccion.id]}</span>
            </span>

            <Interruptor
              activo={seccion.activa}
              bloqueado={seccion.bloqueada}
              etiqueta={`Activar ${seccion.nombre}`}
              onCambio={(activa) => alternar(indice, activa)}
            />
          </li>
        ))}
      </ol>

      {secciones.length === 0 ? (
        <p className="paso-ayuda">
          Elige primero qué quieres lograr para armar la lista de secciones.
        </p>
      ) : null}

      {errores.secciones ? <p className="mensaje-error">{errores.secciones}</p> : null}
    </PasoLayout>
  )
}
