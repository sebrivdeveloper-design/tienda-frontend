<template>

  <div>

    <h1 class="text-3xl font-bold mb-6">
      Ingresos
    </h1>

    <div class="bg-white p-6 rounded-lg shadow mb-8">

      <form
        @submit.prevent="guardarIngreso"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >

        <input
          v-model="valorIngreso"
          type="number"
          placeholder="Total ingresos del día"
          class="border p-3 rounded"
        />

        <button
          type="submit"
          class="bg-blue-600 text-white rounded px-4 py-3 hover:bg-blue-700"
        >
          Registrar
        </button>

      </form>

    </div>

    <div class="bg-white p-6 rounded-lg shadow overflow-x-auto">

      <h2 class="text-2xl font-bold mb-4">
        Historial de ingresos
      </h2>

      <table class="w-full border-collapse">

        <thead>

          <tr class="bg-gray-100 text-left">

            <th class="p-3">
              Fecha
            </th>

            <th class="p-3">
              Total ingresos
            </th>

          </tr>

        </thead>

        <tbody>

          <tr
            v-for="i in ingresos"
            :key="i.id"
            class="border-b hover:bg-gray-50"
          >

            <td class="p-3">
              {{ i.fecha }}
            </td>

            <td class="p-3 text-green-600 font-semibold">
              $ {{ i.totalIngresos }}
            </td>

          </tr>

        </tbody>

      </table>

    </div>

  </div>

</template>

<script setup>

import { ref, onMounted } from "vue";

import {
  registrarIngreso,
  listarIngresos
} from "../services/ingresoService";

const ingresos = ref([]);

const valorIngreso = ref(null);

const cargarIngresos = async () => {

  ingresos.value = await listarIngresos();
};

const guardarIngreso = async () => {

  await registrarIngreso(valorIngreso.value);

  valorIngreso.value = null;

  cargarIngresos();
};

onMounted(() => {

  cargarIngresos();
});

</script>