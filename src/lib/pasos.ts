import type { Spec } from './spec'

/** Prefijo de todas las rutas del flujo de landing. */
export const BASE = '/web/landing'

/** Qué tiene que traer el spec para poder abrir un destino. */
export type Requisito = 'negocio' | 'objetivo'

const CUMPLE: Record<Requisito, (spec: Spec) => boolean> = {
  negocio: (spec) => spec.negocio.nombre.trim() !== '',
  objetivo: (spec) => spec.objetivo !== null,
}

type Destino = {
  slug: string
  requiere: readonly Requisito[]
}

export type Paso = Destino & {
  numero: number
  nombre: string
  titulo: string
}

/**
 * Orden real del flujo. De aquí salen la barra lateral, el guard de acceso y la
 * ruta del botón "Continuar": no hay otra copia de este orden en el proyecto.
 */
export const PASOS: readonly Paso[] = [
  {
    numero: 1,
    slug: 'negocio',
    nombre: 'Tu negocio',
    titulo: 'Cuéntanos de tu negocio',
    requiere: [],
  },
  {
    numero: 2,
    slug: 'objetivo',
    nombre: 'Qué quieres lograr',
    titulo: 'Qué quieres lograr',
    requiere: ['negocio'],
  },
  {
    numero: 3,
    slug: 'estilo',
    nombre: 'Estilo',
    titulo: 'Cómo se debe ver',
    requiere: ['negocio', 'objetivo'],
  },
  {
    numero: 4,
    slug: 'secciones',
    nombre: 'Secciones',
    titulo: 'Qué lleva la página',
    requiere: ['negocio', 'objetivo'],
  },
  {
    numero: 5,
    slug: 'contenido',
    nombre: 'Contenido',
    titulo: 'Ideas para el contenido',
    requiere: ['negocio', 'objetivo'],
  },
]

/** El resumen cierra el flujo pero no es un paso: no aparece en la barra lateral. */
const RESUMEN: Destino = { slug: 'resumen', requiere: ['negocio', 'objetivo'] }

const DESTINOS: readonly Destino[] = [...PASOS, RESUMEN]

export function ruta(slug: string) {
  return `${BASE}/${slug}`
}

export const RUTA_PRIMER_PASO = ruta(PASOS[0].slug)

/** true si la URL está dentro del flujo de landing, donde el spec sí vive. */
export function dentroDelFlujo(pathname: string) {
  return pathname === BASE || pathname.startsWith(`${BASE}/`)
}

/** Paso al que corresponde una URL, o null si esa URL no es un paso. */
export function pasoDeRuta(pathname: string): Paso | null {
  return PASOS.find((paso) => pathname === ruta(paso.slug)) ?? null
}

/** Lo que sigue después de un paso: el paso siguiente o, tras el último, el resumen. */
export function rutaSiguiente(numero: number) {
  return ruta((DESTINOS[numero] ?? RESUMEN).slug)
}

/** true si al spec le falta algo para poder mostrar esa URL. */
export function faltanDatos(pathname: string, spec: Spec) {
  const destino = DESTINOS.find((candidato) => pathname === ruta(candidato.slug))
  if (!destino) return false
  return destino.requiere.some((requisito) => !CUMPLE[requisito](spec))
}
