<template>
  <div class="container">
    <h1 class="textHello">Добро пожаловать</h1>
  </div>
</template>

<script>
export default {
  name: "MainPage",
};
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
