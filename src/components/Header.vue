<template>
  <div class="header">
    <div>
      <button class="header-button" @click="goTo('/registration')">
        Регистрация
      </button>
      <button class="header-button" @click="goTo('/login')">Логинизация</button>
    </div>
    <div>
      <button class="header-button" @click="onExitAccount">Выход</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router/router";

function goTo(route: string) {
  router.push(route);
}
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
</style>
