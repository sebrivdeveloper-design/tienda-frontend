<template>

  <div class="bg-white p-6 rounded-xl shadow h-[400px]">

    <Bar
      :data="chartData"
      :options="chartOptions"
    />

  </div>

</template>

<script setup>

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";

import { Bar } from "vue-chartjs";

import { computed } from "vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  balance: Object
});

const chartData = computed(() => ({

  labels: [
    "Ingresos",
    "Compras",
    "Gastos",
    "Balance"
  ],

  datasets: [

    {
      label: "Valores",

      data: [
        props.balance.ingresos,
        props.balance.compras,
        props.balance.gastos,
        props.balance.balance
      ]
    }

  ]
}));

const chartOptions = {

  responsive: true,

  maintainAspectRatio: false
};

</script>

