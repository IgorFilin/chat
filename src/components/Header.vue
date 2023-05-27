<template>
  <div class="header">
    <button class="header-button" @click="goTo('/registration')">
      Регистрация
    </button>
    <button class="header-button" @click="goTo('/login')">Логинизация</button>
  </div>
</template>

<script>
export default {
  name: "HeaderComponent",
  methods: {
    goTo(route) {
      this.$router.push(route);
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  background-color: #202020;
  height: 40px;
  display: flex;
  justify-content: end;
  padding: 0 20px;
}

.header-button {
  background-color: #202020;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
