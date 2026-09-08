import './styles/base.css'
import './styles/filas.css'
import './styles/pasos.css'
import './styles/preview.css'
import './styles/resumen.css'

import { Navigate, Route, Routes } from 'react-router-dom'
import { GuardaLanding, LayoutPasos } from './components/LayoutLanding'
import { MenuServicios } from './screens/MenuServicios'
import { Paso1Negocio } from './screens/Paso1Negocio'
import { Paso2Objetivo } from './screens/Paso2Objetivo'
import { Paso3Estilo } from './screens/Paso3Estilo'
import { Paso4Secciones } from './screens/Paso4Secciones'
import { Paso5Contenido } from './screens/Paso5Contenido'
import { Resumen } from './screens/Resumen'
import { TipoPagina } from './screens/TipoPagina'
import { ProveedorSpec } from './store/useSpec'

function App() {
  return (
    <ProveedorSpec>
      <Routes>
        <Route path="/" element={<MenuServicios />} />
        <Route path="/web" element={<TipoPagina />} />

        {/* Todo el flujo de landing pasa por el guard de acceso. */}
        <Route path="/web/landing" element={<GuardaLanding />}>
          <Route index element={<Navigate to="negocio" replace />} />

          {/* Los cinco pasos comparten la barra lateral del layout. */}
          <Route element={<LayoutPasos />}>
            <Route path="negocio" element={<Paso1Negocio />} />
            <Route path="objetivo" element={<Paso2Objetivo />} />
            <Route path="estilo" element={<Paso3Estilo />} />
            <Route path="secciones" element={<Paso4Secciones />} />
            <Route path="contenido" element={<Paso5Contenido />} />
          </Route>

          <Route path="resumen" element={<Resumen />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProveedorSpec>
  )
}

export default App
