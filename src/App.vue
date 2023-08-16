<template>
  <Header />
  <router-view></router-view>
</template>

<script lang="ts" setup>
import Header from "@/components/Header.vue";
import { onMounted, onUpdated } from "vue";
import { useUserStore } from "./store/store";

const store = useUserStore();

onMounted(() => store.auth());
</script>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
#app {
}
</style>
