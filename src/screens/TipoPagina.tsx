import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Fila, ListaSeleccion } from '../components/Fila'
import { IconoLanding, IconoPortafolio, IconoSitio } from '../components/Iconos'
import { MicroEtiqueta } from '../components/MicroEtiqueta'
import { Pantalla } from '../components/Pantalla'
import { RUTA_PRIMER_PASO } from '../lib/pasos'
import { TIPOS_PAGINA } from '../lib/presets'
import { useSpec } from '../store/useSpec'

const ICONOS = {
  landing: <IconoLanding />,
  portafolio: <IconoPortafolio />,
  sitio: <IconoSitio />,
}

export function TipoPagina() {
  const { spec, reiniciarSpec } = useSpec()
  const navigate = useNavigate()

  // Elegir el tipo de página abre un intento nuevo: se entra con el spec limpio.
  useEffect(() => {
    reiniciarSpec()
  }, [reiniciarSpec])

  return (
    <Pantalla tag="TIPO DE PÁGINA" conAtras>
      <section className="hero">
        <div className="hero-copy">
          <MicroEtiqueta centrado>02 — ELIGE UN TIPO</MicroEtiqueta>
          <h1 className="titulo">Qué tipo de página</h1>
        </div>
      </section>

      <ListaSeleccion etiqueta="Tipos de página" className="lista--menu">
        {TIPOS_PAGINA.map((tipo) => (
          <Fila
            key={tipo.id}
            grande
            num={tipo.num}
            titulo={tipo.titulo}
            desc={tipo.desc || undefined}
            icono={ICONOS[tipo.id]}
            badge={tipo.disponible ? undefined : 'PRÓXIMAMENTE'}
            desactivada={!tipo.disponible}
            seleccionada={tipo.disponible && spec.arquetipo === tipo.id}
            onClick={tipo.disponible ? () => navigate(RUTA_PRIMER_PASO) : undefined}
          />
        ))}
      </ListaSeleccion>
    </Pantalla>
  )
}
