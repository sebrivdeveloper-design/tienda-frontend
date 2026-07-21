<template>

  <div>

    <h1 class="text-3xl font-bold mb-6">
      Productos
    </h1>

    <div class="bg-white p-6 rounded-lg shadow mb-8">

      <form
        @submit.prevent="guardarProducto"
        class="grid grid-cols-1 md:grid-cols-3 gap-4"
        novalidate
      >

        <div>

          <input
            v-model="producto.nombre"
            :disabled="guardando"
            placeholder="Nombre del producto"
            class="border p-3 rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="errores.nombre ? 'border-red-500' : ''"
          />

          <p v-if="errores.nombre" class="text-red-500 text-sm mt-1">
            {{ errores.nombre }}
          </p>

        </div>

        <div>

          <input
            v-model="producto.porcentajeGanancia"
            :disabled="guardando"
            type="number"
            step="0.01"
            placeholder="Porcentaje ganancia"
            class="border p-3 rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="errores.porcentajeGanancia ? 'border-red-500' : ''"
          />

          <p v-if="errores.porcentajeGanancia" class="text-red-500 text-sm mt-1">
            {{ errores.porcentajeGanancia }}
          </p>

        </div>

        <button
          type="submit"
          :disabled="guardando"
          class="bg-blue-600 text-white rounded px-4 py-3 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
        >
          {{ guardando ? "Guardando..." : "Guardar" }}
        </button>

      </form>

    </div>

    <div class="bg-white p-6 rounded-lg shadow overflow-x-auto">

      <div class="flex justify-between items-center mb-4">

        <h2 class="text-2xl font-bold">
          Lista de productos
        </h2>

        <span v-if="cargando" class="text-sm text-gray-400">
          Cargando productos...
        </span>

      </div>

      <table class="w-full border-collapse">

        <thead>

          <tr class="bg-gray-100 text-left">

            <th class="p-3">
              Nombre
            </th>

            <th class="p-3">
              % Ganancia
            </th>

          </tr>

        </thead>

        <tbody>

          <tr
            v-for="p in productos"
            :key="p.id"
            class="border-b hover:bg-gray-50"
          >

            <td class="p-3">
              {{ p.nombre }}
            </td>

            <td class="p-3">
              {{ p.porcentajeGanancia }}%
            </td>

          </tr>

          <tr v-if="!cargando && productos.length === 0">

            <td colspan="2" class="p-3 text-center text-gray-400">
              No hay productos registrados todavía.
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
  listarProductos,
  crearProducto
} from "../services/productoService";

import { useToast } from "../composables/useToast";
import { obtenerMensajeError } from "../utils/apiError";
import { esVacio, esNumeroNoNegativo } from "../utils/validators";

const toast = useToast();

const productos = ref([]);

const producto = ref({
  nombre: "",
  porcentajeGanancia: 0
});

const errores = ref({});

const cargando = ref(false);
const guardando = ref(false);

const productoVacio = () => ({
  nombre: "",
  porcentajeGanancia: 0
});

// Un producto puede comprarse muchas veces (eso vive en el historial
// de compras), pero no puede existir registrado más de una vez.
const existeProductoConNombre = (nombre) => {

  const nombreNormalizado = nombre.trim().toLowerCase();

  return productos.value.some(
    (p) => p.nombre.trim().toLowerCase() === nombreNormalizado
  );
};

const validarProducto = () => {

  const nuevosErrores = {};

  if (esVacio(producto.value.nombre)) {
    nuevosErrores.nombre = "El nombre del producto es obligatorio.";
  } else if (existeProductoConNombre(producto.value.nombre)) {
    nuevosErrores.nombre = "Ya existe un producto registrado con ese nombre.";
  }

  if (!esNumeroNoNegativo(producto.value.porcentajeGanancia)) {
    nuevosErrores.porcentajeGanancia =
      "Ingresa un porcentaje de ganancia válido (0 o mayor).";
  }

  errores.value = nuevosErrores;

  return Object.keys(nuevosErrores).length === 0;
};

const cargarProductos = async () => {

  cargando.value = true;

  try {

    productos.value = await listarProductos();

  } catch (error) {

    console.error("Error al cargar productos:", error);

    toast.error(
      obtenerMensajeError(error, "No se pudieron cargar los productos.")
    );

  } finally {

    cargando.value = false;
  }
};

const guardarProducto = async () => {

  // Evita que múltiples clics disparen varias peticiones
  if (guardando.value) return;

  if (!validarProducto()) return;

  guardando.value = true;

  try {

    await crearProducto(producto.value);

    // El formulario solo se limpia si la operación fue exitosa
    producto.value = productoVacio();
    errores.value = {};

    toast.exito("Producto guardado correctamente.");

    await cargarProductos();

  } catch (error) {

    console.error("Error al guardar el producto:", error);

    toast.error(
      obtenerMensajeError(error, "No se pudo guardar el producto.")
    );

  } finally {

    guardando.value = false;
  }
};

onMounted(() => {

  cargarProductos();
});

</script>