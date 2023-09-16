<template>
  <div class="header">
    <div>
      <button
        v-if="!store.isAuth"
        class="header-button"
        @click="goTo('/registration')"
      >
        Регистрация
      </button>
      <button
        v-if="!store.isAuth"
        class="header-button"
        @click="goTo('/login')"
      >
        Логинизация
      </button>
    </div>
    <div class="header__nameLogoutContainer">
      <div class="header__userName" v-if="store.name">
        {{ store.name }}
      </div>
      <div>
        <button
          v-if="store.isAuth"
          class="header-button"
          @click="onExitAccount"
        >
          Выход
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router/router";
import { useUserStore } from "@/store/store";
import { onUpdated } from "vue";

const store = useUserStore();

function goTo(route: string) {
  router.push(route);
}
console.log("NAME", store.name);
async function onExitAccount() {
  if (store.isAuth) {
    await store.logout();
    router.push("/login");
  }
}

onUpdated(() => {});
</script>

<style scoped lang="scss">
.header {
  background-color: #202020;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-button {
  background-color: #202020;
  color: white;
  border: none;
  cursor: pointer;
}

.header__nameLogoutContainer {
  display: flex;
  gap: 20px;
}

.header__userName {
  color: white;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  text-decoration: underline;
}
</style>
