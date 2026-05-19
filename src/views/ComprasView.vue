<template>

  <div>

    <h1 class="text-3xl font-bold mb-6">
      Compras
    </h1>

    <div class="bg-white p-6 rounded-lg shadow mb-8">

      <form
        @submit.prevent="guardarCompra"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >

        <select
          v-model="compra.productoId"
          class="border p-3 rounded"
        >

          <option disabled value="">
            Selecciona un producto
          </option>

          <option
            v-for="producto in productos"
            :key="producto.id"
            :value="producto.id"
          >
            {{ producto.nombre }}
          </option>

        </select>

        <input
          v-model="compra.cantidad"
          type="number"
          placeholder="Cantidad"
          class="border p-3 rounded"
        />

        <input
          v-model="compra.totalPagado"
          type="number"
          placeholder="Total pagado"
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
        Historial de compras
      </h2>

      <input
        v-model="busqueda"
        placeholder="Buscar producto..."
        class="border p-3 rounded w-full md:w-80"
      />

      <table class="w-full border-collapse">

        <div class="mb-4">

  

</div>

        <thead>

          <tr class="bg-gray-100 text-left">

            <th class="p-3">Producto</th>

            <th class="p-3">Cantidad</th>

            <th class="p-3">Total</th>

            <th class="p-3">Costo Unitario</th>

            <th class="p-3">Precio Sugerido</th>

            <th class="p-3">Fecha</th>

          </tr>

        </thead>

        <tbody>

          <tr
            v-for="c in comprasFiltradas"
            :key="c.id"
            class="border-b hover:bg-gray-50"
          >

            <td class="p-3">
              {{ c.producto.nombre }}
            </td>

            <td class="p-3">
              {{ c.cantidad }}
            </td>

            <td class="p-3">
              $ {{ formatearMoneda(c.totalPagado) }}
            </td>

            <td class="p-3">
              $ {{ formatearMoneda(c.costoUnitario) }}
            </td>

            <td class="p-3 font-semibold text-green-600">
              $ {{ formatearMoneda(c.precioSugerido) }}
            </td>

            <td class="p-3">
              {{ c.fecha }}
            </td>

          </tr>

        </tbody>

      </table>

    </div>

  </div>

</template>

<script setup>

import {
  ref,
  onMounted,
  computed
} from "vue";

import {
  formatearMoneda
} from "../utils/formatters";

import {
  listarCompras,
  crearCompra
} from "../services/compraService";

import {
  listarProductos
} from "../services/productoService";

const productos = ref([]);

const compras = ref([]);

const busqueda = ref("");

const comprasFiltradas = computed(() => {

  return compras.value.filter(c =>

    c.producto.nombre
      .toLowerCase()
      .includes(
        busqueda.value.toLowerCase()
      )
  );
});

const compra = ref({
  productoId: "",
  cantidad: null,
  totalPagado: null
});

const cargarProductos = async () => {

  productos.value = await listarProductos();
};

const cargarCompras = async () => {

  compras.value = (await listarCompras()).reverse();
};

const guardarCompra = async () => {

  await crearCompra(compra.value);

  compra.value = {
    productoId: "",
    cantidad: null,
    totalPagado: null
  };

  cargarCompras();
};

onMounted(() => {

  cargarProductos();

  cargarCompras();
});

</script>