import { useRef, useState } from 'react'
import { validarLogo } from '../lib/spec'
import type { Logo } from '../lib/spec'

/** Zona punteada con drag & drop y selector de archivos para el logo. */
export function SubirLogo({
  logo,
  onCambio,
}: {
  logo: Logo | null
  onCambio: (logo: Logo | null) => void
}) {
  const entrada = useRef<HTMLInputElement>(null)
  const [arrastrando, setArrastrando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Un archivo rechazado no toca el spec: lo que ya estaba guardado se queda. */
  function recibir(archivo: File | undefined) {
    if (!archivo) return

    const motivo = validarLogo(archivo)
    if (motivo) {
      setError(motivo)
      return
    }

    const lector = new FileReader()
    lector.onload = () => {
      if (typeof lector.result !== 'string') return
      setError(null)
      onCambio({
        nombre: archivo.name,
        tipo: archivo.type,
        peso: archivo.size,
        dataUrl: lector.result,
      })
    }
    lector.onerror = () => setError('No pudimos leer el archivo. Prueba con otro.')
    lector.readAsDataURL(archivo)
  }

  function abrirSelector() {
    entrada.current?.click()
  }

  return (
    <>
      <input
        ref={entrada}
        className="sr-only"
        type="file"
        accept="image/*"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(evento) => {
          recibir(evento.target.files?.[0])
          // Sin limpiarlo, volver a elegir el mismo archivo no dispara onChange.
          evento.target.value = ''
        }}
      />

      {logo ? (
        <div className="logo-cargado">
          <img className="logo-miniatura" src={logo.dataUrl} alt="" />
          <span className="logo-nombre">{logo.nombre}</span>
          <span className="logo-peso">{Math.round(logo.peso / 1024)} KB</span>
          <button
            type="button"
            className="logo-quitar"
            onClick={() => {
              setError(null)
              onCambio(null)
            }}
          >
            QUITAR
          </button>
        </div>
      ) : (
        <div
          className={`dropzone${arrastrando ? ' es-arrastrando' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Subir el logo del negocio"
          onClick={abrirSelector}
          onKeyDown={(evento) => {
            if (evento.key !== 'Enter' && evento.key !== ' ') return
            evento.preventDefault()
            abrirSelector()
          }}
          onDragOver={(evento) => {
            // Sin preventDefault el navegador abre el archivo en otra pestaña.
            evento.preventDefault()
            setArrastrando(true)
          }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={(evento) => {
            evento.preventDefault()
            setArrastrando(false)
            recibir(evento.dataTransfer.files[0])
          }}
        >
          <p className="dropzone-texto">Arrastra tu logo aquí o haz clic para elegirlo</p>
          <p className="dropzone-nota">PNG, JPG, SVG o WebP — máximo 1MB</p>
        </div>
      )}

      {error ? <p className="mensaje-error">{error}</p> : null}
    </>
  )
}
