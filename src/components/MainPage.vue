<template>
  <div class="container">
    <h1 class="textHello">Добро пожаловать</h1>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/store/store.ts";
import router from "@/router/router";

const store = useUserStore();

onMounted(() => {
  if (!store.isAuth) {
    router.push({ path: "/login" });
  }
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;

  &.textHello {
    width: 500px;
    height: 50px;
    background-color: #202020;
  }
}
</style>
