import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListaSeleccion } from '../components/Fila'
import { MicroEtiqueta } from '../components/MicroEtiqueta'
import { PasoLayout } from '../components/PasoLayout'
import { Preview } from '../components/Preview'
import { WireframeHero } from '../components/WireframeHero'
import { derivarPaleta, ROLES_VISIBLES } from '../lib/palette'
import { normalizarHex } from '../lib/oklch'
import { rutaSiguiente } from '../lib/pasos'
import { COLORES_PRESET, PARES_TIPOGRAFICOS, VARIANTES_HERO } from '../lib/presets'
import { validarPaso3 } from '../lib/spec'
import { useErrores } from '../store/useErrores'
import { useSpec } from '../store/useSpec'

export function Paso3Estilo() {
  const { spec, editarEstilo } = useSpec()
  const { errores, setErrores, limpiar } = useErrores()
  const [hexEscrito, setHexEscrito] = useState(spec.estilo.colorMarca)
  const [secundarioVisible, setSecundarioVisible] = useState(spec.estilo.colorSecundario !== null)
  const [previewAbierto, setPreviewAbierto] = useState(true)
  const navigate = useNavigate()

  const { paleta, avisos } = useMemo(
    () => derivarPaleta(spec.estilo.colorMarca),
    [spec.estilo.colorMarca],
  )

  function elegirColor(valor: string) {
    setHexEscrito(valor)
    const normalizado = normalizarHex(valor)
    if (normalizado) {
      editarEstilo({ colorMarca: normalizado })
      limpiar('colorMarca')
    }
  }

  function continuar() {
    const encontrados = validarPaso3(spec)
    setErrores(encontrados)
    if (Object.keys(encontrados).length === 0) navigate(rutaSiguiente(3))
  }

  const nombreNegocio = spec.negocio.nombre.trim() || 'Tu negocio'
  const lineaMuestra = spec.negocio.descripcion.trim()

  return (
    <PasoLayout paso={3} ancho="ancho" onContinuar={continuar}>
      <div className="estilo">
        <div className="estilo-controles">
          {/* ---------- Bloque A: color de marca ---------- */}
          <section className="bloque">
            <MicroEtiqueta>A — COLOR DE MARCA</MicroEtiqueta>

            <div className="color-fila">
              <input
                type="color"
                id="color-marca"
                className="color-nativo"
                value={normalizarHex(spec.estilo.colorMarca) ?? paleta.marca}
                onChange={(evento) => elegirColor(evento.target.value)}
                aria-label="Color de marca"
              />
              <div className="campo campo--hex">
                <label className="micro campo-etiqueta" htmlFor="color-hex">
                  <span className="micro-linea" aria-hidden="true" />
                  Hex
                </label>
                <input
                  id="color-hex"
                  className="entrada"
                  value={hexEscrito}
                  maxLength={7}
                  placeholder="#000000"
                  spellCheck={false}
                  onChange={(evento) => elegirColor(evento.target.value)}
                  aria-invalid={errores.colorMarca ? true : undefined}
                  aria-describedby={errores.colorMarca ? 'color-hex-error' : undefined}
                />
              </div>
            </div>

            {errores.colorMarca ? (
              <p className="mensaje-error" id="color-hex-error">
                {errores.colorMarca}
              </p>
            ) : null}

            <div className="presets-color" role="group" aria-label="Colores sugeridos">
              {COLORES_PRESET.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  className={`muestra-preset${spec.estilo.colorMarca === hex ? ' es-seleccionada' : ''}`}
                  style={{ background: hex }}
                  aria-pressed={spec.estilo.colorMarca === hex}
                  aria-label={`Usar ${hex}`}
                  onClick={() => elegirColor(hex)}
                />
              ))}
            </div>

            <div className="tira-paleta">
              {ROLES_VISIBLES.map((rol) => (
                <div key={rol.clave} className="tira-item">
                  <span
                    className="tira-muestra"
                    style={{ background: paleta[rol.clave] }}
                    aria-hidden="true"
                  />
                  <span className="tira-nombre">{rol.nombre}</span>
                  <span className="tira-hex">{paleta[rol.clave]}</span>
                </div>
              ))}
            </div>

            {avisos.map((aviso) => (
              <p key={aviso} className="aviso-discreto">
                {aviso}
              </p>
            ))}

            {secundarioVisible ? (
              <div className="color-secundario">
                <div className="color-fila">
                  <input
                    type="color"
                    id="color-secundario"
                    className="color-nativo color-nativo--chico"
                    value={normalizarHex(spec.estilo.colorSecundario ?? '') ?? paleta.textoSuave}
                    onChange={(evento) =>
                      editarEstilo({ colorSecundario: normalizarHex(evento.target.value) })
                    }
                    aria-label="Color secundario"
                  />
                  <label className="micro" htmlFor="color-secundario">
                    <span className="micro-linea" aria-hidden="true" />
                    Secundario — solo detalles
                  </label>
                  <button
                    type="button"
                    className="boton-texto"
                    onClick={() => {
                      editarEstilo({ colorSecundario: null })
                      setSecundarioVisible(false)
                    }}
                  >
                    QUITAR
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="enlace-discreto"
                onClick={() => {
                  setSecundarioVisible(true)
                  editarEstilo({ colorSecundario: paleta.textoSuave })
                }}
              >
                Añadir color secundario
              </button>
            )}
          </section>

          {/* ---------- Bloque B: tipografía ---------- */}
          <section className="bloque">
            <MicroEtiqueta>B — TIPOGRAFÍA</MicroEtiqueta>

            <ListaSeleccion etiqueta="Pares tipográficos" className="opciones">
              {PARES_TIPOGRAFICOS.map((par) => {
                const elegido = spec.estilo.tipografia === par.id
                return (
                  <button
                    key={par.id}
                    type="button"
                    data-fila
                    className={`opcion opcion--tipo${elegido ? ' es-seleccionada' : ''}`}
                    aria-pressed={elegido}
                    onClick={() => editarEstilo({ tipografia: par.id })}
                  >
                    <span className="opcion-num">{par.num}</span>
                    <span className="opcion-cuerpo">
                      <span className="tipo-titulo" style={{ fontFamily: par.display }}>
                        {nombreNegocio}
                      </span>
                      <span className="tipo-linea" style={{ fontFamily: par.texto }}>
                        {lineaMuestra || par.muestra}
                      </span>
                    </span>
                    <span className="opcion-meta">{par.nombre}</span>
                  </button>
                )
              })}
            </ListaSeleccion>
          </section>

          {/* ---------- Bloque C: composición del hero ---------- */}
          <section className="bloque">
            <MicroEtiqueta>C — COMPOSICIÓN DEL HERO</MicroEtiqueta>

            <ListaSeleccion etiqueta="Composición del hero" className="opciones">
              {VARIANTES_HERO.map((variante) => {
                const elegida = spec.estilo.heroVariante === variante.id
                return (
                  <button
                    key={variante.id}
                    type="button"
                    data-fila
                    className={`opcion opcion--hero${elegida ? ' es-seleccionada' : ''}`}
                    aria-pressed={elegida}
                    onClick={() => editarEstilo({ heroVariante: variante.id })}
                  >
                    <span className="opcion-num">{variante.num}</span>
                    <WireframeHero variante={variante.id} />
                    <span className="opcion-cuerpo">
                      <span className="opcion-titulo">{variante.nombre}</span>
                      <span className="fila-desc">{variante.desc}</span>
                    </span>
                  </button>
                )
              })}
            </ListaSeleccion>
          </section>
        </div>

        {/* ---------- Preview vivo ---------- */}
        <div className="estilo-preview">
          <div className="preview-encabezado">
            <MicroEtiqueta>PREVIEW</MicroEtiqueta>
            <button
              type="button"
              className="boton-texto solo-movil"
              aria-expanded={previewAbierto}
              onClick={() => setPreviewAbierto((abierto) => !abierto)}
            >
              {previewAbierto ? 'OCULTAR' : 'VER'}
            </button>
          </div>
          <div className={`preview-caja${previewAbierto ? '' : ' es-colapsado'}`}>
            <Preview spec={spec} />
          </div>
        </div>
      </div>
    </PasoLayout>
  )
}
