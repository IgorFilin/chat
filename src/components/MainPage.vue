<template>
  <div class="v-mainPage">
    <UserOnlineContainer
      @openRoom="openRoomHandler"
      :usersOnline="usersOnline"
    />
    <div v-if="privateRoom" class="v-mainPage__backAllChatContainer">
      <button @click="goToPublicChat" class="v-mainPage__buttonBackAllChat">
        <Icon id="arrow_back" color="white" />
        В общий чат
      </button>
      <div>В диалоге {{ userToAddPrivate }}</div>
    </div>
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
    <InputSendButton @sendMessage="sendMessage" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth_store.ts";
import InputSendButton from "@/components/InputSendButton.vue";
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
import Icon from "@/components/Icon.vue";

let messagesLength = 0;

const privateRoom = ref("");
const userToAddPrivate = ref("");
const messages = ref([]) as any;
const usersOnline = ref([]) as any;
const onDragClass = ref(false);
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

connection.onopen = function () {};

connection.onclose = function (event) {
  console.log(event);
};

function sendMessage(message: string) {
  let event = "";
  let roomId = "";
  if (privateRoom.value) {
    event = "private_message";
    roomId = privateRoom.value;
  } else {
    event = "message";
  }
  if (connection.readyState === 1) {
    connection.send(
      JSON.stringify({
        event,
        data: { message: message, id: store.id, roomId },
      })
    );
  }
}

connection.onmessage = function (event) {
  const data = JSON.parse(event.data);
  console.log(data);
  if (data.lengthMessages && data.lengthMessages !== messagesLength) {
    messagesLength = data.lengthMessages;
  }

  if (data.userToAddPrivat && data.userToAddPrivat !== userToAddPrivate.value) {
    userToAddPrivate.value = data.userToAddPrivat;
  }

  if (
    data.messages &&
    data.messages.roomId &&
    data.messages.roomId !== privateRoom.value
  ) {
    privateRoom.value = data.messages.roomId;
  }

  // if (Array.isArray(data.messages)) {
  //   const messagesData = data.messages.map((message: any) => {
  //     const base64Image = message.userPhoto;
  //     const binaryData = Uint8Array.from(atob(base64Image), (c) =>
  //       c.charCodeAt(0)
  //     );
  //     const blobImage = new Blob([binaryData]);
  //     return {
  //       name: message.name,
  //       userId: message.userId,
  //       message: message.message,
  //       userPhoto: URL.createObjectURL(blobImage),
  //     };
  //   });
  //   messages.value = messagesData;
  // }

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
    if (data.messages.roomId === privateRoom.value) {
      messages.value.unshift(data.messages);
    }
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

function goToPublicChat() {
  privateRoom.value = "";
  messages.value = [];
  if (connection.readyState === 1) {
    connection.send(
      JSON.stringify({
        event: "all_messages_public",
        data: { id: store.id },
      })
    );
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
  if (connection.readyState === 1) {
    connection.send(
      JSON.stringify({
        event: "open_room",
        data: { myId: store.id, userId: id },
      })
    );
  }
  messages.value = [];
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

.v-mainPage__buttonBackAllChat {
  display: flex;
  cursor: pointer;
  background-color: #141416;
  transition: 0.5s;
  color: white;
  padding: 5px 10px;
  margin: 0;
  gap: 5px;

  &:hover {
    transition: 0.5s;
    border: 2px solid #000;
    color: #000;
    background-color: #fff;

    .v-icon {
      color: #000;
    }
  }
}

.v-mainPage__backAllChatContainer {
  display: flex;
  align-items: center;
  width: 80%;
  margin: 10px 0;
  gap: 10px;
}
</style>
