<template>

  <div class="relative">

    <input
      v-model="busqueda"
      type="text"
      :disabled="disabled"
      :placeholder="placeholder"
      class="border p-3 rounded w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
      :class="error ? 'border-red-500' : ''"
      role="combobox"
      aria-autocomplete="list"
      :aria-expanded="mostrarLista"
      autocomplete="off"
      @focus="abrirLista"
      @input="onInput"
      @keydown.down.prevent="moverSeleccion(1)"
      @keydown.up.prevent="moverSeleccion(-1)"
      @keydown.enter.prevent="seleccionarActivo"
      @keydown.esc.prevent="cerrarLista"
      @blur="cerrarLista"
    />

    <ul
      v-if="mostrarLista && productosFiltrados.length > 0"
      class="absolute z-10 mt-1 w-full max-h-56 overflow-y-auto bg-white border rounded shadow-lg"
    >

      <li
        v-for="(p, index) in productosFiltrados"
        :key="p.id"
        @mousedown.prevent="seleccionar(p)"
        class="p-3 cursor-pointer hover:bg-blue-50"
        :class="index === indiceActivo ? 'bg-blue-50' : ''"
      >
        {{ p.nombre }}
      </li>

    </ul>

    <div
      v-if="mostrarLista && busqueda.trim() && productosFiltrados.length === 0"
      class="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg p-3 text-sm text-gray-400"
    >
      No se encontraron productos.
    </div>

  </div>

</template>

<script setup>

import { ref, computed, watch } from "vue";

const props = defineProps({
  productos: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: [Number, String],
    default: null
  },
  placeholder: {
    type: String,
    default: "Buscar..."
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue"]);

const busqueda = ref("");
const mostrarLista = ref(false);
const indiceActivo = ref(-1);

// Mantiene el texto visible sincronizado con el producto realmente
// seleccionado (modelValue). Se usa tanto al montar como cada vez que
// el padre cambia el valor por fuera (por ejemplo, al limpiar el
// formulario después de guardar una compra).
const sincronizarTextoConSeleccion = () => {

  const seleccionado = props.productos.find(
    (p) => p.id === props.modelValue
  );

  busqueda.value = seleccionado ? seleccionado.nombre : "";
};

watch(
  () => props.modelValue,
  sincronizarTextoConSeleccion,
  { immediate: true }
);

// Filtrado 100% en memoria sobre los productos ya cargados (ninguna
// petición nueva al backend), ignorando mayúsculas/minúsculas y
// espacios al inicio/final.
const productosFiltrados = computed(() => {

  const termino = busqueda.value.trim().toLowerCase();

  if (!termino) return props.productos;

  return props.productos.filter((p) =>
    p.nombre.toLowerCase().includes(termino)
  );
});

const abrirLista = () => {

  if (props.disabled) return;

  mostrarLista.value = true;
  indiceActivo.value = -1;
};

const onInput = () => {

  mostrarLista.value = true;
  indiceActivo.value = -1;
};

const moverSeleccion = (direccion) => {

  if (props.disabled) return;

  if (!mostrarLista.value) {
    abrirLista();
    return;
  }

  const total = productosFiltrados.value.length;

  if (total === 0) return;

  indiceActivo.value = (indiceActivo.value + direccion + total) % total;
};

const seleccionarActivo = () => {

  if (!mostrarLista.value) return;

  const producto = productosFiltrados.value[indiceActivo.value];

  if (producto) seleccionar(producto);
};

const seleccionar = (producto) => {

  emit("update:modelValue", producto.id);

  busqueda.value = producto.nombre;
  mostrarLista.value = false;
  indiceActivo.value = -1;
};

const cerrarLista = () => {

  mostrarLista.value = false;
  indiceActivo.value = -1;

  // Si lo que quedó escrito no coincide con el producto seleccionado
  // (por ejemplo, el usuario escribió y se fue sin elegir nada), se
  // restaura el texto al nombre real, o se limpia si no hay selección.
  sincronizarTextoConSeleccion();
};

</script>