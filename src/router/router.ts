import { createRouter, createWebHistory } from "vue-router";
import RegistrationPage from "../components/RegistrationPage.vue";
import LoginPage from "@/components/LoginPage.vue";
import MainPage from "@/components/RegistrationPage.vue";

const routes = [
  { path: "/registration", component: RegistrationPage },
  { path: "/login", component: LoginPage },
  { path: "/main", component: MainPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
