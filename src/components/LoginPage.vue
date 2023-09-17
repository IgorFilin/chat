<template>
  <div class="registration-container">
    <h2 class="registration-title">Логинизация</h2>
    <div class="form-group">
      <label for="email">Email:</label>
      <input autocomplete="on" auto type="email" id="email" v-model="email" />
    </div>
    <div class="form-group">
      <label for="password">Пароль:</label>
      <input
        autocomplete="on"
        type="password"
        id="password"
        @keypress.enter="submitForm"
        v-model="password"
      />
    </div>
    <button class="registration-button" @click="submitForm">Войти</button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUpdate, onMounted, onUpdated, ref, watch } from "vue";
import { useUserStore } from "@/store/store.ts";
import { LoginUserType } from "@/api/typesApi";
import router from "@/router/router";

let email = ref("");
let password = ref("");

const store = useUserStore();

async function submitForm() {
  await store.loginAction({
    email: email.value,
    password: password.value,
  } as LoginUserType);
  email.value = "";
  password.value = "";
}

watch(
  () => store.isAuth,
  () => {
    router.push("/main");
  }
);
</script>

<style scoped lang="scss">
.registration-container {
  background-color: #202020;
  padding: 20px;
  color: white;
  max-width: 400px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  max-height: 600px;
  border-radius: 20px;
  margin: 20vh auto;
}

.registration-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.registration-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: #303030;
  color: white;
}

input:focus {
  outline: none;
}

.registration-button {
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}
</style>
