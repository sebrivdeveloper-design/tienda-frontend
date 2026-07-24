import axios from "axios";

import router from "../router";
import { obtenerToken } from "./authService";
import { useAuth } from "../composables/useAuth";

/**
 * Configura, una única vez (ver main.js), los interceptores globales
 * de Axios. Como todos los services existentes (productoService,
 * compraService, gastoService, ingresoService, balanceService)
 * importan la misma instancia por defecto de "axios", esto agrega
 * autenticación a toda la aplicación sin duplicar código ni tocar
 * esos archivos.
 */
export const configurarInterceptoresAxios = () => {
  axios.interceptors.request.use((config) => {
    const token = obtenerToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const esLlamadaDeLogin = error.config?.url?.includes("/auth/login");

      // El login maneja sus propios errores 401 (credenciales
      // incorrectas) en authService/LoginView, así que aquí solo
      // reaccionamos ante 401/403 de endpoints YA protegidos, típico
      // de un token expirado, inválido o sin permisos suficientes.
      if ((status === 401 || status === 403) && !esLlamadaDeLogin) {
        const { cerrarSesion } = useAuth();
        cerrarSesion();

        if (router.currentRoute.value.name !== "login") {
          router.push({ name: "login", query: { sesionExpirada: "1" } });
        }
      }

      return Promise.reject(error);
    }
  );
};