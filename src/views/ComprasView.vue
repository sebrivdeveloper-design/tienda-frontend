<template>

  <div>

    <h1 class="text-3xl font-bold mb-6">
      Compras
    </h1>

    <div class="bg-white p-6 rounded-lg shadow mb-8">

      <form
        @submit.prevent="guardarCompra"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        novalidate
      >

        <div>

  <ProductAutocomplete
    v-model="compra.productoId"
    :productos="productos"
    :disabled="guardando"
    :error="!!errores.productoId"
    placeholder="Buscar producto..."
  />

  <p v-if="errores.productoId" class="text-red-500 text-sm mt-1">
    {{ errores.productoId }}
  </p>

</div>

        <div>

          <input
            v-model="compra.cantidad"
            :disabled="guardando"
            type="number"
            min="1"
            step="1"
            placeholder="Cantidad"
            class="border p-3 rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="errores.cantidad ? 'border-red-500' : ''"
          />

          <p v-if="errores.cantidad" class="text-red-500 text-sm mt-1">
            {{ errores.cantidad }}
          </p>

        </div>

        <div>

          <input
            v-model="compra.totalPagado"
            :disabled="guardando"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Total pagado"
            class="border p-3 rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="errores.totalPagado ? 'border-red-500' : ''"
          />

          <p v-if="errores.totalPagado" class="text-red-500 text-sm mt-1">
            {{ errores.totalPagado }}
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
          Historial de compras
        </h2>

        <span v-if="cargando" class="text-sm text-gray-400">
          Cargando información...
        </span>

      </div>

      <input
        v-model="busqueda"
        placeholder="Buscar producto..."
        class="border p-3 rounded w-full md:w-80 mb-4"
      />

      <table class="w-full border-collapse">

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
               {{ formatearMoneda(c.totalPagado) }}
            </td>

            <td class="p-3">
               {{ formatearMoneda(c.costoUnitario) }}
            </td>

            <td class="p-3 font-semibold text-green-600">
               {{ formatearMoneda(c.precioSugerido) }}
            </td>

            <td class="p-3">
              {{ c.fecha }}
            </td>

          </tr>

          <tr v-if="!cargando && comprasFiltradas.length === 0">

            <td colspan="6" class="p-3 text-center text-gray-400">
              No se encontraron compras.
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

import ProductAutocomplete from "../components/ProductAutocomplete.vue";

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

import { useToast } from "../composables/useToast";
import { obtenerMensajeError } from "../utils/apiError";
import { esVacio, esEnteroPositivo, esNumeroPositivo } from "../utils/validators";

const toast = useToast();

const productos = ref([]);

const compras = ref([]);

const busqueda = ref("");

const errores = ref({});

const cargando = ref(false);
const guardando = ref(false);

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

const compraVacia = () => ({
  productoId: "",
  cantidad: null,
  totalPagado: null
});

const validarCompra = () => {

  const nuevosErrores = {};

  if (esVacio(compra.value.productoId)) {
    nuevosErrores.productoId = "Selecciona un producto.";
  }

  if (!esEnteroPositivo(compra.value.cantidad)) {
    nuevosErrores.cantidad = "La cantidad debe ser un número entero mayor a 0.";
  }

  if (!esNumeroPositivo(compra.value.totalPagado)) {
    nuevosErrores.totalPagado = "El total pagado debe ser mayor a 0.";
  }

  errores.value = nuevosErrores;

  return Object.keys(nuevosErrores).length === 0;
};

const cargarProductos = async () => {

  try {

    productos.value = await listarProductos();

  } catch (error) {

    console.error("Error al cargar productos:", error);

    toast.error(
      obtenerMensajeError(error, "No se pudieron cargar los productos.")
    );
  }
};

const cargarCompras = async () => {

  try {

    compras.value = (await listarCompras()).reverse();

  } catch (error) {

    console.error("Error al cargar compras:", error);

    toast.error(
      obtenerMensajeError(error, "No se pudo cargar el historial de compras.")
    );
  }
};

const cargarDatosIniciales = async () => {

  cargando.value = true;

  try {

    // Se cargan en paralelo porque son independientes entre sí
    await Promise.all([
      cargarProductos(),
      cargarCompras()
    ]);

  } finally {

    cargando.value = false;
  }
};

const guardarCompra = async () => {

  if (guardando.value) return;

  if (!validarCompra()) return;

  guardando.value = true;

  try {

    await crearCompra(compra.value);

    compra.value = compraVacia();
    errores.value = {};

    toast.exito("Compra registrada correctamente.");

    // Solo es necesario recargar las compras, no los productos
    await cargarCompras();

  } catch (error) {

    console.error("Error al registrar la compra:", error);

    toast.error(
      obtenerMensajeError(error, "No se pudo registrar la compra.")
    );

  } finally {

    guardando.value = false;
  }
};

onMounted(() => {

  cargarDatosIniciales();
});

</script>