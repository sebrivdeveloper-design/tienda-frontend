<template>

  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">

    <div class="w-full max-w-sm">

      <div class="text-center mb-8">

        <h1 class="text-3xl font-bold text-gray-900">
          Tienda
        </h1>

        <p class="text-gray-500 mt-2">
          Inicia sesión para continuar
        </p>

      </div>

      <p
        v-if="mostrarAvisoSesionExpirada"
        class="bg-blue-50 text-blue-700 text-sm rounded p-3 mb-4 text-center"
      >
        Tu sesión expiró. Inicia sesión nuevamente.
      </p>

      <form
        @submit.prevent="manejarSubmit"
        class="bg-white p-8 rounded-lg shadow"
        novalidate
      >

        <div class="mb-5">

          <label class="block text-sm font-medium text-gray-700 mb-1">
            Usuario
          </label>

          <input
            v-model="username"
            :disabled="cargando"
            type="text"
            autocomplete="username"
            class="w-full border p-3 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="errores.username ? 'border-red-500' : ''"
          />

          <p v-if="errores.username" class="text-red-500 text-sm mt-1">
            {{ errores.username }}
          </p>

        </div>

        <div class="mb-6">

          <label class="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>

          <input
            v-model="password"
            :disabled="cargando"
            type="password"
            autocomplete="current-password"
            class="w-full border p-3 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="errores.password ? 'border-red-500' : ''"
          />

          <p v-if="errores.password" class="text-red-500 text-sm mt-1">
            {{ errores.password }}
          </p>

        </div>

        <p v-if="errorLogin" class="text-red-600 text-sm mb-4 text-center">
          {{ errorLogin }}
        </p>

        <button
          type="submit"
          :disabled="cargando"
          class="w-full bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
        >
          {{ cargando ? "Ingresando..." : "Iniciar sesión" }}
        </button>

      </form>

    </div>

  </div>

</template>

<script setup>

import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { login } from "../services/authService";
import { useAuth } from "../composables/useAuth";
import { esVacio } from "../utils/validators";

const route = useRoute();
const router = useRouter();
const { iniciarSesion } = useAuth();

const username = ref("");
const password = ref("");

const errores = ref({ username: "", password: "" });
const errorLogin = ref("");

const cargando = ref(false);

const mostrarAvisoSesionExpirada = computed(
  () => route.query.sesionExpirada === "1"
);

const validar = () => {

  errores.value = { username: "", password: "" };

  if (esVacio(username.value)) {
    errores.value.username = "Ingresa tu usuario.";
  }

  if (esVacio(password.value)) {
    errores.value.password = "Ingresa tu contraseña.";
  }

  return !errores.value.username && !errores.value.password;
};

const manejarSubmit = async () => {

  // Evita disparar múltiples peticiones con dobles clics.
  if (cargando.value) return;

  errorLogin.value = "";

  if (!validar()) return;

  cargando.value = true;

  try {

    const datosLogin = await login(username.value.trim(), password.value);

    iniciarSesion(datosLogin);

    const destino = typeof route.query.redirect === "string"
      ? route.query.redirect
      : "/";

    router.push(destino);

  } catch (error) {

    errorLogin.value = error.message;

  } finally {

    cargando.value = false;
  }
};

</script>