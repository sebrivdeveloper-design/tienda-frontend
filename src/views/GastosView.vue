<template>

  <div>

    <h1 class="text-3xl font-bold mb-6">
      Gastos
    </h1>

    <div class="bg-white p-6 rounded-lg shadow mb-8">

      <form
        @submit.prevent="guardarGasto"
        class="grid grid-cols-1 md:grid-cols-4 gap-4"
        novalidate
      >

        <div>

          <input
            v-model="gasto.tipo"
            :disabled="guardando"
            placeholder="Tipo"
            class="border p-3 rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="errores.tipo ? 'border-red-500' : ''"
          />

          <p v-if="errores.tipo" class="text-red-500 text-sm mt-1">
            {{ errores.tipo }}
          </p>

        </div>

        <div>

          <input
            v-model="gasto.descripcion"
            :disabled="guardando"
            placeholder="Descripción"
            class="border p-3 rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="errores.descripcion ? 'border-red-500' : ''"
          />

          <p v-if="errores.descripcion" class="text-red-500 text-sm mt-1">
            {{ errores.descripcion }}
          </p>

        </div>

        <div>

          <input
            v-model="gasto.valor"
            :disabled="guardando"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Valor"
            class="border p-3 rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="errores.valor ? 'border-red-500' : ''"
          />

          <p v-if="errores.valor" class="text-red-500 text-sm mt-1">
            {{ errores.valor }}
          </p>

        </div>

        <button
          type="submit"
          :disabled="guardando"
          class="bg-blue-600 text-white rounded px-4 py-3 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
        >
          {{ guardando ? "Guardando..." : "Registrar" }}
        </button>

      </form>

    </div>

    <div class="bg-white p-6 rounded-lg shadow overflow-x-auto">

      <div class="flex justify-between items-center mb-4">

        <h2 class="text-2xl font-bold">
          Historial de gastos
        </h2>

        <span v-if="cargando" class="text-sm text-gray-400">
          Cargando gastos...
        </span>

      </div>

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

          <tr v-if="!cargando && gastos.length === 0">

            <td colspan="4" class="p-3 text-center text-gray-400">
              No hay gastos registrados todavía.
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

import { useToast } from "../composables/useToast";
import { obtenerMensajeError } from "../utils/apiError";
import { esVacio, esNumeroPositivo } from "../utils/validators";

const toast = useToast();

const gastos = ref([]);

const gasto = ref({
  tipo: "",
  descripcion: "",
  valor: null
});

const errores = ref({});

const cargando = ref(false);
const guardando = ref(false);

const gastoVacio = () => ({
  tipo: "",
  descripcion: "",
  valor: null
});

const validarGasto = () => {

  const nuevosErrores = {};

  if (esVacio(gasto.value.tipo)) {
    nuevosErrores.tipo = "El tipo de gasto es obligatorio.";
  }

  if (esVacio(gasto.value.descripcion)) {
    nuevosErrores.descripcion = "La descripción es obligatoria.";
  }

  if (!esNumeroPositivo(gasto.value.valor)) {
    nuevosErrores.valor = "El valor debe ser un número mayor a 0.";
  }

  errores.value = nuevosErrores;

  return Object.keys(nuevosErrores).length === 0;
};

const cargarGastos = async () => {

  cargando.value = true;

  try {

    gastos.value = await listarGastos();

  } catch (error) {

    console.error("Error al cargar gastos:", error);

    toast.error(
      obtenerMensajeError(error, "No se pudieron cargar los gastos.")
    );

  } finally {

    cargando.value = false;
  }
};

const guardarGasto = async () => {

  if (guardando.value) return;

  if (!validarGasto()) return;

  guardando.value = true;

  try {

    await crearGasto(gasto.value);

    gasto.value = gastoVacio();
    errores.value = {};

    toast.exito("Gasto registrado correctamente.");

    await cargarGastos();

  } catch (error) {

    console.error("Error al registrar el gasto:", error);

    toast.error(
      obtenerMensajeError(error, "No se pudo registrar el gasto.")
    );

  } finally {

    guardando.value = false;
  }
};

onMounted(() => {

  cargarGastos();
});

</script>