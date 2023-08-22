<template>
  <Header />
  <transition name="fade" mode="out-in">
    <router-view></router-view>
  </transition>
</template>

<script lang="ts" setup>
import Header from "@/components/Header.vue";
import { onMounted, onUpdated } from "vue";
import { useUserStore } from "./store/store";

const store = useUserStore();
</script>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
#app {
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
