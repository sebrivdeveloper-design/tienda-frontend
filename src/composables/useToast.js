import { reactive } from "vue";

// Estado compartido (singleton) entre todos los componentes que
// usen este composable, para poder tener un único contenedor
// global de notificaciones (ver components/ToastContainer.vue).
const toasts = reactive([]);

let idCounter = 0;

const DURACION_POR_DEFECTO = 4000;

function eliminarToast(id) {
  const index = toasts.findIndex((toast) => toast.id === id);

  if (index !== -1) {
    toasts.splice(index, 1);
  }
}

function agregarToast(mensaje, tipo, duracion) {
  const id = ++idCounter;

  toasts.push({ id, mensaje, tipo });

  if (duracion > 0) {
    setTimeout(() => eliminarToast(id), duracion);
  }

  return id;
}

/**
 * Sistema simple de notificaciones (Toast) construido con Tailwind,
 * pensado como alternativa liviana a librerías como SweetAlert2 o
 * vue-toastification, que no están instaladas en el proyecto.
 */
export function useToast() {
  return {
    toasts,
    exito: (mensaje, duracion = DURACION_POR_DEFECTO) =>
      agregarToast(mensaje, "exito", duracion),
    error: (mensaje, duracion = DURACION_POR_DEFECTO + 1500) =>
      agregarToast(mensaje, "error", duracion),
    info: (mensaje, duracion = DURACION_POR_DEFECTO) =>
      agregarToast(mensaje, "info", duracion),
    eliminarToast,
  };
}