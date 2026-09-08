import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { ConfirmarSalida } from './ConfirmarSalida'
import { dentroDelFlujo, RUTA_PRIMER_PASO } from '../lib/pasos'
import { hayCaptura } from '../lib/spec'
import { useSpec } from '../store/useSpec'

/** Header fijo, footer fijo y la vista animada (fade + slide de 12px). */
export function Pantalla({
  tag,
  conAtras = false,
  children,
}: {
  tag: string
  conAtras?: boolean
  children: ReactNode
}) {
  const vista = useRef<HTMLElement>(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { spec } = useSpec()
  // Volver llega al router como POP, tanto desde el botón Atrás como desde el
  // del navegador: de ahí sale la dirección de la transición.
  const direccion = useNavigationType() === 'POP' ? -1 : 1
  const [salida, setSalida] = useState<'atras' | 'inicio' | null>(null)

  // Salir del flujo reinicia el spec, así que con captura hecha se confirma.
  const puedePerderse = dentroDelFlujo(pathname) && hayCaptura(spec)
  // A los pasos siguientes solo se llega empujando desde el anterior: Atrás
  // únicamente deja el flujo cuando se está en el primer paso.
  const atrasSale = puedePerderse && pathname === RUTA_PRIMER_PASO

  useEffect(() => {
    vista.current?.focus({ preventScroll: true })
  }, [])

  function salir() {
    const destino = salida
    setSalida(null)
    if (destino === 'inicio') navigate('/')
    else navigate(-1)
  }

  return (
    <div className="page">
      <header className="nav">
        {conAtras ? (
          <button
            type="button"
            className="nav-atras"
            onClick={() => (atrasSale ? setSalida('atras') : navigate(-1))}
          >
            ← ATRÁS
          </button>
        ) : null}
        <Link
          to="/"
          className="nav-brand"
          onClick={(evento) => {
            if (!puedePerderse) return
            evento.preventDefault()
            setSalida('inicio')
          }}
        >
          <span className="nav-logo">ESTUDIO</span>
          <span className="nav-dot" aria-hidden="true" />
          <span className="nav-tag">{tag}</span>
        </Link>
      </header>

      <main
        ref={vista}
        tabIndex={-1}
        className={`vista vista--${direccion === 1 ? 'avanza' : 'vuelve'}`}
      >
        {children}
      </main>

      <footer className="footer">
        <span>ESTUDIO — CATÁLOGO 2026</span>
        <a href="mailto:hola@estudio.com">flowmindai444@gmail.com</a>
      </footer>

      {salida ? <ConfirmarSalida onCancelar={() => setSalida(null)} onSalir={salir} /> : null}
    </div>
  )
}
