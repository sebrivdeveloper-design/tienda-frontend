/**
 * Convierte un error de una petición Axios en un mensaje amigable
 * para mostrar al usuario, sin exponer detalles técnicos.
 *
 * Se centraliza aquí para no repetir esta lógica en cada componente
 * que hace peticiones al backend.
 */
export const obtenerMensajeError = (
  error,
  mensajePorDefecto = "Ocurrió un error inesperado. Intenta nuevamente."
) => {
  if (!error) return mensajePorDefecto;

  // El backend respondió, pero con un código de error (4xx / 5xx)
  if (error.response) {
    const data = error.response.data;

    if (typeof data === "string" && data.trim() !== "") {
      return data;
    }

    if (data?.message) return data.message;
    if (data?.error) return data.error;

    switch (error.response.status) {
      case 400:
        return "Los datos enviados no son válidos. Revisa el formulario.";
      case 404:
        return "El recurso solicitado no fue encontrado.";
      case 409:
        return "Ya existe un registro en conflicto con esta información.";
      case 500:
        return "Error interno del servidor. Intenta más tarde.";
      default:
        return `Ocurrió un error en el servidor (código ${error.response.status}).`;
    }
  }

  // La petición se envió pero no hubo respuesta (servidor caído, sin red, CORS, etc.)
  if (error.request) {
    return "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
  }

  // Error al armar la petición
  return error.message || mensajePorDefecto;
};