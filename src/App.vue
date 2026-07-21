<template>

  <div class="min-h-screen flex">

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

      </nav>

    </aside>

    <main class="flex-1 p-8">

      <router-view />

    </main>

    <ToastContainer />

  </div>

</template>

<script setup>

import ToastContainer from "./components/ToastContainer.vue";

</script>