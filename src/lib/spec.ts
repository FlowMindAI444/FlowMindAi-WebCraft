import { z } from 'zod'

/** Esquema único de la captura. Cada pantalla edita solo su porción. */

export const OBJETIVOS = ['agendar', 'captar', 'vender', 'mostrar'] as const
export const HERO_VARIANTES = ['centrado', 'dividido', 'fondo'] as const

export const esquemaObjetivo = z.enum(OBJETIVOS)
export const esquemaHeroVariante = z.enum(HERO_VARIANTES)

export const esquemaSeccion = z.object({
  id: z.string(),
  nombre: z.string(),
  activa: z.boolean(),
  bloqueada: z.boolean(),
})

export const TIPOS_LOGO = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'] as const

export const esquemaLogo = z.object({
  nombre: z.string(),
  tipo: z.string(),
  peso: z.number(),
  // El archivo viaja en base64 para guardarse con el resto del spec.
  dataUrl: z.string(),
})

export const esquemaSpec = z.object({
  servicio: z.literal('web'),
  arquetipo: z.literal('landing'),
  negocio: z.object({
    nombre: z.string(),
    giro: z.string(),
    descripcion: z.string(),
    ciudad: z.string(),
  }),
  // null mientras el paso 2 no se ha contestado.
  objetivo: esquemaObjetivo.nullable(),
  estilo: z.object({
    colorMarca: z.string(),
    colorSecundario: z.string().nullable(),
    tipografia: z.string(),
    heroVariante: esquemaHeroVariante,
  }),
  // El orden del array es el orden real de la página.
  secciones: z.array(esquemaSeccion),
  contenido: z.object({
    servicios: z.array(z.string()),
    testimonios: z.array(z.object({ nombre: z.string(), frase: z.string() })),
    // Opcional: lo guardado antes de que el logo existiera sigue siendo válido.
    logo: esquemaLogo.nullable().optional(),
    contacto: z.object({
      whatsapp: z.string(),
      correo: z.string(),
      direccion: z.string(),
      instagram: z.string(),
      facebook: z.string(),
    }),
  }),
})

export type Spec = z.infer<typeof esquemaSpec>
export type Objetivo = z.infer<typeof esquemaObjetivo>
export type HeroVariante = z.infer<typeof esquemaHeroVariante>
export type Seccion = z.infer<typeof esquemaSeccion>
export type Logo = z.infer<typeof esquemaLogo>
export type Testimonio = Spec['contenido']['testimonios'][number]

export const LIMITES = {
  descripcion: 90,
  servicio: 40,
  servicios: 8,
  servicioInicial: 3,
  testimonios: 3,
  frase: 90,
  nombreTestimonio: 30,
  logoBytes: 1024 * 1024,
} as const

export const PREFIJO_WHATSAPP = '+52'

export function specInicial(): Spec {
  return {
    servicio: 'web',
    arquetipo: 'landing',
    negocio: { nombre: '', giro: '', descripcion: '', ciudad: '' },
    objetivo: null,
    estilo: {
      colorMarca: '',
      colorSecundario: null,
      tipografia: 'fraunces-inter',
      heroVariante: 'centrado',
    },
    secciones: [],
    contenido: {
      servicios: Array.from({ length: LIMITES.servicioInicial }, () => ''),
      testimonios: [],
      logo: null,
      contacto: { whatsapp: '', correo: '', direccion: '', instagram: '', facebook: '' },
    },
  }
}

/* ---------- Validación por paso ---------- */

export type Errores = Record<string, string>

export function validarPaso1(spec: Spec): Errores {
  const errores: Errores = {}
  if (!spec.negocio.nombre.trim()) errores.nombre = 'Escribe el nombre del negocio.'
  if (!spec.negocio.descripcion.trim()) errores.descripcion = 'Cuéntanos en una línea qué haces.'
  return errores
}

export function validarPaso2(spec: Spec): Errores {
  return spec.objetivo ? {} : { objetivo: 'Elige qué quieres lograr.' }
}

export function validarPaso3(spec: Spec): Errores {
  const errores: Errores = {}
  if (!/^#[0-9a-f]{6}$/i.test(spec.estilo.colorMarca)) {
    errores.colorMarca = 'Elige el color de marca (hex de 6 dígitos).'
  }
  return errores
}

export function validarPaso4(spec: Spec): Errores {
  return spec.secciones.some((seccion) => seccion.activa)
    ? {}
    : { secciones: 'Deja al menos una sección activa.' }
}

export function validarPaso5(spec: Spec): Errores {
  const errores: Errores = {}
  const { servicios, contacto } = spec.contenido
  if (!servicios.some((servicio) => servicio.trim())) {
    errores.servicios = 'Escribe al menos un servicio.'
  }
  if (!contacto.whatsapp.trim() && !contacto.correo.trim()) {
    errores.contacto = 'Deja un WhatsApp o un correo para recibir mensajes.'
  }
  return errores
}

const VALIDADORES = [validarPaso1, validarPaso2, validarPaso3, validarPaso4, validarPaso5]

export function validarPaso(numero: number, spec: Spec): Errores {
  return VALIDADORES[numero - 1]?.(spec) ?? {}
}

export function pasoCompleto(numero: number, spec: Spec) {
  return Object.keys(validarPaso(numero, spec)).length === 0
}

/** true si ya hay captura que se perdería al salir del flujo. */
export function hayCaptura(spec: Spec) {
  return spec.negocio.nombre.trim() !== ''
}

/**
 * El logo es opcional, así que no entra en la validación del paso: esto solo
 * revisa el archivo que se sube. Devuelve el motivo del rechazo o null.
 */
export function validarLogo(archivo: File) {
  const permitidos: readonly string[] = TIPOS_LOGO
  if (!permitidos.includes(archivo.type)) return 'Solo imágenes PNG, JPG, SVG o WebP.'
  if (archivo.size > LIMITES.logoBytes) return 'El logo no debe pesar más de 1MB.'
  return null
}

/* ---------- Persistencia ---------- */

// La pantalla ya no se guarda: la URL es la que manda. Lo guardado antes sigue
// leyéndose porque las claves que sobran se descartan al validar.
export const esquemaGuardado = z.object({
  version: z.literal(1),
  spec: esquemaSpec,
  meta: z.object({
    seccionesPersonalizadas: z.boolean(),
    objetivoDeSecciones: esquemaObjetivo.nullable(),
  }),
})

export type Guardado = z.infer<typeof esquemaGuardado>
