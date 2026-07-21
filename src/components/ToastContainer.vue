<template>

  <Teleport to="body">

    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[90vw] max-w-sm">

      <TransitionGroup name="toast">

        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="rounded-lg shadow-lg p-4 text-white flex items-start gap-3"
          :class="clasesPorTipo(toast.tipo)"
          role="alert"
        >

          <span class="text-lg leading-none">
            {{ iconoPorTipo(toast.tipo) }}
          </span>

          <p class="flex-1 text-sm leading-snug">
            {{ toast.mensaje }}
          </p>

          <button
            type="button"
            @click="eliminarToast(toast.id)"
            class="text-white/80 hover:text-white leading-none"
            aria-label="Cerrar notificación"
          >
            ✕
          </button>

        </div>

      </TransitionGroup>

    </div>

  </Teleport>

</template>

<script setup>

import { useToast } from "../composables/useToast";

const { toasts, eliminarToast } = useToast();

const clasesPorTipo = (tipo) => {
  const clases = {
    exito: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return clases[tipo] || "bg-gray-700";
};

const iconoPorTipo = (tipo) => {
  const iconos = {
    exito: "✓",
    error: "⚠",
    info: "ℹ",
  };

  return iconos[tipo] || "•";
};

</script>

<style scoped>

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

</style>