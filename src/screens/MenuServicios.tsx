import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Fila, ListaSeleccion } from '../components/Fila'
import { MicroEtiqueta } from '../components/MicroEtiqueta'
import { Pantalla } from '../components/Pantalla'
import { useSpec } from '../store/useSpec'

type Servicio = {
  id: string
  num: string
  title: string
  desc: string
  icon: ReactNode
  disponible: boolean
}

const iconProps = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
} as const

const services: Servicio[] = [
  {
    id: 'web',
    num: '01',
    title: 'Crear una web',
    desc: 'Sitios y landings a medida, del wireframe al deploy.',
    disponible: true,
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4.5" width="18" height="15" />
        <line x1="3" y1="8.5" x2="21" y2="8.5" />
        <line x1="6" y1="6.5" x2="8" y2="6.5" />
      </svg>
    ),
  },
  {
    id: 'workflow',
    num: '02',
    title: 'Crear un workflow',
    desc: 'Automatizaciones e integraciones que quitan trabajo manual.',
    disponible: false,
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="5.5" height="5.5" />
        <rect x="15.5" y="9.5" width="5.5" height="5.5" />
        <rect x="8" y="16" width="5.5" height="5.5" />
        <path d="M8.5 5.75h5v6.5h2" />
        <path d="M15.5 12.25h-4.75v3.75" />
      </svg>
    ),
  },
  {
    id: 'diseno',
    num: '03',
    title: 'Crear un diseño',
    desc: 'Identidad, interfaz y sistema visual listos para producción.',
    disponible: false,
    icon: (
      <svg {...iconProps}>
        <path d="M12 3 4 10v10h16V10l-8-7Z" />
        <line x1="9" y1="20" x2="9" y2="14" />
        <line x1="15" y1="20" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    id: 'app',
    num: '04',
    title: 'Crear una app',
    desc: 'Producto móvil o web con prototipo funcional antes del código.',
    disponible: false,
    icon: (
      <svg {...iconProps}>
        <rect x="7" y="2.5" width="10" height="19" />
        <line x1="10.5" y1="18.5" x2="13.5" y2="18.5" />
      </svg>
    ),
  },
  {
    id: 'dashboard',
    num: '05',
    title: 'Crear un dashboard',
    desc: 'Métricas conectadas a tus fuentes reales, en una sola vista.',
    disponible: false,
    icon: (
      <svg {...iconProps}>
        <line x1="5" y1="20" x2="5" y2="12" />
        <line x1="9.5" y1="20" x2="9.5" y2="6" />
        <line x1="14" y1="20" x2="14" y2="10" />
        <line x1="18.5" y1="20" x2="18.5" y2="4" />
      </svg>
    ),
  },
  {
    id: 'marca',
    num: '06',
    title: 'Crear una marca',
    desc: 'Nombre, voz y aplicación gráfica con manual de uso.',
    disponible: false,
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4.5" width="18" height="15" />
        <circle cx="8.5" cy="9.5" r="1.6" />
        <path d="m3 17 5.5-5 4.5 4 3.5-3 4.5 4" />
      </svg>
    ),
  },
]

export function MenuServicios() {
  const { spec, reiniciarSpec } = useSpec()
  const navigate = useNavigate()

  // El catálogo es el punto de partida: lo capturado en un intento anterior no
  // se arrastra. Se limpia al entrar, nunca al salir del flujo, para que
  // refrescar dentro de los pasos siga siendo seguro.
  useEffect(() => {
    reiniciarSpec()
  }, [reiniciarSpec])

  return (
    <Pantalla tag="CATÁLOGO DE SERVICIOS">
      <section className="hero">
        <div className="hero-copy">
          <MicroEtiqueta centrado>01 — ELIGE UN SERVICIO</MicroEtiqueta>
          <h1 className="titulo">
            Qué necesitas
            <br />
            construir hoy
          </h1>
        </div>
      </section>

      <ListaSeleccion etiqueta="Servicios" className="lista--menu">
        {services.map((service) => (
          <Fila
            key={service.id}
            grande
            num={service.num}
            titulo={service.title}
            desc={service.desc}
            icono={service.icon}
            badge={service.disponible ? undefined : 'PRÓXIMAMENTE'}
            desactivada={!service.disponible}
            seleccionada={spec.servicio === service.id}
            onClick={service.disponible ? () => navigate('/web') : undefined}
          />
        ))}
      </ListaSeleccion>
    </Pantalla>
  )
}
