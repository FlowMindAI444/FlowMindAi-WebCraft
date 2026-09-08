import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { IndicePasos } from './IndicePasos'
import { Pantalla } from './Pantalla'
import { faltanDatos, PASOS, pasoDeRuta, RUTA_PRIMER_PASO } from '../lib/pasos'
import { useSpec } from '../store/useSpec'

/**
 * Entrar directo a un paso para el que el spec no alcanza devuelve al paso 1.
 * Va con replace para no dejar la ruta inaccesible en el historial.
 */
export function GuardaLanding() {
  const { spec } = useSpec()
  const { pathname } = useLocation()

  if (faltanDatos(pathname, spec)) return <Navigate to={RUTA_PRIMER_PASO} replace />

  return <Outlet />
}

/**
 * Dos columnas separadas por una línea vertical a todo lo alto. El índice vive
 * en el layout, así que cambiar de paso solo reemplaza el panel de la derecha.
 */
export function LayoutPasos() {
  const { pathname } = useLocation()
  const paso = pasoDeRuta(pathname) ?? PASOS[0]
  const numero = String(paso.numero).padStart(2, '0')

  return (
    <Pantalla tag={`PASO ${numero} — ${paso.nombre.toUpperCase()}`} conAtras>
      <div className="paso">
        <IndicePasos />
        <Outlet />
      </div>
    </Pantalla>
  )
}
