import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { seccionesPreset } from '../lib/presets'
import { esquemaGuardado, pasoCompleto, specInicial } from '../lib/spec'
import type { Objetivo, Seccion, Spec } from '../lib/spec'

const CLAVE = 'webcraft.configurador.v1'

type Meta = {
  seccionesPersonalizadas: boolean
  objetivoDeSecciones: Objetivo | null
}

type Estado = { spec: Spec; meta: Meta }

function estadoInicial(): Estado {
  return {
    spec: specInicial(),
    meta: { seccionesPersonalizadas: false, objetivoDeSecciones: null },
  }
}

function leerGuardado(): Estado | null {
  try {
    const crudo = window.localStorage.getItem(CLAVE)
    if (!crudo) return null
    const resultado = esquemaGuardado.safeParse(JSON.parse(crudo))
    if (!resultado.success) return null
    const { spec, meta } = resultado.data
    return { spec, meta }
  } catch {
    return null
  }
}

function esCuotaExcedida(error: unknown) {
  if (!(error instanceof DOMException)) return false
  return error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
}

/** false solo cuando no cupo: el resto de fallos deja la app corriendo en memoria. */
function guardar(estado: Estado) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify({ version: 1, ...estado }))
    return true
  } catch (error) {
    // Sin almacenamiento disponible la app sigue funcionando en memoria.
    return !esCuotaExcedida(error)
  }
}

function borrarGuardado() {
  try {
    window.localStorage.removeItem(CLAVE)
  } catch {
    // Igual que al guardar: sin almacenamiento no hay nada que limpiar.
  }
}

const SERIALIZADO_INICIAL = JSON.stringify(estadoInicial())

type Contexto = {
  spec: Spec
  seccionesPersonalizadas: boolean
  /** El último guardado no cupo en localStorage: casi siempre por el logo. */
  sinEspacio: boolean
  completado: (paso: number) => boolean
  editarNegocio: (parcial: Partial<Spec['negocio']>) => void
  editarEstilo: (parcial: Partial<Spec['estilo']>) => void
  editarContenido: (parcial: Partial<Spec['contenido']>) => void
  editarContacto: (parcial: Partial<Spec['contenido']['contacto']>) => void
  elegirObjetivo: (objetivo: Objetivo) => void
  establecerSecciones: (secciones: Seccion[]) => void
  reiniciarSpec: () => void
}

const ContextoSpec = createContext<Contexto | null>(null)

export function ProveedorSpec({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>(() => leerGuardado() ?? estadoInicial())
  const [sinEspacio, setSinEspacio] = useState(false)

  // Cada cambio del spec se persiste: un refresh no pierde nada. Un estado sin
  // tocar no deja rastro, así reiniciar también vacía el almacenamiento.
  useEffect(() => {
    if (JSON.stringify(estado) === SERIALIZADO_INICIAL) {
      borrarGuardado()
      setSinEspacio(false)
      return
    }
    setSinEspacio(!guardar(estado))
  }, [estado])

  const editarSpec = useCallback((cambio: (spec: Spec) => Spec) => {
    setEstado((previo) => ({ ...previo, spec: cambio(previo.spec) }))
  }, [])

  const editarNegocio = useCallback(
    (parcial: Partial<Spec['negocio']>) => {
      editarSpec((spec) => ({ ...spec, negocio: { ...spec.negocio, ...parcial } }))
    },
    [editarSpec],
  )

  const editarEstilo = useCallback(
    (parcial: Partial<Spec['estilo']>) => {
      editarSpec((spec) => ({ ...spec, estilo: { ...spec.estilo, ...parcial } }))
    },
    [editarSpec],
  )

  const editarContenido = useCallback(
    (parcial: Partial<Spec['contenido']>) => {
      editarSpec((spec) => ({ ...spec, contenido: { ...spec.contenido, ...parcial } }))
    },
    [editarSpec],
  )

  const editarContacto = useCallback(
    (parcial: Partial<Spec['contenido']['contacto']>) => {
      editarSpec((spec) => ({
        ...spec,
        contenido: { ...spec.contenido, contacto: { ...spec.contenido.contacto, ...parcial } },
      }))
    },
    [editarSpec],
  )

  /** Elegir objetivo reescribe las secciones con su preset. */
  const elegirObjetivo = useCallback((objetivo: Objetivo) => {
    setEstado((previo) => ({
      spec: { ...previo.spec, objetivo, secciones: seccionesPreset(objetivo) },
      meta: { ...previo.meta, seccionesPersonalizadas: false, objetivoDeSecciones: objetivo },
    }))
  }, [])

  const establecerSecciones = useCallback((secciones: Seccion[]) => {
    setEstado((previo) => ({
      spec: { ...previo.spec, secciones },
      meta: { ...previo.meta, seccionesPersonalizadas: true },
    }))
  }, [])

  /**
   * Devuelve el spec a su estado inicial y borra la clave de localStorage. La
   * llaman las pantallas de fuera del flujo al montarse, no el flujo al salir:
   * un refresh dentro de los pasos desmonta el layout y no debe perder nada.
   */
  const reiniciarSpec = useCallback(() => {
    setEstado(estadoInicial())
    borrarGuardado()
  }, [])

  const valor = useMemo<Contexto>(
    () => ({
      spec: estado.spec,
      seccionesPersonalizadas: estado.meta.seccionesPersonalizadas,
      sinEspacio,
      completado: (paso: number) => pasoCompleto(paso, estado.spec),
      editarNegocio,
      editarEstilo,
      editarContenido,
      editarContacto,
      elegirObjetivo,
      establecerSecciones,
      reiniciarSpec,
    }),
    [
      estado,
      sinEspacio,
      editarNegocio,
      editarEstilo,
      editarContenido,
      editarContacto,
      elegirObjetivo,
      establecerSecciones,
      reiniciarSpec,
    ],
  )

  return <ContextoSpec.Provider value={valor}>{children}</ContextoSpec.Provider>
}

export function useSpec() {
  const contexto = useContext(ContextoSpec)
  if (!contexto) throw new Error('useSpec debe usarse dentro de <ProveedorSpec>')
  return contexto
}
