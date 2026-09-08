import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { MicroEtiqueta } from '../components/MicroEtiqueta'
import { ModalGeneracion } from '../components/ModalGeneracion'
import { Pantalla } from '../components/Pantalla'
import { Preview } from '../components/Preview'
import { PASOS, ruta } from '../lib/pasos'
import { objetivoUI, parTipografico, VARIANTES_HERO } from '../lib/presets'
import { useSpec } from '../store/useSpec'

function Dato({ clave, children }: { clave: string; children: ReactNode }) {
  return (
    <div className="dato">
      <span className="dato-clave">{clave}</span>
      <span className="dato-valor">{children}</span>
    </div>
  )
}

const vacio = (valor: string) => (valor.trim() ? valor.trim() : '—')

function Bloque({ paso, children }: { paso: number; children: ReactNode }) {
  const info = PASOS[paso - 1]
  const navigate = useNavigate()
  return (
    <section className="resumen-bloque">
      <div className="resumen-bloque-barra">
        <MicroEtiqueta>{`${String(paso).padStart(2, '0')} — ${info.nombre}`}</MicroEtiqueta>
        <button type="button" className="boton-texto" onClick={() => navigate(ruta(info.slug))}>
          EDITAR
        </button>
      </div>
      <div className="resumen-datos">{children}</div>
    </section>
  )
}

export function Resumen() {
  const { spec } = useSpec()
  const [generando, setGenerando] = useState(false)

  const objetivo = objetivoUI(spec.objetivo)
  const par = parTipografico(spec.estilo.tipografia)
  const variante = VARIANTES_HERO.find((opcion) => opcion.id === spec.estilo.heroVariante)
  const activas = spec.secciones.filter((seccion) => seccion.activa)
  const servicios = spec.contenido.servicios.filter((servicio) => servicio.trim())

  return (
    <Pantalla tag="RESUMEN" conAtras>
      <section className="hero">
        <div className="hero-copy">
          <MicroEtiqueta centrado>Listo</MicroEtiqueta>
          <h1 className="titulo">Todo listo</h1>
        </div>
      </section>

      <div className="resumen">
        <div className="resumen-columna">
          <Bloque paso={1}>
            <Dato clave="Negocio">{vacio(spec.negocio.nombre)}</Dato>
            <Dato clave="Giro">{vacio(spec.negocio.giro)}</Dato>
            <Dato clave="Qué hace">{vacio(spec.negocio.descripcion)}</Dato>
            <Dato clave="Ciudad">{vacio(spec.negocio.ciudad)}</Dato>
          </Bloque>

          <Bloque paso={2}>
            <Dato clave="Objetivo">{objetivo?.titulo ?? '—'}</Dato>
            <Dato clave="Para">{objetivo?.desc ?? '—'}</Dato>
          </Bloque>

          <Bloque paso={3}>
            <Dato clave="Color de marca">
              <span className="dato-color">
                <span
                  className="dato-muestra"
                  style={{ background: spec.estilo.colorMarca || 'transparent' }}
                  aria-hidden="true"
                />
                <span className="mono">{vacio(spec.estilo.colorMarca)}</span>
              </span>
            </Dato>
            <Dato clave="Secundario">
              {spec.estilo.colorSecundario ? (
                <span className="dato-color">
                  <span
                    className="dato-muestra"
                    style={{ background: spec.estilo.colorSecundario }}
                    aria-hidden="true"
                  />
                  <span className="mono">{spec.estilo.colorSecundario}</span>
                </span>
              ) : (
                '—'
              )}
            </Dato>
            <Dato clave="Tipografía">{par.nombre}</Dato>
            <Dato clave="Hero">{variante?.nombre ?? '—'}</Dato>
          </Bloque>

          <Bloque paso={4}>
            <Dato clave={`${activas.length} secciones`}>
              {activas.map((seccion) => seccion.nombre).join(' · ') || '—'}
            </Dato>
          </Bloque>

          <Bloque paso={5}>
            <Dato clave="Servicios">{servicios.join(' · ') || '—'}</Dato>
            <Dato clave="Testimonios">
              {spec.contenido.testimonios.length
                ? spec.contenido.testimonios
                    .map((testimonio) => testimonio.nombre.trim() || 'sin nombre')
                    .join(' · ')
                : '—'}
            </Dato>
            <Dato clave="WhatsApp">
              {spec.contenido.contacto.whatsapp.trim()
                ? `+52 ${spec.contenido.contacto.whatsapp.trim()}`
                : '—'}
            </Dato>
            <Dato clave="Logo">
              {spec.contenido.logo
                ? `${spec.contenido.logo.nombre} · ${Math.round(spec.contenido.logo.peso / 1024)} KB`
                : '—'}
            </Dato>
            <Dato clave="Correo">{vacio(spec.contenido.contacto.correo)}</Dato>
            <Dato clave="Dirección">{vacio(spec.contenido.contacto.direccion)}</Dato>
            <Dato clave="Redes">
              {[spec.contenido.contacto.instagram, spec.contenido.contacto.facebook]
                .filter((red) => red.trim())
                .join(' · ') || '—'}
            </Dato>
          </Bloque>

          <details className="ver-json">
            <summary>VER JSON</summary>
            {/* El base64 del logo se resume: crudo son cientos de miles de caracteres. */}
            <pre className="mono ver-json-cuerpo">
              {JSON.stringify(spec, (clave, valor) => (clave === 'dataUrl' ? '(base64)' : valor), 2)}
            </pre>
          </details>
        </div>

        <div className="resumen-preview">
          <MicroEtiqueta>Preview</MicroEtiqueta>
          <Preview spec={spec} tamano="grande" />
        </div>
      </div>

      <div className="generar">
        <button type="button" className="boton-generar" onClick={() => setGenerando(true)}>
          GENERAR PÁGINA →
        </button>
      </div>

      {generando ? <ModalGeneracion onCerrar={() => setGenerando(false)} /> : null}
    </Pantalla>
  )
}
