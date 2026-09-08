import { objetivoUI, parTipografico } from '../lib/presets'
import { derivarPaleta, variablesPaleta } from '../lib/palette'
import type { Spec } from '../lib/spec'

/**
 * Preview del sitio del CLIENTE, no de esta herramienta.
 *
 * Todo lo de adentro se pinta con las variables --c-* del scope local, que
 * salen de la paleta derivada del paso 3. Aquí no entran --paper, --ink ni
 * --maroon: si el preview sale color vino, está mal.
 */
export function Preview({
  spec,
  tamano = 'normal',
}: {
  spec: Spec
  tamano?: 'normal' | 'grande'
}) {
  const { paleta } = derivarPaleta(spec.estilo.colorMarca)
  const par = parTipografico(spec.estilo.tipografia)
  const variante = spec.estilo.heroVariante

  const nombre = spec.negocio.nombre.trim() || 'Tu negocio'
  const descripcion =
    spec.negocio.descripcion.trim() || 'Aquí va la línea que describe lo que haces.'
  const cta = objetivoUI(spec.objetivo)?.cta ?? 'Contactar'
  const enlaces = spec.secciones
    .filter((seccion) => seccion.activa && !seccion.bloqueada)
    .slice(0, 3)
    .map((seccion) => seccion.nombre)

  const logo = spec.contenido.logo

  const navbar = (
    <div className="sitio-nav">
      {logo ? (
        <img className="sitio-logo-imagen" src={logo.dataUrl} alt="" />
      ) : (
        <span className="sitio-logo">{nombre}</span>
      )}
      <span className="sitio-enlaces">
        {enlaces.map((enlace) => (
          <span key={enlace} className="sitio-enlace">
            {enlace}
          </span>
        ))}
        <span className="sitio-boton sitio-boton--mini">{cta}</span>
      </span>
    </div>
  )

  const texto = (
    <div className="sitio-texto">
      <h3 className="sitio-titulo">{nombre}</h3>
      <p className="sitio-desc">{descripcion}</p>
      <span className="sitio-boton">{cta}</span>
    </div>
  )

  return (
    <div
      className={`marco marco--${tamano}`}
      style={variablesPaleta(paleta, { display: par.display, texto: par.texto })}
      role="img"
      aria-label={`Vista previa del hero ${variante} de ${nombre} con la paleta y tipografía elegidas`}
    >
      <div className="marco-barra">
        <svg width="30" height="8" viewBox="0 0 30 8" aria-hidden="true">
          <circle cx="4" cy="4" r="3" fill="currentColor" opacity="0.35" />
          <circle cx="15" cy="4" r="3" fill="currentColor" opacity="0.35" />
          <circle cx="26" cy="4" r="3" fill="currentColor" opacity="0.35" />
        </svg>
      </div>

      <div className={`sitio sitio--${variante}`}>
        {variante === 'fondo' ? (
          <div className="sitio-fondo">
            {navbar}
            {texto}
          </div>
        ) : (
          <>
            {navbar}
            <div className="sitio-hero">
              {texto}
              {variante === 'dividido' ? <span className="sitio-imagen" aria-hidden="true" /> : null}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
