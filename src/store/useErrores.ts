import { useCallback, useState } from 'react'
import type { Errores } from '../lib/spec'

/** Errores inline por campo: se muestran al intentar avanzar y se limpian al corregir. */
export function useErrores() {
  const [errores, setErrores] = useState<Errores>({})

  const limpiar = useCallback((clave: string) => {
    setErrores((previos) => {
      if (!previos[clave]) return previos
      const resto: Errores = { ...previos }
      delete resto[clave]
      return resto
    })
  }, [])

  return { errores, setErrores, limpiar }
}
