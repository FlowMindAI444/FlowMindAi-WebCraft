import { Link, useLocation } from 'react-router-dom'
import { Palomita } from './Iconos'
import { MicroEtiqueta } from './MicroEtiqueta'
import { PASOS, pasoDeRuta, ruta } from '../lib/pasos'
import { useSpec } from '../store/useSpec'

/**
 * Índice de pasos. En escritorio es la columna izquierda; en móvil se colapsa
 * a una barra de progreso horizontal (ver CSS).
 */
export function IndicePasos() {
  const { completado } = useSpec()
  const { pathname } = useLocation()
  const actual = pasoDeRuta(pathname)?.numero ?? PASOS[0].numero

  return (
    <aside className="indice" aria-label="Progreso">
      <MicroEtiqueta className="indice-micro">PROGRESO</MicroEtiqueta>

      <div className="indice-barra" aria-hidden="true">
        <span className="indice-barra-relleno" style={{ width: `${(actual / PASOS.length) * 100}%` }} />
      </div>

      <ol className="indice-lista">
        {PASOS.map((paso) => {
          const esActual = paso.numero === actual
          const esPrevio = paso.numero < actual
          const clases = [
            'indice-item',
            esActual ? 'es-actual' : '',
            esPrevio ? 'es-previo' : '',
            !esActual && !esPrevio ? 'es-futuro' : '',
          ]
            .filter(Boolean)
            .join(' ')

          const contenido = (
            <>
              <span className="indice-num">{String(paso.numero).padStart(2, '0')}</span>
              <span className="indice-nombre">{paso.nombre}</span>
              {esPrevio && completado(paso.numero) ? (
                <span className="indice-palomita">
                  <Palomita />
                </span>
              ) : null}
            </>
          )

          return (
            <li key={paso.slug} className={clases}>
              {esPrevio ? (
                <Link to={ruta(paso.slug)} className="indice-boton">
                  {contenido}
                </Link>
              ) : (
                <button
                  type="button"
                  className="indice-boton"
                  disabled
                  aria-current={esActual ? 'step' : undefined}
                >
                  {contenido}
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
