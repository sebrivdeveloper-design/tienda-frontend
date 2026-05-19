<template>

  <div>

    <div class="mb-8">

      <h1 class="text-4xl font-bold">
        Dashboard
      </h1>

      <p class="text-gray-500 mt-2">
        Resumen financiero del día
      </p>

    </div>

    <div class="bg-white p-6 rounded-lg shadow mb-8">

      <div class="flex flex-col md:flex-row gap-4 items-start md:items-center">

        <input
          v-model="fecha"
          type="date"
          class="border p-3 rounded"
        />

        <button
          @click="cargarBalance"
          class="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700"
        >
          Consultar
        </button>

      </div>

    </div>

    <div
      v-if="balance"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
    >

      <div class="bg-white p-6 rounded-xl shadow">

        <p class="text-gray-500 text-sm mb-2">
          INGRESOS
        </p>

        <h2 class="text-4xl font-bold text-green-600">
          $ {{ balance.ingresos }}
        </h2>

      </div>

      <div class="bg-white p-6 rounded-xl shadow">

        <p class="text-gray-500 text-sm mb-2">
          COMPRAS
        </p>

        <h2 class="text-4xl font-bold text-red-500">
          $ {{ balance.compras }}
        </h2>

      </div>

      <div class="bg-white p-6 rounded-xl shadow">

        <p class="text-gray-500 text-sm mb-2">
          GASTOS
        </p>

        <h2 class="text-4xl font-bold text-orange-500">
          $ {{ balance.gastos }}
        </h2>

      </div>

      <div class="bg-white p-6 rounded-xl shadow">

        <p class="text-gray-500 text-sm mb-2">
          BALANCE
        </p>

        <h2
          class="text-4xl font-bold"
          :class="
            balance.balance >= 0
              ? 'text-green-600'
              : 'text-red-600'
          "
        >
          $ {{ balance.balance }}
        </h2>
        

      </div>

    </div>

    <div
      v-if="balance"
      class="mt-8"
    >

      <BalanceChart :balance="balance" />

    </div>

  </div>

</template>

<script setup>

import {
  ref,
  onMounted
} from "vue";

import BalanceChart from "../components/BalanceChart.vue";

import {
  obtenerBalance
} from "../services/balanceService";

const fecha = ref(
  new Date().toISOString().split("T")[0]
);

const balance = ref(null);

const cargarBalance = async () => {

  balance.value = await obtenerBalance(
    fecha.value
  );
};

onMounted(() => {

  cargarBalance();
});

</script>