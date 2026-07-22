<template>

  <div>

    <h1 class="text-3xl font-bold mb-6">
      Productos
    </h1>

    <div class="bg-white p-6 rounded-lg shadow mb-8">

      <form
        @submit.prevent="guardarProducto"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
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

      <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">

        <h2 class="text-2xl font-bold">
          Lista de productos
        </h2>

        <span v-if="cargando" class="text-sm text-gray-400">
          Cargando productos...
        </span>

      </div>

      <input
        v-model="busqueda"
        placeholder="Buscar producto por nombre..."
        class="border p-3 rounded w-full md:w-80 mb-4"
      />

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
            v-for="p in productosFiltrados"
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

          <tr v-if="!cargando && productosFiltrados.length === 0">

            <td colspan="2" class="p-3 text-center text-gray-400">
              {{
                busqueda.trim()
                  ? "No se encontraron productos que coincidan con la búsqueda."
                  : "No hay productos registrados todavía."
              }}
            </td>

          </tr>

        </tbody>

      </table>

    </div>

  </div>

</template>

<script setup>

import { ref, computed, onMounted } from "vue";

import {
  listarProductos,
  crearProducto
} from "../services/productoService";

import { useToast } from "../composables/useToast";
import { obtenerMensajeError } from "../utils/apiError";
import { esVacio } from "../utils/validators";

const toast = useToast();

const productos = ref([]);

const busqueda = ref("");

const producto = ref({
  nombre: ""
});

const errores = ref({});

const cargando = ref(false);
const guardando = ref(false);

const productoVacio = () => ({
  nombre: ""
});

// Objetivo 2: se ordenan alfabéticamente en un computed, derivado
// siempre de la lista cruda. Así el orden se mantiene automáticamente
// sin importar en qué orden responda el backend, ya sea al cargar la
// página, después de crear un producto o si en el futuro se agrega
// edición: cualquier cambio en `productos` se reordena solo.
const productosOrdenados = computed(() => {

  return [...productos.value].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
  );
});

// Objetivo 1: filtrado en tiempo real por nombre, sin distinguir
// mayúsculas/minúsculas, sobre la lista ya ordenada. Si la búsqueda
// está vacía, se muestran todos los productos.
const productosFiltrados = computed(() => {

  const termino = busqueda.value.trim().toLowerCase();

  if (!termino) return productosOrdenados.value;

  return productosOrdenados.value.filter((p) =>
    p.nombre.toLowerCase().includes(termino)
  );
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

    // Objetivo 3: ya no se envía porcentajeGanancia. El backend lo
    // asigna automáticamente en 25% cuando el campo no llega.
    await crearProducto({ nombre: producto.value.nombre.trim() });

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