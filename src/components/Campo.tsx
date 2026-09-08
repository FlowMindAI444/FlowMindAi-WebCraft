import type { ReactNode } from 'react'

type Base = {
  id: string
  etiqueta: string
  error?: string
}

/** Label en micro-etiqueta, control sin fondo y pie con error / contador. */
export function Campo({
  id,
  etiqueta,
  error,
  contador,
  children,
}: Base & { contador?: string; children: ReactNode }) {
  return (
    <div className="campo">
      <label className="micro campo-etiqueta" htmlFor={id}>
        <span className="micro-linea" aria-hidden="true" />
        {etiqueta}
      </label>
      {children}
      {error || contador ? (
        <span className="campo-pie">
          <span className="campo-error" id={`${id}-error`}>
            {error}
          </span>
          {contador ? <span className="campo-contador">{contador}</span> : null}
        </span>
      ) : null}
    </div>
  )
}

function propsAccesibles(id: string, error?: string) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
  }
}

export function CampoTexto({
  id,
  etiqueta,
  valor,
  onCambio,
  error,
  maxLength,
  placeholder,
  tipo = 'text',
  prefijo,
}: Base & {
  valor: string
  onCambio: (valor: string) => void
  maxLength?: number
  placeholder?: string
  tipo?: 'text' | 'email' | 'tel'
  prefijo?: string
}) {
  const control = (
    <input
      id={id}
      type={tipo}
      className="entrada"
      value={valor}
      maxLength={maxLength}
      placeholder={placeholder}
      onChange={(evento) => onCambio(evento.target.value)}
      {...propsAccesibles(id, error)}
    />
  )

  return (
    <Campo id={id} etiqueta={etiqueta} error={error}>
      {prefijo ? (
        <span className="entrada-con-prefijo">
          <span className="entrada-prefijo" aria-hidden="true">
            {prefijo}
          </span>
          {control}
        </span>
      ) : (
        control
      )}
    </Campo>
  )
}

export function CampoArea({
  id,
  etiqueta,
  valor,
  onCambio,
  error,
  maxLength,
  placeholder,
}: Base & {
  valor: string
  onCambio: (valor: string) => void
  maxLength: number
  placeholder?: string
}) {
  return (
    <Campo
      id={id}
      etiqueta={etiqueta}
      error={error}
      contador={`${valor.length} / ${maxLength}`}
    >
      <textarea
        id={id}
        className="entrada entrada--area"
        rows={2}
        value={valor}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(evento) => onCambio(evento.target.value)}
        {...propsAccesibles(id, error)}
      />
    </Campo>
  )
}

export function CampoSelect({
  id,
  etiqueta,
  valor,
  onCambio,
  opciones,
  error,
  vacio = 'Elige una opción',
}: Base & {
  valor: string
  onCambio: (valor: string) => void
  opciones: readonly string[]
  vacio?: string
}) {
  return (
    <Campo id={id} etiqueta={etiqueta} error={error}>
      <select
        id={id}
        className="entrada entrada--select"
        value={valor}
        onChange={(evento) => onCambio(evento.target.value)}
        {...propsAccesibles(id, error)}
      >
        <option value="">{vacio}</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    </Campo>
  )
}
