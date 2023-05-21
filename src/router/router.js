import { createRouter, createWebHistory } from "vue-router";
import Registration from "../components/Registration.vue";
import Login from "../components/Login.vue";

const routes = [
  { path: "/registration", component: Registration },
  { path: "/login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
