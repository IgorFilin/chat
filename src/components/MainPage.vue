<template>
  <div class="v-mainPage">
    <div class="v-mainPage__chatContainer">
      <div
        class="v-mainPage_messageContainer"
        :class="{ me: isMeActiveClass(userId) }"
        v-for="{ date, userPhoto, message, name, userId } in messages"
        :key="userId"
      >
        <img :src="userPhoto" class="v-mainPage_messagePhoto" />
        <div class="v-mainPage_messageContentContainer">
          <div class="v-mainPage_message">
            <div class="v-mainPage_messageName">{{ name }}</div>
            <div>{{ message }}</div>
          </div>
          <div>{{ date }}</div>
        </div>
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
  console.log(event);
  // messages.value = JSON.parse(event);
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
  for (let i = 0; i < data.length; i++) {
    const base64Image = data[i].userPhoto;
    const binaryData = Uint8Array.from(atob(base64Image), (c) =>
      c.charCodeAt(0)
    );
    const blob = new Blob([binaryData]);
    const imageSrc = URL.createObjectURL(blob);
    data[i].userPhoto = imageSrc;
  }
  messages.value = data;

  // console.log(data);
  // messages.value = event.data;
  // console.log(messages.value);
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

.v-mainPage_messagePhoto {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: brown;
}

.v-mainPage_messageContainer {
  display: flex;
  gap: 5px;
  align-items: center;
  align-self: flex-end;

  &.me {
    align-self: flex-start;

    .v-mainPage_message {
      display: flex;
      flex-direction: column;
      align-self: flex-start;
      background: #a3b8bc;
      border-radius: 0 8px 8px 8px;
      position: relative;

      // &:after {
      //   content: "";
      //   position: absolute;
      //   left: 0px;
      //   top: 15px;
      //   border: 7px solid transparent;
      //   border-right: 7px solid green;
      // }
    }
  }
}
.v-mainPage__chatContainer {
  display: flex;
  flex-direction: column-reverse;
  padding: 20px;
  width: 75%;
  height: 650px;
  overflow-y: auto;
  background: #ffffff;
  -webkit-box-shadow: 0px 0px 80px -28px rgba(0, 0, 0, 0.16);
  -moz-box-shadow: 0px 0px 80px -28px rgba(2, 2, 2, 0.16);
  box-shadow: 0px 0px 80px -28px rgba(0, 0, 0, 0.16);
  gap: 10px;

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: rgb(51, 51, 51);
    min-height: 24px;
    border: 3px solid rgb(245, 245, 245);
  }

  &::-webkit-scrollbar {
    width: 0.9rem;
  }
}

.v-mainPage_messageName {
  position: relative;
  font-size: 12px;
  line-height: 15px;
  bottom: 6px;
}

.v-mainPage__chatInputButtonContainer {
  display: flex;
  width: 75%;
}

.v-mainPage_messageContentContainer {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
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
  flex-direction: column;
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
