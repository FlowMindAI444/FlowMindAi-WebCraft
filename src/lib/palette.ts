import type { CSSProperties } from 'react'
import { contraste, esHexValido, hexAOklch, normalizarHex, oklchAHex } from './oklch'

/**
 * Derivación de paleta en OKLCH (no HSL): al mover solo la luminosidad y el
 * croma sobre el mismo matiz, la luminosidad percibida se mantiene constante
 * entre matices, que es lo que evita que las paletas generadas se rompan
 * cuando el color de marca es un amarillo o un azul muy saturado.
 */

export type RolPaleta =
  | 'marca'
  | 'marcaHover'
  | 'tinta'
  | 'superficie'
  | 'superficieAlt'
  | 'borde'
  | 'textoSuave'

export type Paleta = Record<RolPaleta, string>

export type PaletaDerivada = {
  paleta: Paleta
  /** Avisos discretos cuando hubo que ajustar la luminosidad por contraste. */
  avisos: string[]
}

/** Roles visibles en la tira de muestras del paso 3, en orden. */
export const ROLES_VISIBLES: { clave: RolPaleta; nombre: string }[] = [
  { clave: 'marca', nombre: 'Marca' },
  { clave: 'tinta', nombre: 'Tinta' },
  { clave: 'superficie', nombre: 'Superficie' },
  { clave: 'superficieAlt', nombre: 'Superficie alterna' },
  { clave: 'borde', nombre: 'Borde' },
  { clave: 'textoSuave', nombre: 'Texto suave' },
]

/** Gris neutro con el que se dibuja el preview mientras no hay color elegido. */
const SIN_COLOR = '#8c8c8c'

const AA_TEXTO = 4.5
const PASO_LUZ = 0.02

const RECETA = {
  tinta: { l: 0.2, c: 0.02 },
  superficie: { l: 0.98, c: 0.008 },
  superficieAlt: { l: 0.955, c: 0.012 },
  borde: { l: 0.9, c: 0.015 },
  textoSuave: { l: 0.48, c: 0.02 },
}

export function derivarPaleta(hexMarca: string): PaletaDerivada {
  const elegido = esHexValido(hexMarca)
  const hex = (elegido ? normalizarHex(hexMarca) : SIN_COLOR) as string
  const base = hexAOklch(hex)

  // Un gris no tiene matiz utilizable: en ese caso la paleta se queda acromática.
  const tieneMatiz = base.c > 0.0005
  const matiz = tieneMatiz ? base.h : 0
  const conLuz = (l: number, c: number) => oklchAHex({ l, c: tieneMatiz ? c : 0, h: matiz })

  const avisos: string[] = []

  const superficie = conLuz(RECETA.superficie.l, RECETA.superficie.c)
  const superficieAlt = conLuz(RECETA.superficieAlt.l, RECETA.superficieAlt.c)
  const borde = conLuz(RECETA.borde.l, RECETA.borde.c)
  const textoSuave = conLuz(RECETA.textoSuave.l, RECETA.textoSuave.c)

  // AA de tinta sobre superficie.
  let luzTinta = RECETA.tinta.l
  let tinta = conLuz(luzTinta, RECETA.tinta.c)
  let tintaAjustada = false
  while (contraste(tinta, superficie) < AA_TEXTO && luzTinta > 0.04) {
    luzTinta -= PASO_LUZ
    tinta = conLuz(luzTinta, RECETA.tinta.c)
    tintaAjustada = true
  }
  if (tintaAjustada && elegido) {
    avisos.push('Oscurecimos la tinta para que el texto cumpla contraste AA.')
  }

  // AA de superficie sobre marca (el texto de los botones del sitio).
  let luzMarca = base.l
  let marca = hex
  let marcaAjustada = false
  while (contraste(superficie, marca) < AA_TEXTO && luzMarca > 0.12) {
    luzMarca -= PASO_LUZ
    marca = oklchAHex({ l: luzMarca, c: base.c, h: matiz })
    marcaAjustada = true
  }
  if (marcaAjustada && elegido) {
    avisos.push('Bajamos la luminosidad del color de marca para que el texto encima cumpla AA.')
  }

  const marcaHover = oklchAHex({ l: Math.max(luzMarca - 0.06, 0.04), c: base.c, h: matiz })

  return {
    paleta: { marca, marcaHover, tinta, superficie, superficieAlt, borde, textoSuave },
    avisos,
  }
}

/**
 * Variables con scope propio para el preview. El sitio del cliente no hereda
 * --paper / --ink / --maroon: se alimenta solo de estos valores.
 */
export function variablesPaleta(
  paleta: Paleta,
  fuentes?: { display: string; texto: string },
): CSSProperties {
  return {
    '--c-marca': paleta.marca,
    '--c-marca-hover': paleta.marcaHover,
    '--c-tinta': paleta.tinta,
    '--c-superficie': paleta.superficie,
    '--c-superficie-alt': paleta.superficieAlt,
    '--c-borde': paleta.borde,
    '--c-texto-suave': paleta.textoSuave,
    ...(fuentes ? { '--f-display': fuentes.display, '--f-texto': fuentes.texto } : {}),
  } as CSSProperties
}
