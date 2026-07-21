<template>

  <div>

    <h1 class="text-3xl font-bold mb-6">
      Ingresos
    </h1>

    <div class="bg-white p-6 rounded-lg shadow mb-8">

      <form
        @submit.prevent="guardarIngreso"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
        novalidate
      >

        <div>

          <input
            v-model="valorIngreso"
            :disabled="guardando"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Total ingresos del día"
            class="border p-3 rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="errorValidacion ? 'border-red-500' : ''"
          />

          <p v-if="errorValidacion" class="text-red-500 text-sm mt-1">
            {{ errorValidacion }}
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
          Historial de ingresos
        </h2>

        <span v-if="cargando" class="text-sm text-gray-400">
          Cargando ingresos...
        </span>

      </div>

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

          <tr v-if="!cargando && ingresos.length === 0">

            <td colspan="2" class="p-3 text-center text-gray-400">
              No hay ingresos registrados todavía.
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

import { useToast } from "../composables/useToast";
import { obtenerMensajeError } from "../utils/apiError";
import { esNumeroPositivo } from "../utils/validators";

const toast = useToast();

const ingresos = ref([]);

const valorIngreso = ref(null);

const errorValidacion = ref("");

const cargando = ref(false);
const guardando = ref(false);

const validarIngreso = () => {

  if (!esNumeroPositivo(valorIngreso.value)) {
    errorValidacion.value = "Ingresa un valor numérico mayor a 0.";
    return false;
  }

  errorValidacion.value = "";
  return true;
};

const cargarIngresos = async () => {

  cargando.value = true;

  try {

    ingresos.value = await listarIngresos();

  } catch (error) {

    console.error("Error al cargar ingresos:", error);

    toast.error(
      obtenerMensajeError(error, "No se pudieron cargar los ingresos.")
    );

  } finally {

    cargando.value = false;
  }
};

const guardarIngreso = async () => {

  if (guardando.value) return;

  if (!validarIngreso()) return;

  guardando.value = true;

  try {

    await registrarIngreso(valorIngreso.value);

    valorIngreso.value = null;
    errorValidacion.value = "";

    toast.exito("Ingreso registrado correctamente.");

    await cargarIngresos();

  } catch (error) {

    console.error("Error al registrar el ingreso:", error);

    toast.error(
      obtenerMensajeError(error, "No se pudo registrar el ingreso.")
    );

  } finally {

    guardando.value = false;
  }
};

onMounted(() => {

  cargarIngresos();
});

</script>