import { createRouter, createWebHistory } from "vue-router";

import ProductosView from "../views/ProductosView.vue";
import ComprasView from "../views/ComprasView.vue";
import GastosView from "../views/GastosView.vue";
import BalanceView from "../views/BalanceView.vue";
import IngresosView from "../views/IngresosView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import { useAuth } from "../composables/useAuth";

const routes = [

    {
        path: "/login",
        name: "login",
        component: LoginView,
        // Única ruta pública de todo el frontend: el resto requiere
        // sesión iniciada (ver router.beforeEach más abajo).
        meta: { publico: true }
    },
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

// Guard global: bloquea el acceso a cualquier vista privada si no hay
// sesión iniciada, y evita volver a /login si el usuario ya está
// autenticado (debe cerrar sesión primero).
router.beforeEach((to) => {

    const { estaAutenticado } = useAuth();

    if (!to.meta.publico && !estaAutenticado.value) {
        return { name: "login", query: { redirect: to.fullPath } };
    }

    if (to.meta.publico && estaAutenticado.value) {
        return { path: "/" };
    }
});

export default router;