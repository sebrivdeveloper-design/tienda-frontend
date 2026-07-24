<template>
  <div v-if="esRutaPublica" class="min-h-screen">
    <router-view />
    <ToastContainer />
  </div>

  <div v-else class="min-h-screen flex">
  

    <aside class="w-64 bg-gray-900 text-white p-5 flex flex-col">

      <div class="mb-10">

        <h1 class="text-3xl font-bold">
          Tienda
        </h1>

        <p class="text-gray-400 text-sm mt-2">
          Sistema administrativo
        </p>

      </div>

      <nav class="flex flex-col gap-2">

        <router-link
          to="/"
          class="p-3 rounded hover:bg-gray-700 transition"
        >
          Dashboard
        </router-link>

        <router-link
          to="/productos"
          class="p-3 rounded hover:bg-gray-700 transition"
        >
          Productos
        </router-link>

        <router-link
          to="/compras"
          class="p-3 rounded hover:bg-gray-700 transition"
        >
          Compras
        </router-link>

        <router-link
          to="/ingresos"
          class="p-3 rounded hover:bg-gray-700 transition"
        >
          Ingresos
        </router-link>

        <router-link
          to="/gastos"
          class="p-3 rounded hover:bg-gray-700 transition"
        >
          Gastos
        </router-link>

        <router-link
          to="/balance"
          class="p-3 rounded hover:bg-gray-700 transition"
        >
          Balance
        </router-link>

      <div class="border-t border-gray-700 pt-4 mt-4"></div>

        <p v-if="usuario" class="text-sm text-gray-300 mb-3 truncate">
          Conectado como
          <span class="font-semibold text-white">{{ usuario.nombre }}</span>
        </p>

        <button
          type="button"
          @click="manejarCerrarSesion"
          class="w-full text-left p-3 rounded hover:bg-gray-700 transition text-red-300 hover:text-red-200"
        >
          Cerrar sesión
        </button>

      </nav>

    </aside>

    <main class="flex-1 p-8">

      <router-view />

    </main>

    <ToastContainer />

  </div>
  

</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuth } from "./composables/useAuth";

import ToastContainer from "./components/ToastContainer.vue";

const route = useRoute();
const router = useRouter();
const { usuario, cerrarSesion } = useAuth();

const esRutaPublica = computed(() => route.meta.publico === true);

const manejarCerrarSesion = () => {
  cerrarSesion();
  router.push({ name: "login" });
};

</script>