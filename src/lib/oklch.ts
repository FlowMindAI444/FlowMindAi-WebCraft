/**
 * Conversión sRGB <-> OKLab/OKLCH, mapeo a gamut y contraste WCAG.
 *
 * Esto es la superficie mínima que el proyecto usaría de `culori`
 * (converter('oklch'), formatHex, toGamut, wcagContrast). Toda la lógica de
 * producto vive en palette.ts, así que sustituir este archivo por la librería
 * solo implica cambiar los imports de ese archivo.
 */

export type Oklch = { l: number; c: number; h: number }
type RgbLineal = { r: number; g: number; b: number }

const acotar01 = (valor: number) => (valor < 0 ? 0 : valor > 1 ? 1 : valor)

function aLineal(canal: number) {
  return canal <= 0.04045 ? canal / 12.92 : Math.pow((canal + 0.055) / 1.055, 2.4)
}

function aGamma(canal: number) {
  return canal <= 0.0031308 ? canal * 12.92 : 1.055 * Math.pow(canal, 1 / 2.4) - 0.055
}

/** Acepta "#abc", "abc", "#aabbcc" o "aabbcc". Devuelve null si no es hex. */
export function normalizarHex(valor: string): string | null {
  const limpio = valor.trim().replace(/^#/, '')
  if (/^[0-9a-f]{3}$/i.test(limpio)) {
    return `#${limpio
      .split('')
      .map((caracter) => caracter + caracter)
      .join('')}`.toLowerCase()
  }
  if (/^[0-9a-f]{6}$/i.test(limpio)) return `#${limpio}`.toLowerCase()
  return null
}

export function esHexValido(valor: string) {
  return normalizarHex(valor) !== null
}

function hexARgbLineal(hex: string): RgbLineal {
  const entero = Number.parseInt(hex.slice(1), 16)
  return {
    r: aLineal(((entero >> 16) & 255) / 255),
    g: aLineal(((entero >> 8) & 255) / 255),
    b: aLineal((entero & 255) / 255),
  }
}

function rgbLinealAHex({ r, g, b }: RgbLineal): string {
  const canal = (valor: number) =>
    Math.round(acotar01(aGamma(acotar01(valor))) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${canal(r)}${canal(g)}${canal(b)}`
}

function rgbLinealAOklch({ r, g, b }: RgbLineal): Oklch {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)

  const luz = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const ejeA = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const ejeB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  const croma = Math.sqrt(ejeA * ejeA + ejeB * ejeB)
  const matiz = ((Math.atan2(ejeB, ejeA) * 180) / Math.PI + 360) % 360
  return { l: luz, c: croma, h: matiz }
}

function oklchARgbLineal({ l, c, h }: Oklch): RgbLineal {
  const radianes = (h * Math.PI) / 180
  const ejeA = c * Math.cos(radianes)
  const ejeB = c * Math.sin(radianes)

  const lCubo = l + 0.3963377774 * ejeA + 0.2158037573 * ejeB
  const mCubo = l - 0.1055613458 * ejeA - 0.0638541728 * ejeB
  const sCubo = l - 0.0894841775 * ejeA - 1.291485548 * ejeB

  const largo = lCubo * lCubo * lCubo
  const medio = mCubo * mCubo * mCubo
  const corto = sCubo * sCubo * sCubo

  return {
    r: 4.0767416621 * largo - 3.3077115913 * medio + 0.2309699292 * corto,
    g: -1.2684380046 * largo + 2.6097574011 * medio - 0.3413193965 * corto,
    b: -0.0041960863 * largo - 0.7034186147 * medio + 1.707614701 * corto,
  }
}

function dentroDeGamut({ r, g, b }: RgbLineal) {
  const margen = 1e-4
  return (
    r >= -margen && r <= 1 + margen && g >= -margen && g <= 1 + margen && b >= -margen && b <= 1 + margen
  )
}

export function hexAOklch(hex: string): Oklch {
  return rgbLinealAOklch(hexARgbLineal(normalizarHex(hex) ?? '#000000'))
}

/**
 * OKLCH -> hex conservando L y matiz: si el color queda fuera de sRGB se
 * reduce el croma hasta que entra, en vez de recortar canales (que es lo que
 * desplaza el tono y rompe las paletas generadas).
 */
export function oklchAHex(color: Oklch): string {
  const seguro: Oklch = { l: acotar01(color.l), c: Math.max(color.c, 0), h: color.h }
  if (dentroDeGamut(oklchARgbLineal(seguro))) return rgbLinealAHex(oklchARgbLineal(seguro))

  let dentro = 0
  let fuera = seguro.c
  for (let paso = 0; paso < 24; paso += 1) {
    const medio = (dentro + fuera) / 2
    if (dentroDeGamut(oklchARgbLineal({ ...seguro, c: medio }))) dentro = medio
    else fuera = medio
  }
  return rgbLinealAHex(oklchARgbLineal({ ...seguro, c: dentro }))
}

function luminancia(hex: string) {
  const { r, g, b } = hexARgbLineal(normalizarHex(hex) ?? '#000000')
  return 0.2126 * acotar01(r) + 0.7152 * acotar01(g) + 0.0722 * acotar01(b)
}

/** Razón de contraste WCAG 2.1 entre dos hex (1 a 21). */
export function contraste(unHex: string, otroHex: string) {
  const uno = luminancia(unHex)
  const otro = luminancia(otroHex)
  const claro = Math.max(uno, otro)
  const oscuro = Math.min(uno, otro)
  return (claro + 0.05) / (oscuro + 0.05)
}
