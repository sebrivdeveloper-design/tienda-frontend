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

        <div>

          <input
            v-model="fecha"
            :disabled="cargando"
            type="date"
            class="border p-3 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="errorValidacion ? 'border-red-500' : ''"
          />

          <p v-if="errorValidacion" class="text-red-500 text-sm mt-1">
            {{ errorValidacion }}
          </p>

        </div>

        <button
          @click="cargarBalance"
          :disabled="cargando"
          class="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
        >
          {{ cargando ? "Consultando..." : "Consultar" }}
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

import { useToast } from "../composables/useToast";
import { obtenerMensajeError } from "../utils/apiError";
import { esVacio } from "../utils/validators";

const toast = useToast();

const fecha = ref(
  new Date().toISOString().split("T")[0]
);

const balance = ref(null);

const errorValidacion = ref("");

const cargando = ref(false);

const cargarBalance = async () => {

  if (cargando.value) return;

  if (esVacio(fecha.value)) {
    errorValidacion.value = "Selecciona una fecha para consultar.";
    return;
  }

  errorValidacion.value = "";
  cargando.value = true;

  try {

    balance.value = await obtenerBalance(fecha.value);

  } catch (error) {

    console.error("Error al obtener el balance del dashboard:", error);

    balance.value = null;

    toast.error(
      obtenerMensajeError(error, "No se pudo cargar el resumen financiero.")
    );

  } finally {

    cargando.value = false;
  }
};

onMounted(() => {

  cargarBalance();
});

</script>