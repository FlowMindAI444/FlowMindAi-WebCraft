import { useNavigate } from 'react-router-dom'
import { CampoArea, CampoSelect, CampoTexto } from '../components/Campo'
import { PasoLayout } from '../components/PasoLayout'
import { rutaSiguiente } from '../lib/pasos'
import { GIROS } from '../lib/presets'
import { LIMITES, validarPaso1 } from '../lib/spec'
import { useErrores } from '../store/useErrores'
import { useSpec } from '../store/useSpec'

export function Paso1Negocio() {
  const { spec, editarNegocio } = useSpec()
  const { errores, setErrores, limpiar } = useErrores()
  const navigate = useNavigate()

  function continuar() {
    const encontrados = validarPaso1(spec)
    setErrores(encontrados)
    if (Object.keys(encontrados).length === 0) navigate(rutaSiguiente(1))
  }

  return (
    <PasoLayout paso={1} onContinuar={continuar}>
      <div className="campos">
        <CampoTexto
          id="negocio-nombre"
          etiqueta="Nombre del negocio"
          valor={spec.negocio.nombre}
          error={errores.nombre}
          maxLength={60}
          onCambio={(nombre) => {
            editarNegocio({ nombre })
            limpiar('nombre')
          }}
        />

        <CampoSelect
          id="negocio-giro"
          etiqueta="Giro"
          valor={spec.negocio.giro}
          opciones={GIROS}
          onCambio={(giro) => editarNegocio({ giro })}
        />

        <CampoArea
          id="negocio-descripcion"
          etiqueta="En una línea, ¿qué haces?"
          valor={spec.negocio.descripcion}
          error={errores.descripcion}
          maxLength={LIMITES.descripcion}
          onCambio={(descripcion) => {
            editarNegocio({ descripcion })
            limpiar('descripcion')
          }}
        />

        <CampoTexto
          id="negocio-ciudad"
          etiqueta="Ciudad"
          valor={spec.negocio.ciudad}
          maxLength={40}
          onCambio={(ciudad) => editarNegocio({ ciudad })}
        />
      </div>
    </PasoLayout>
  )
}
