import { createRouter, createWebHistory } from "vue-router";
import RegistrationPage from "../components/RegistrationPage.vue";
import LoginPage from "@/components/LoginPage.vue";
import MainPage from "@/components/MainPage.vue";
import { useUserStore } from "@/store/store.ts";

const routes = [
  { path: "/registration", component: RegistrationPage },
  { path: "/login", component: LoginPage },
  { path: "/main", component: MainPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const store = useUserStore();

  if (!store.isAuth) {
    await store.auth();
  }

  if (!store.isAuth && to.path === "/main") {
    next({ path: "/login" });
  } else if (store.isAuth && to.path !== "/main") {
    next({ path: "/main" });
  } else {
    next();
  }
});

export default router;
