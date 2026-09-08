import type { HeroVariante, Objetivo, Seccion } from './spec'

/** Todo el contenido curado de la herramienta vive aquí. */

export const GIROS = [
  'Salud y clínicas',
  'Legal',
  'Belleza y estética',
  'Fitness',
  'Restaurante',
  'Servicios profesionales',
  'Otro',
] as const

export const TIPOS_PAGINA = [
  {
    id: 'landing',
    num: '01',
    titulo: 'Landing page',
    desc: 'Una sola página enfocada en convertir.',
    disponible: true,
  },
  { id: 'portafolio', num: '02', titulo: 'Portafolio', desc: '', disponible: false },
  { id: 'sitio', num: '03', titulo: 'Sitio web sencillo', desc: '', disponible: false },
] as const

export const OBJETIVOS_UI: {
  id: Objetivo
  num: string
  titulo: string
  desc: string
  cta: string
}[] = [
  {
    id: 'agendar',
    num: '01',
    titulo: 'Agendar citas',
    desc: 'Que el visitante reserve o pida cita.',
    cta: 'Agendar cita',
  },
  {
    id: 'captar',
    num: '02',
    titulo: 'Captar contactos',
    desc: 'Conseguir datos de personas interesadas.',
    cta: 'Quiero información',
  },
  {
    id: 'vender',
    num: '03',
    titulo: 'Vender un producto',
    desc: 'Llevar directo a la compra.',
    cta: 'Comprar ahora',
  },
  {
    id: 'mostrar',
    num: '04',
    titulo: 'Mostrar mi trabajo',
    desc: 'Exhibir proyectos y generar consultas.',
    cta: 'Ver proyectos',
  },
]

export function objetivoUI(objetivo: Objetivo | null) {
  return OBJETIVOS_UI.find((opcion) => opcion.id === objetivo) ?? null
}

/* ---------- Estilo ---------- */

export const COLORES_PRESET = [
  '#16453d',
  '#1b3a6b',
  '#6d2f1a',
  '#3f2a63',
  '#0e5257',
  '#8c2f39',
] as const

export type ParTipografico = {
  id: string
  num: string
  nombre: string
  display: string
  texto: string
  muestra: string
}

export const PARES_TIPOGRAFICOS: ParTipografico[] = [
  {
    id: 'fraunces-inter',
    num: '01',
    nombre: 'Fraunces + Inter',
    display: "'Fraunces', Georgia, serif",
    texto: "'Inter', system-ui, sans-serif",
    muestra: 'Editorial y cálida. Lee artesanal.',
  },
  {
    id: 'playfair-source',
    num: '02',
    nombre: 'Playfair Display + Source Sans 3',
    display: "'Playfair Display', Georgia, serif",
    texto: "'Source Sans 3', system-ui, sans-serif",
    muestra: 'Contraste alto. Lee formal.',
  },
  {
    id: 'instrument-inter',
    num: '03',
    nombre: 'Instrument Serif + Inter',
    display: "'Instrument Serif', Georgia, serif",
    texto: "'Inter', system-ui, sans-serif",
    muestra: 'Serif ligera. Lee contemporánea.',
  },
  {
    id: 'inter-inter',
    num: '04',
    nombre: 'Inter + Inter',
    display: "'Inter', system-ui, sans-serif",
    texto: "'Inter', system-ui, sans-serif",
    muestra: 'Neutra y directa. Lee técnica.',
  },
]

export function parTipografico(id: string): ParTipografico {
  return PARES_TIPOGRAFICOS.find((par) => par.id === id) ?? PARES_TIPOGRAFICOS[0]
}

export const VARIANTES_HERO: { id: HeroVariante; num: string; nombre: string; desc: string }[] = [
  { id: 'centrado', num: '01', nombre: 'Centrado', desc: 'Aire, simetría. Lee elegante.' },
  {
    id: 'dividido',
    num: '02',
    nombre: 'Dividido',
    desc: 'Texto e imagen lado a lado. Lee corporativo.',
  },
  { id: 'fondo', num: '03', nombre: 'Fondo completo', desc: 'Imagen a sangre. Lee comercial.' },
]

/* ---------- Secciones ---------- */

export const DESCRIPCION_SECCION: Record<string, string> = {
  hero: 'Primera pantalla: mensaje principal y acción.',
  servicios: 'Lo que ofreces, en bloques cortos.',
  'como-funciona': 'El proceso explicado en pasos.',
  testimonios: 'Frases de clientes que ya te compraron.',
  equipo: 'Quién atiende y su especialidad.',
  faq: 'Dudas resueltas antes de que pregunten.',
  'llamado-final': 'Último bloque para empujar a la acción.',
  footer: 'Cierre con contacto y datos del negocio.',
  problema: 'El dolor que tu cliente quiere resolver.',
  beneficios: 'Por qué elegirte, en puntos claros.',
  precios: 'Paquetes y qué incluye cada uno.',
  garantia: 'Qué pasa si no queda satisfecho.',
  galeria: 'Trabajos anteriores en imágenes.',
  'sobre-mi': 'Tu historia y por qué haces esto.',
}

type PresetSeccion = { id: string; nombre: string }

/** Hero y footer siempre van bloqueados: son el primero y el último. */
const PRESETS: Record<Objetivo, PresetSeccion[]> = {
  agendar: [
    { id: 'hero', nombre: 'Hero' },
    { id: 'servicios', nombre: 'Servicios' },
    { id: 'como-funciona', nombre: 'Cómo funciona' },
    { id: 'testimonios', nombre: 'Testimonios' },
    { id: 'equipo', nombre: 'Equipo' },
    { id: 'faq', nombre: 'Preguntas frecuentes' },
    { id: 'llamado-final', nombre: 'Llamado final' },
    { id: 'footer', nombre: 'Footer con mapa' },
  ],
  captar: [
    { id: 'hero', nombre: 'Hero' },
    { id: 'problema', nombre: 'El problema' },
    { id: 'beneficios', nombre: 'Beneficios' },
    { id: 'testimonios', nombre: 'Testimonios' },
    { id: 'faq', nombre: 'Preguntas frecuentes' },
    { id: 'llamado-final', nombre: 'Llamado final' },
    { id: 'footer', nombre: 'Footer' },
  ],
  vender: [
    { id: 'hero', nombre: 'Hero' },
    { id: 'problema', nombre: 'El problema' },
    { id: 'beneficios', nombre: 'Beneficios' },
    { id: 'precios', nombre: 'Precios' },
    { id: 'testimonios', nombre: 'Testimonios' },
    { id: 'garantia', nombre: 'Garantía' },
    { id: 'faq', nombre: 'Preguntas frecuentes' },
    { id: 'llamado-final', nombre: 'Llamado final' },
    { id: 'footer', nombre: 'Footer' },
  ],
  mostrar: [
    { id: 'hero', nombre: 'Hero' },
    { id: 'galeria', nombre: 'Galería' },
    { id: 'servicios', nombre: 'Servicios' },
    { id: 'testimonios', nombre: 'Testimonios' },
    { id: 'sobre-mi', nombre: 'Sobre mí' },
    { id: 'llamado-final', nombre: 'Llamado final' },
    { id: 'footer', nombre: 'Footer' },
  ],
}

export function seccionesPreset(objetivo: Objetivo): Seccion[] {
  return PRESETS[objetivo].map((seccion) => ({
    ...seccion,
    activa: true,
    bloqueada: seccion.id === 'hero' || seccion.id === 'footer',
  }))
}
