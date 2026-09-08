import { useNavigate } from 'react-router-dom'
import { CampoTexto } from '../components/Campo'
import { IconoQuitar } from '../components/Iconos'
import { MicroEtiqueta } from '../components/MicroEtiqueta'
import { PasoLayout } from '../components/PasoLayout'
import { SubirLogo } from '../components/SubirLogo'
import { rutaSiguiente } from '../lib/pasos'
import { LIMITES, PREFIJO_WHATSAPP, validarPaso5 } from '../lib/spec'
import { useErrores } from '../store/useErrores'
import { useSpec } from '../store/useSpec'

export function Paso5Contenido() {
  const { spec, sinEspacio, editarContenido, editarContacto } = useSpec()
  const { errores, setErrores, limpiar } = useErrores()
  const navigate = useNavigate()

  const { servicios, testimonios, contacto, logo } = spec.contenido

  function continuar() {
    const encontrados = validarPaso5(spec)
    setErrores(encontrados)
    if (Object.keys(encontrados).length === 0) navigate(rutaSiguiente(5))
  }

  return (
    <PasoLayout
      paso={5}
      ayuda="Solo ideas sueltas. Nosotros redactamos los textos finales."
      onContinuar={continuar}
    >
      {/* ---------- Servicios ---------- */}
      <section className="bloque">
        <MicroEtiqueta>Servicios</MicroEtiqueta>

        <ul className="repetible">
          {servicios.map((servicio, indice) => {
            const id = `servicio-${indice}`
            return (
              <li key={id} className="repetible-fila">
                <label className="repetible-num" htmlFor={id}>
                  {String(indice + 1).padStart(2, '0')}
                  <span className="sr-only"> — servicio</span>
                </label>
                <input
                  id={id}
                  className="entrada"
                  value={servicio}
                  maxLength={LIMITES.servicio}
                  placeholder="Ej. Limpieza dental"
                  onChange={(evento) => {
                    editarContenido({
                      servicios: servicios.map((actual, posicion) =>
                        posicion === indice ? evento.target.value : actual,
                      ),
                    })
                    limpiar('servicios')
                  }}
                />
                <button
                  type="button"
                  className="boton-icono"
                  aria-label={`Eliminar servicio ${indice + 1}`}
                  onClick={() =>
                    editarContenido({
                      servicios: servicios.filter((_, posicion) => posicion !== indice),
                    })
                  }
                >
                  <IconoQuitar />
                </button>
              </li>
            )
          })}
        </ul>

        {errores.servicios ? <p className="mensaje-error">{errores.servicios}</p> : null}

        {servicios.length < LIMITES.servicios ? (
          <button
            type="button"
            className="boton-agregar"
            onClick={() => editarContenido({ servicios: [...servicios, ''] })}
          >
            + AGREGAR SERVICIO
          </button>
        ) : (
          <p className="aviso-discreto">Máximo {LIMITES.servicios} servicios.</p>
        )}
      </section>

      {/* ---------- Testimonios ---------- */}
      <section className="bloque">
        <MicroEtiqueta>Testimonios — opcional</MicroEtiqueta>

        {testimonios.map((testimonio, indice) => (
          <div key={`testimonio-${indice}`} className="testimonio">
            <div className="testimonio-encabezado">
              <MicroEtiqueta>{`Testimonio ${String(indice + 1).padStart(2, '0')}`}</MicroEtiqueta>
              <button
                type="button"
                className="boton-icono"
                aria-label={`Eliminar testimonio ${indice + 1}`}
                onClick={() =>
                  editarContenido({
                    testimonios: testimonios.filter((_, posicion) => posicion !== indice),
                  })
                }
              >
                <IconoQuitar />
              </button>
            </div>
            <div className="campos campos--par">
              <CampoTexto
                id={`testimonio-nombre-${indice}`}
                etiqueta="Nombre"
                valor={testimonio.nombre}
                maxLength={LIMITES.nombreTestimonio}
                onCambio={(nombre) =>
                  editarContenido({
                    testimonios: testimonios.map((actual, posicion) =>
                      posicion === indice ? { ...actual, nombre } : actual,
                    ),
                  })
                }
              />
              <CampoTexto
                id={`testimonio-frase-${indice}`}
                etiqueta="Frase corta"
                valor={testimonio.frase}
                maxLength={LIMITES.frase}
                onCambio={(frase) =>
                  editarContenido({
                    testimonios: testimonios.map((actual, posicion) =>
                      posicion === indice ? { ...actual, frase } : actual,
                    ),
                  })
                }
              />
            </div>
          </div>
        ))}

        {testimonios.length < LIMITES.testimonios ? (
          <button
            type="button"
            className="boton-agregar"
            onClick={() =>
              editarContenido({ testimonios: [...testimonios, { nombre: '', frase: '' }] })
            }
          >
            + AGREGAR TESTIMONIO
          </button>
        ) : null}
      </section>

      {/* ---------- Contacto ---------- */}
      <section className="bloque">
        <MicroEtiqueta>Contacto</MicroEtiqueta>

        <div className="campos">
          <CampoTexto
            id="contacto-whatsapp"
            etiqueta="WhatsApp"
            tipo="tel"
            valor={contacto.whatsapp}
            prefijo={PREFIJO_WHATSAPP}
            maxLength={12}
            onCambio={(whatsapp) => {
              editarContacto({ whatsapp })
              limpiar('contacto')
            }}
          />
          <CampoTexto
            id="contacto-correo"
            etiqueta="Correo"
            tipo="email"
            valor={contacto.correo}
            maxLength={60}
            onCambio={(correo) => {
              editarContacto({ correo })
              limpiar('contacto')
            }}
          />
          <CampoTexto
            id="contacto-direccion"
            etiqueta="Dirección"
            valor={contacto.direccion}
            maxLength={80}
            onCambio={(direccion) => editarContacto({ direccion })}
          />
          <div className="campos campos--par">
            <CampoTexto
              id="contacto-instagram"
              etiqueta="Instagram — opcional"
              valor={contacto.instagram}
              maxLength={40}
              onCambio={(instagram) => editarContacto({ instagram })}
            />
            <CampoTexto
              id="contacto-facebook"
              etiqueta="Facebook — opcional"
              valor={contacto.facebook}
              maxLength={40}
              onCambio={(facebook) => editarContacto({ facebook })}
            />
          </div>
        </div>

        {errores.contacto ? <p className="mensaje-error">{errores.contacto}</p> : null}
      </section>

      {/* ---------- Logo ---------- */}
      <section className="bloque">
        <MicroEtiqueta>Logo — opcional</MicroEtiqueta>

        <SubirLogo logo={logo ?? null} onCambio={(nuevo) => editarContenido({ logo: nuevo })} />

        {sinEspacio ? (
          <p className="mensaje-error">
            El navegador se quedó sin espacio para guardar: sube un logo más liviano o quítalo para
            no perder lo que llevas.
          </p>
        ) : null}
      </section>
    </PasoLayout>
  )
}
