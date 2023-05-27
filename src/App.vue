<template>
  <Header />
  <router-view></router-view>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
  name: "App",
  components: { Header },
};
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
}
</style>
