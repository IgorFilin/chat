<template>
  <div class="container">
    <h1 class="textHello">Добро пожаловать</h1>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/store.ts";
import router from "@/router/router";

const store = useUserStore();

// if (!store.isAuth) {
//   debugger;
//   router.push("/login");
// }
</script>

<style scoped lang="scss">
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
  width: 100%;

  &.textHello {
    width: 500px;
    height: 50px;
    background-color: #202020;
  }
}
</style>
