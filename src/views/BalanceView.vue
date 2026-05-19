<template>

  <div>

    <h1 class="text-3xl font-bold mb-6">
      Balance Diario
    </h1>

    <div class="bg-white p-6 rounded-lg shadow mb-6">

      <div class="flex gap-4 items-center">

        <input
          v-model="fecha"
          type="date"
          class="border p-2 rounded w-60"
        />

        <button
          @click="cargarBalance"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Consultar
        </button>

      </div>

    </div>

    <div
      v-if="balance"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >

      <div class="bg-white p-6 rounded-lg shadow">

        <h2 class="text-gray-500 text-sm mb-2">
          INGRESOS
        </h2>

        <p class="text-3xl font-bold text-green-600">
          $ {{ balance.ingresos }}
        </p>

      </div>

      <div class="bg-white p-6 rounded-lg shadow">

        <h2 class="text-gray-500 text-sm mb-2">
          COMPRAS
        </h2>

        <p class="text-3xl font-bold text-red-500">
          $ {{ balance.compras }}
        </p>

      </div>

      <div class="bg-white p-6 rounded-lg shadow">

        <h2 class="text-gray-500 text-sm mb-2">
          GASTOS
        </h2>

        <p class="text-3xl font-bold text-orange-500">
          $ {{ balance.gastos }}
        </p>

      </div>

      <div class="bg-white p-6 rounded-lg shadow">

        <h2 class="text-gray-500 text-sm mb-2">
          BALANCE
        </h2>

        <p
          class="text-3xl font-bold"
          :class="
            balance.balance >= 0
              ? 'text-green-600'
              : 'text-red-600'
          "
        >
          $ {{ balance.balance }}
        </p>

      </div>

    </div>

  </div>

</template>

<script setup>

import { ref } from "vue";

import {
  obtenerBalance
} from "../services/balanceService";

const fecha = ref("");

const balance = ref(null);

const cargarBalance = async () => {

  balance.value = await obtenerBalance(
    fecha.value
  );
};

</script>