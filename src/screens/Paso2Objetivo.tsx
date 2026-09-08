import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Fila, ListaSeleccion } from '../components/Fila'
import { IconoAgendar, IconoCaptar, IconoMostrar, IconoVender } from '../components/Iconos'
import { PasoLayout } from '../components/PasoLayout'
import { rutaSiguiente } from '../lib/pasos'
import { OBJETIVOS_UI } from '../lib/presets'
import { validarPaso2 } from '../lib/spec'
import type { Objetivo } from '../lib/spec'
import { useErrores } from '../store/useErrores'
import { useSpec } from '../store/useSpec'

const ICONOS: Record<Objetivo, ReactNode> = {
  agendar: <IconoAgendar />,
  captar: <IconoCaptar />,
  vender: <IconoVender />,
  mostrar: <IconoMostrar />,
}

export function Paso2Objetivo() {
  const { spec, elegirObjetivo, seccionesPersonalizadas } = useSpec()
  const { errores, setErrores, limpiar } = useErrores()
  const [porConfirmar, setPorConfirmar] = useState<Objetivo | null>(null)
  const navigate = useNavigate()

  function seleccionar(objetivo: Objetivo) {
    limpiar('objetivo')
    if (objetivo === spec.objetivo) return
    // Cambiar el objetivo reescribe el preset del paso 4: avisar si ya lo tocaron.
    if (spec.objetivo && seccionesPersonalizadas) {
      setPorConfirmar(objetivo)
      return
    }
    elegirObjetivo(objetivo)
  }

  function continuar() {
    const encontrados = validarPaso2(spec)
    setErrores(encontrados)
    if (Object.keys(encontrados).length === 0) navigate(rutaSiguiente(2))
  }

  return (
    <PasoLayout paso={2} onContinuar={continuar}>
      <ListaSeleccion etiqueta="Objetivo de la página">
        {OBJETIVOS_UI.map((opcion) => (
          <Fila
            key={opcion.id}
            num={opcion.num}
            titulo={opcion.titulo}
            desc={opcion.desc}
            icono={ICONOS[opcion.id]}
            seleccionada={spec.objetivo === opcion.id}
            onClick={() => seleccionar(opcion.id)}
          />
        ))}
      </ListaSeleccion>

      {errores.objetivo ? <p className="mensaje-error">{errores.objetivo}</p> : null}

      {porConfirmar ? (
        <div className="aviso" role="alert">
          <p className="aviso-texto">
            Ya reordenaste o desactivaste secciones en el paso 4. Cambiar el objetivo las reemplaza
            por el preset nuevo.
          </p>
          <div className="aviso-acciones">
            <button
              type="button"
              className="boton-primario boton-primario--chico"
              onClick={() => {
                elegirObjetivo(porConfirmar)
                setPorConfirmar(null)
              }}
            >
              REEMPLAZAR
            </button>
            <button type="button" className="boton-texto" onClick={() => setPorConfirmar(null)}>
              CANCELAR
            </button>
          </div>
        </div>
      ) : null}
    </PasoLayout>
  )
}
