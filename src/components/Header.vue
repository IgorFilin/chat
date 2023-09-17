<template>
  <div class="v-header__container">
    <div>
      <button
        v-if="!store.isAuth"
        class="v-header__navigateButton"
        @click="goTo('/registration')"
      >
        Регистрация
      </button>
      <button
        v-if="!store.isAuth"
        class="v-header__navigateButton"
        @click="goTo('/login')"
      >
        Логинизация
      </button>
    </div>
    <div class="v-header__nameLogoutContainer">
      <div v-if="store.isAuth">
        <img class="v-header__photoUser" :src="store.userPhoto" alt="Аватар" />
      </div>
      <div class="v-header__userName" v-if="store.name">
        {{ store.name }}
      </div>
      <button
        v-if="store.isAuth"
        class="v-header__navigateButton"
        @click="onExitAccount"
      >
        Выход
      </button>
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

async function onExitAccount() {
  if (store.isAuth) {
    await store.logout();
    router.push("/login");
  }
}

onUpdated(() => {});
</script>

<style scoped lang="scss">
.v-header__container {
  background-color: #202020;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.v-header__navigateButton {
  background-color: #202020;
  color: white;
  border: none;
  cursor: pointer;
  align-self: center;
}

.v-header__nameLogoutContainer {
  display: flex;
  gap: 20px;
  align-self: center;
}

.v-header__photoUser {
  width: 40px;
  height: 40px;
}
.v-header__userName {
  color: white;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  text-decoration: underline;
  align-self: center;
}
</style>
