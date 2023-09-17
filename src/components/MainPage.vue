<template>
  <div class="v-mainPage">
    <div class="v-mainPage__chatContainer">
      <div
        class="v-mainPage_message"
        v-for="{ date, photo, message, id } in messages"
        :class="{ me: isMeActiveClass(id) }"
      >
        <div>{{ date }}</div>
        <div>{{ photo }}</div>
        <div>{{ message }}</div>
      </div>
    </div>
    <div class="v-mainPage__chatInputButtonContainer">
      <textarea
        @keyup.enter="sendMessage"
        v-model="message"
        class="v-mainPage__chatInput"
        type="text"
      />
      <button class="v-mainPage_chatButton" @click="sendMessage">
        Отправить сообщение
      </button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/store/store.ts";
import router from "@/router/router";
import { onMounted, ref } from "vue";

const message = ref("");
const messages = ref([]);

const store = useUserStore();

if (!store.isAuth) {
  router.push("/login");
}

const connection = new WebSocket(`ws://localhost:3000?userID=${store.id}`);

connection.onopen = function (event) {
  console.log("Соединение открыто");
  console.log(store.id);
};

function sendMessage() {
  if (connection.readyState === 1) {
    connection.send(
      JSON.stringify({
        event: "message",
        data: { message: message.value, id: store.id },
      })
    );
    message.value = "";
  }
}

connection.onclose = function (eventclose) {
  console.log("Соединение закрыто причина: " + eventclose);
};

connection.onerror = function (error) {
  console.error("WebSocket Error:", error);
};

connection.onmessage = function (event) {
  const data = JSON.parse(event.data);
  messages.value.push({ id: data.userId, message: data.message });
};

function isMeActiveClass(id) {
  if (id) {
    return id === store.id;
  }
}

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
  justify-content: flex-end;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 75%;
  height: 100%;
  background: #ffffff;
  -webkit-box-shadow: 0px 0px 80px -28px rgba(0, 0, 0, 0.16);
  -moz-box-shadow: 0px 0px 80px -28px rgba(2, 2, 2, 0.16);
  box-shadow: 0px 0px 80px -28px rgba(0, 0, 0, 0.16);
  gap: 10px;
}

.v-mainPage__chatInputButtonContainer {
  display: flex;
  width: 75%;
}

.v-mainPage_chatButton {
  display: flex;
  padding: 5px 10px;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: #141416;
  transition: 0.5s;

  &:hover {
    border: 2px solid #000;
    color: #000;
    background-color: #fff;
  }
}

.v-mainPage_message {
  word-break: break-all;
  display: flex;
  padding: 14px 16px;
  word-wrap: break-word;
  background: #f0f0f0;
  font-size: 14px;
  line-height: 20px;
  justify-content: flex-end;
  align-self: flex-end;
  color: #333;
  border-radius: 8px 0 8px 8px;
  overflow: visible;
  white-space: pre-wrap;
  transition: 0.3s;
  scroll-margin-top: 16px;
  scroll-margin-bottom: 21px;

  &.me {
    align-self: flex-start;
    background: #a3b8bc;
    border-radius: 0 8px 8px 8px;
  }
}

.v-mainPage__chatInput {
  width: 100%;
  background-color: #ededed;
  padding-left: 10px;
  border: 1px solid #141416;
  display: inline-block;
  vertical-align: middle;
  resize: none;
  padding: 10px;

  &:focus-visible {
    outline: none;
  }
}
</style>
