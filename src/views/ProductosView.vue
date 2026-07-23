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

        <div class="flex gap-3">

          <button
            type="submit"
            :disabled="guardando"
            class="bg-blue-600 text-white rounded px-4 py-3 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition flex-1"
          >
            {{ textoBotonGuardar }}
          </button>

          <button
            v-if="modoEdicion"
            type="button"
            :disabled="guardando"
            @click="cancelarEdicion"
            class="bg-gray-200 text-gray-700 rounded px-4 py-3 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Cancelar
          </button>

        </div>

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

            <th class="p-3">
              Acciones
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

            <td class="p-3">

              <button
                type="button"
                :disabled="guardando"
                @click="editarProducto(p)"
                class="text-blue-600 hover:underline text-sm font-medium disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
              >
                Editar
              </button>

            </td>

          </tr>

          <tr v-if="!cargando && productosFiltrados.length === 0">

            <td colspan="3" class="p-3 text-center text-gray-400">
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
  crearProducto,
  actualizarProducto
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

// Estado del modo edición: mientras `productoEnEdicion` sea distinto de
// null, el formulario actúa como "editar" en vez de "crear". Guardamos
// también el porcentaje de ganancia original del producto para poder
// conservarlo tal cual al actualizar (el usuario solo puede tocar el
// nombre; el 25% sigue siendo fijo y no editable desde la UI).
const productoEnEdicion = ref(null);

const modoEdicion = computed(() => productoEnEdicion.value !== null);

const textoBotonGuardar = computed(() => {

  if (guardando.value) {
    return modoEdicion.value ? "Actualizando..." : "Guardando...";
  }

  return modoEdicion.value ? "Actualizar" : "Guardar";
});

const productoVacio = () => ({
  nombre: ""
});

// Objetivo 2 (mejora anterior): se ordenan alfabéticamente en un
// computed, derivado siempre de la lista cruda. El orden se mantiene
// automáticamente al cargar, crear o actualizar.
const productosOrdenados = computed(() => {

  return [...productos.value].sort((a, b) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
  );
});

const productosFiltrados = computed(() => {

  const termino = busqueda.value.trim().toLowerCase();

  if (!termino) return productosOrdenados.value;

  return productosOrdenados.value.filter((p) =>
    p.nombre.toLowerCase().includes(termino)
  );
});

// Un producto puede comprarse muchas veces (eso vive en el historial
// de compras), pero no puede existir registrado más de una vez.
// Al editar, se excluye el propio producto de la comparación: de lo
// contrario, "guardar" un producto sin cambiar su nombre marcaría
// error de duplicado contra sí mismo.
const existeProductoConNombre = (nombre, idAExcluir = null) => {

  const nombreNormalizado = nombre.trim().toLowerCase();

  return productos.value.some(
    (p) =>
      p.id !== idAExcluir &&
      p.nombre.trim().toLowerCase() === nombreNormalizado
  );
};

const validarProducto = () => {

  const nuevosErrores = {};
  const idAExcluir = modoEdicion.value ? productoEnEdicion.value.id : null;

  if (esVacio(producto.value.nombre)) {
    nuevosErrores.nombre = "El nombre del producto es obligatorio.";
  } else if (existeProductoConNombre(producto.value.nombre, idAExcluir)) {
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

const editarProducto = (p) => {

  if (guardando.value) return;

  productoEnEdicion.value = {
    id: p.id,
    porcentajeGanancia: p.porcentajeGanancia
  };

  producto.value = { nombre: p.nombre };
  errores.value = {};
};

const cancelarEdicion = () => {

  if (guardando.value) return;

  productoEnEdicion.value = null;
  producto.value = productoVacio();
  errores.value = {};
};

const crear = async () => {

  // Objetivo 3 (mejora anterior): no se envía porcentajeGanancia.
  // El backend lo asigna automáticamente en 25% cuando el campo no llega.
  await crearProducto({ nombre: producto.value.nombre.trim() });

  toast.exito("Producto guardado correctamente.");
};

const actualizar = async () => {

  // Se envía explícitamente el porcentaje de ganancia original para
  // garantizar que se conserve tal cual, sin depender de que el
  // backend lo tenga que "adivinar" si el campo llegara vacío.
  await actualizarProducto(productoEnEdicion.value.id, {
    nombre: producto.value.nombre.trim(),
    porcentajeGanancia: productoEnEdicion.value.porcentajeGanancia
  });

  toast.exito("Producto actualizado correctamente.");
};

const guardarProducto = async () => {

  // Evita que múltiples clics disparen varias peticiones
  if (guardando.value) return;

  if (!validarProducto()) return;

  guardando.value = true;

  try {

    if (modoEdicion.value) {
      await actualizar();
    } else {
      await crear();
    }

    // El formulario solo se limpia (y vuelve a modo creación) si la
    // operación fue exitosa
    productoEnEdicion.value = null;
    producto.value = productoVacio();
    errores.value = {};

    await cargarProductos();

  } catch (error) {

    console.error("Error al guardar el producto:", error);

    toast.error(
      obtenerMensajeError(
        error,
        modoEdicion.value
          ? "No se pudo actualizar el producto."
          : "No se pudo guardar el producto."
      )
    );

  } finally {

    guardando.value = false;
  }
};

onMounted(() => {

  cargarProductos();
});

</script>