import { createRouter, createWebHistory } from "vue-router";

import ProductosView from "../views/ProductosView.vue";
import ComprasView from "../views/ComprasView.vue";
import GastosView from "../views/GastosView.vue";
import BalanceView from "../views/BalanceView.vue";
import IngresosView from "../views/IngresosView.vue";
import HomeView from "../views/HomeView.vue";

const routes = [
    {
        path: "/",
        component: HomeView
    },
    {
        path: "/productos",
        component: ProductosView
    },
    {
        path: "/compras",
        component: ComprasView
    },
    {
        path: "/gastos",
        component: GastosView
    },
    {
        path: "/ingresos",
        component: IngresosView
    },
    {
        path: "/balance",
        component: BalanceView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;