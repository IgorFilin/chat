<template>
  <div class="v-confirmRef">
    <div class="v-confirmRef__container">
      <div class="v-confirmRef__text">
        Введите ключ подтверждение с вашего почтового ящика
      </div>
      <div class="v-confirmRef__inputCode">
        <input v-model="keyAccept" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const keyAccept = ref("");
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.v-confirmRef {
  width: 100%;
  height: 95vh;
}

.v-confirmRef__container {
  background-color: #202020;
  padding: 20px;
  color: white;
  max-width: 400px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  max-height: 600px;
  border-radius: 20px;
  margin: 20vh auto;
}

.v-confirmRef__inputCode {
  input {
    padding: 5px;
    height: 20px;
    width: 250px;
    border-radius: 2px;
    border: none;
    background-color: #f1f1f1;
  }
}
</style>
