import { reactive, computed } from "vue";

import {
  guardarSesion,
  cerrarSesion as eliminarSesionDelStorage,
  obtenerUsuario,
} from "../services/authService";

// Estado compartido (singleton) entre todos los componentes que usen
// este composable, para que el sidebar, el router y el login vean
// siempre el mismo estado de sesión sin necesitar una librería de
// manejo de estado (Pinia/Vuex) que el proyecto no tiene instalada.
const estado = reactive({
  usuario: obtenerUsuario(),
});

function iniciarSesion(datosLogin) {
  guardarSesion(datosLogin);
  estado.usuario = obtenerUsuario();
}

function cerrarSesion() {
  eliminarSesionDelStorage();
  estado.usuario = null;
}

export function useAuth() {
  return {
    usuario: computed(() => estado.usuario),
    estaAutenticado: computed(() => estado.usuario !== null),
    iniciarSesion,
    cerrarSesion,
  };
}