<template>

  <div>

    <h1 class="text-3xl font-bold mb-6">
      Gastos
    </h1>

    <div class="bg-white p-6 rounded-lg shadow mb-8">

      <form
        @submit.prevent="guardarGasto"
        class="grid grid-cols-1 md:grid-cols-4 gap-4"
      >

        <input
          v-model="gasto.tipo"
          placeholder="Tipo"
          class="border p-3 rounded"
        />

        <input
          v-model="gasto.descripcion"
          placeholder="Descripción"
          class="border p-3 rounded"
        />

        <input
          v-model="gasto.valor"
          type="number"
          placeholder="Valor"
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
        Historial de gastos
      </h2>

      <table class="w-full border-collapse">

        <thead>

          <tr class="bg-gray-100 text-left">

            <th class="p-3">
              Tipo
            </th>

            <th class="p-3">
              Descripción
            </th>

            <th class="p-3">
              Valor
            </th>

            <th class="p-3">
              Fecha
            </th>

          </tr>

        </thead>

        <tbody>

          <tr
            v-for="g in gastos"
            :key="g.id"
            class="border-b hover:bg-gray-50"
          >

            <td class="p-3">
              {{ g.tipo }}
            </td>

            <td class="p-3">
              {{ g.descripcion }}
            </td>

            <td class="p-3 text-red-500 font-semibold">
              $ {{ g.valor }}
            </td>

            <td class="p-3">
              {{ g.fecha }}
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
  listarGastos,
  crearGasto
} from "../services/gastoService";

const gastos = ref([]);

const gasto = ref({
  tipo: "",
  descripcion: "",
  valor: null
});

const cargarGastos = async () => {

  gastos.value = await listarGastos();
};

const guardarGasto = async () => {

  await crearGasto(gasto.value);

  gasto.value = {
    tipo: "",
    descripcion: "",
    valor: null
  };

  cargarGastos();
};

onMounted(() => {

  cargarGastos();
});

</script>