<template>
  <div class="v-mainPage">
    <div class="v-mainPage__chatContainer">
      <div class="v-mainPage_message" v-for="mes in messages">{{ mes }}</div>
    </div>
    <div class="v-mainPage__chatInputButtonContainer">
      <input v-model="message" class="v-mainPage__chatInput" type="text" />
      <button
        class="v-mainPage_chatButton"
        @click="sendMessage"
        @keypress.enter="sendMessage"
      >
        Отправить сообщение
      </button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/store.ts";
import router from "@/router/router";
import { onMounted, onUpdated, ref } from "vue";

const message = ref("");
const messages = ref([]);

const store = useUserStore();

if (!store.isAuth) {
  router.push("/login");
}

const connection = new WebSocket("ws://localhost:3000");

connection.onopen = function (event) {
  console.log("Соединение открыто");
};

function sendMessage() {
  if (connection.readyState === 1) {
    connection.send(JSON.stringify({ event: "message", data: message.value }));
    message.value = "";
  }
}

connection.onclose = function (eventclose) {
  console.log(eventclose);
  console.log("Соединение закрыто причина: " + eventclose);
};

connection.onerror = function (error) {
  console.error("WebSocket Error:", error);
};

connection.onmessage = function (event) {
  console.log("EVENTTEST", event);
  const m = JSON.parse(event.data);
  messages.value.push(m);
};

onMounted(() => {
  connection.onopen();
});
</script>

<style scoped lang="scss">
.v-mainPage {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 90vh;
  width: 100%;
  max-width: 1980px;
  margin: auto;
}

.v-mainPage__chatContainer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: #ffffff;
}

.v-mainPage__chatInputButtonContainer {
  display: flex;
  width: 100%;
}

.v-mainPage_chatButton {
  display: flex;
  padding: 5px 10px;
  justify-content: center;
  align-items: center;
  color: #fff;
  border: 2px solid #fff;
  background-color: #141416;
  transition: 0.5s;

  &:hover {
    border: 2px solid #000;
    color: #000;
    background-color: #fff;
  }
}

.v-mainPage_message {
  padding: 14px 16px;
  word-wrap: break-word;
  background: #f0f0f0;
  font-size: 14px;
  line-height: 20px;
  justify-content: flex-end;
  color: #333;
  border-radius: 0 8px 8px 8px;
  overflow: visible;
  white-space: pre-wrap;
  transition: 0.3s;
  scroll-margin-top: 16px;
  scroll-margin-bottom: 21px;

  &.me {
    align-items: flex-start;
  }

  &.all {
    align-items: flex-end;
  }
}

.v-mainPage__chatInput {
  width: 100%;
  background-color: #ededed;
  border: unset;
  padding-left: 10px;
  border: 1px solid #141416;

  &:focus-visible {
    outline: none;
  }
}
</style>
