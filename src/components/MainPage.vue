<template>
  <div class="v-mainPage">
    <UserOnlineContainer
      @openRoom="openRoomHandler"
      :usersOnline="usersOnline"
    />
    <div
      class="v-mainPage__chatContainer"
      :class="{ drag: onDragClass }"
      @scroll="onScroll"
      @dragstart.prevent
      @dragover.prevent="OnDragChatContainer"
      @dragleave.prevent="onDragClass = false"
      @drop.prevent="OnDropChatContainer"
    >
      <Message
        v-if="isLoadingMessages"
        :key="message"
        v-for="message in messages"
        v-bind="message"
      />
      <Loader v-else loaderFor="message" />
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

<script setup lang="ts">
import { useAuthStore } from "@/store/auth_store.ts";
import router from "@/router/router";
import {
  onMounted,
  onUnmounted,
  ref,
  computed,
  onRenderTriggered,
  onUpdated,
} from "vue";
import Message from "@/components/Message.vue";
import UserOnlineContainer from "@/components/UserOnlineContainer.vue";
import Loader from "@/components/Loader.vue";

let message = "";
const messages = ref([]) as any;
const usersOnline = ref([]) as any;
const onDragClass = ref(false);
let messagesLength = 0;
const isLoadingMessages = ref(false) as any;

const store = useAuthStore();

if (!store.isAuth) {
  router.push("/login");
}

// onRenderTriggered(({ key, target, type }) =>
//   console.log({ key, target, type })
// ); // Тест производительности

// WebScoket function  //////////////////////////////////////////////////////////////

const connection = new WebSocket(`ws://localhost:3000?userID=${store.id}`);

connection.onopen = function (event) {};

connection.onclose = function (event) {
  console.log(event);
};

function sendMessage() {
  if (connection.readyState === 1) {
    connection.send(
      JSON.stringify({
        event: "message",
        data: { message: message, id: store.id },
      })
    );
    message = "";
  }
}

connection.onmessage = function (event) {
  const data = JSON.parse(event.data);

  messagesLength = data.lengthMessages;

  if (Array.isArray(data.messages)) {
    const messagesData = data.messages.map((message: any) => {
      const base64Image = message.userPhoto;
      const binaryData = Uint8Array.from(atob(base64Image), (c) =>
        c.charCodeAt(0)
      );
      const blobImage = new Blob([binaryData]);
      return {
        name: message.name,
        userId: message.userId,
        message: message.message,
        userPhoto: URL.createObjectURL(blobImage),
      };
    });
    messages.value = messagesData;
  }

  if (data.messages?.message && Array.isArray(data.messages.message)) {
    const bufferData = new Uint8Array(data.messages.message);
    const blobMessage = new Blob([bufferData]);
    data.messages.message = URL.createObjectURL(blobMessage);
  }

  if (typeof data.messages?.message === "string") {
    const base64Image = data.messages.userPhoto;
    const binaryData = Uint8Array.from(atob(base64Image), (c) =>
      c.charCodeAt(0)
    );
    const blobImage = new Blob([binaryData]);
    data.messages.userPhoto = URL.createObjectURL(blobImage);
    messages.value.unshift(data.messages);
  }

  if (data.clients) {
    usersOnline.value = data.clients;
  }

  if (messages.value.length === messagesLength) {
    isLoadingMessages.value = true;
  }
};

///////////////////////////////////////////////////////////////////////////////////

// Функции /////////////////////////////////////////////////////////////////////////

function OnDragChatContainer(event: any) {
  event.preventDefault();
  if (!onDragClass.value) {
    onDragClass.value = true;
  }
}

function OnDropChatContainer(event: any) {
  event.preventDefault();
  onDragClass.value = false;
  const file = event.dataTransfer.files[0];
  const reader = new FileReader();

  if (file.size > 300 * 1024) {
    store.toast("Изображение слишком большое. Максимальный размер - 300 КБ.");
    return;
  }

  reader.onload = function (event) {
    const arrayBuffer = event.target?.result;
    if (connection.readyState === 1) {
      connection.send(
        JSON.stringify({
          event: "message",
          data: {
            message: Array.from(new Uint8Array(arrayBuffer as ArrayBuffer)),
            id: store.id,
          },
        })
      );
    }
  };
  reader.readAsArrayBuffer(file);
}

function onScroll(event: any) {
  const container = event.target as HTMLElement; // Получаем контейнер, на который произошло событие скроллинга
  // Проверяем, достиг ли пользователь нижней границы контейнера
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    // Достигнут конец страницы
  }
}

function openRoomHandler(id: string) {
  console.log(id);
}
// Computed ////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////

// Жизненный цикл //////////////////////////////////////////////////////////////////////////
onMounted(() => {
  // connection.onopen();
});

onUnmounted(() => {
  connection.close();
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

  &.drag {
    opacity: 0.4;
  }
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
