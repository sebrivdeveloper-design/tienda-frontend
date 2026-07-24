import axios from "axios";

const API_URL = "https://tienda-backend-ud29.onrender.com/auth";

// Claves usadas en localStorage. Van prefijadas para poder eliminar
// únicamente lo relacionado con la sesión (nunca localStorage.clear()),
// sin afectar otras configuraciones que puedan guardarse ahí a futuro.
const TOKEN_KEY = "tienda_auth_token";
const USUARIO_KEY = "tienda_auth_usuario";

/**
 * Autentica al usuario contra el backend y devuelve la respuesta
 * (token, tipo, expiraEn, nombre, rol). No persiste la sesión: eso
 * es responsabilidad de useAuth().iniciarSesion(), para mantener el
 * almacenamiento y el estado reactivo sincronizados en un único lugar.
 *
 * Lanza un Error con un mensaje ya traducido y amigable para poder
 * mostrarlo directamente en la UI (ver LoginView.vue).
 */
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(traducirErrorLogin(error));
  }
};

const traducirErrorLogin = (error) => {
  // El backend respondió, pero con un código de error (4xx / 5xx)
  if (error.response) {
    const mensajeBackend = error.response.data?.mensaje;

    if (mensajeBackend) return mensajeBackend;

    switch (error.response.status) {
      case 400:
        return "Ingresa tu usuario y contraseña.";
      case 401:
        return "Usuario o contraseña incorrectos.";
      case 403:
        return "El usuario está inactivo. Contacta al administrador.";
      default:
        return "Ocurrió un error al iniciar sesión. Intenta nuevamente.";
    }
  }

  // La petición se envió pero no hubo respuesta (servidor caído, sin red, CORS, etc.)
  if (error.request) {
    return "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
  }

  return error.message || "Ocurrió un error inesperado. Intenta nuevamente.";
};

export const guardarSesion = (datosLogin) => {
  localStorage.setItem(TOKEN_KEY, datosLogin.token);
  localStorage.setItem(
    USUARIO_KEY,
    JSON.stringify({
      nombre: datosLogin.nombre,
      rol: datosLogin.rol,
    })
  );
};

/**
 * Elimina ÚNICAMENTE el JWT y los datos del usuario autenticado.
 * Nunca usa localStorage.clear(), para no borrar otras configuraciones
 * que puedan existir en el navegador del usuario.
 */
export const cerrarSesion = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USUARIO_KEY);
};

export const obtenerToken = () => localStorage.getItem(TOKEN_KEY);

export const obtenerUsuario = () => {
  const raw = localStorage.getItem(USUARIO_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const estaAutenticado = () => obtenerToken() !== null;