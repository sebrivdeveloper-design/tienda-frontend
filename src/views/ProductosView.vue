<template>

  <div>

    <h1 class="text-3xl font-bold mb-6">
      Productos
    </h1>

    <div class="bg-white p-6 rounded-lg shadow mb-8">

      <form
        @submit.prevent="guardarProducto"
        class="grid grid-cols-1 md:grid-cols-3 gap-4"
      >

        <input
          v-model="producto.nombre"
          placeholder="Nombre del producto"
          class="border p-3 rounded"
        />

        <input
          v-model="producto.porcentajeGanancia"
          type="number"
          placeholder="Porcentaje ganancia"
          class="border p-3 rounded"
        />

        <button
          type="submit"
          class="bg-blue-600 text-white rounded px-4 py-3 hover:bg-blue-700"
        >
          Guardar
        </button>

      </form>

    </div>

    <div class="bg-white p-6 rounded-lg shadow overflow-x-auto">

      <h2 class="text-2xl font-bold mb-4">
        Lista de productos
      </h2>

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

const productos = ref([]);

const producto = ref({
  nombre: "",
  porcentajeGanancia: 0
});

const cargarProductos = async () => {

  productos.value = await listarProductos();
};

const guardarProducto = async () => {

  await crearProducto(producto.value);

  producto.value = {
    nombre: "",
    porcentajeGanancia: 0
  };

  cargarProductos();
};

onMounted(() => {

  cargarProductos();
});

</script>