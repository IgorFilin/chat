import { createRouter, createWebHistory } from "vue-router";
import Registration from "../components/Registration.vue";
import Login from "../components/Login.vue";
import MainPage from "../components/MainPage.vue";

const routes = [
  { path: "/registration", component: Registration },
  { path: "/login", component: Login },
  { path: "/main", component: MainPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
