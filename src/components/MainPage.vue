<template>
  <div class="v-mainPage">
    <h1 class="v-mainPage__title">Добро пожаловать</h1>
    <div class="v-mainPage__chatContainer">
      <div class="v-mainPage__chat">
        <div>Igor</div>
        <div>Hello</div>
      </div>
      <input v-model="message" class="v-mainPage__chatInput" type="text" />
    </div>
    <button @click="sendMessage">Отправить сообщение</button>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/store.ts";
import router from "@/router/router";
import { ref } from "vue";

const message = ref("");

const store = useUserStore();

if (!store.isAuth) {
  router.push("/login");
}

const connection = new WebSocket("wss://localhost:3000");

connection.onopen = function (event) {
  console.log("Successfully connected to the echo websocket server...");
};

connection.onmessage = function (event) {
  console.log(event);
};

function sendMessage() {
  const eventData = {
    event: "msgToServer", // Имя события
    payload: message.value, // Данные, которые вы хотите отправить
  };

  // Преобразование объекта в строку JSON и отправка через WebSocket
  connection.send(JSON.stringify(eventData));
}
connection.onopen();
</script>

<style scoped lang="scss">
.v-mainPage {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 90vh;
  width: 100%;
}

.v-mainPage__title {
  color: darkslategrey;
}

.v-mainPage__chatContainer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 500px;
  height: 500px;
  border-radius: 20px;
  background-color: cyan;
  box-shadow: (7px black, 1px, 1px);
}

.v-mainPage__chat {
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  border-radius: 20px;
  background-color: rgb(132, 229, 229);
  margin-bottom: 20px;
  padding: 30px;
}

.v-mainPage__chatInput {
  width: 50%;
}
</style>
