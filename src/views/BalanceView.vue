<template>

  <div>

    <h1 class="text-3xl font-bold mb-6">
      Balance Diario
    </h1>

    <div class="bg-white p-6 rounded-lg shadow mb-6">

      <div class="flex gap-4 items-start">

        <div>

          <input
            v-model="fecha"
            :disabled="cargando"
            type="date"
            class="border p-2 rounded w-60 disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="errorValidacion ? 'border-red-500' : ''"
          />

          <p v-if="errorValidacion" class="text-red-500 text-sm mt-1">
            {{ errorValidacion }}
          </p>

        </div>

        <button
          @click="cargarBalance"
          :disabled="cargando"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
        >
          {{ cargando ? "Consultando..." : "Consultar" }}
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

    <div
      v-else-if="!cargando && consultaRealizada"
      class="bg-white p-6 rounded-lg shadow text-center text-gray-400"
    >
      No se encontró información de balance para la fecha seleccionada.
    </div>

  </div>

</template>

<script setup>

import { ref } from "vue";

import {
  obtenerBalance
} from "../services/balanceService";

import { useToast } from "../composables/useToast";
import { obtenerMensajeError } from "../utils/apiError";
import { esVacio } from "../utils/validators";

const toast = useToast();

const fecha = ref("");

const balance = ref(null);

const errorValidacion = ref("");

const cargando = ref(false);
const consultaRealizada = ref(false);

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
    consultaRealizada.value = true;

  } catch (error) {

    console.error("Error al obtener el balance:", error);

    balance.value = null;

    toast.error(
      obtenerMensajeError(error, "No se pudo obtener el balance del día.")
    );

  } finally {

    cargando.value = false;
  }
};

</script>