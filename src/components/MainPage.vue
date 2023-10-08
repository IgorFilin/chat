<template>
  <div class="v-mainPage">
    <div
      class="v-mainPage_usersOnlineContainer"
      :class="{ active: isActiveUserContainer }"
    >
      <div
        class="v-mainPage_usersOnlineContainerClickElem"
        @click="onActiveUserContainer"
      />
      <input
        class="v-mainPage_usersOnlineSearch"
        type="search"
        v-model="searchedUser"
      />
      <div class="v-mainPage_userOnline" v-for="user in currentUsers">
        {{ user.name }}
      </div>
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
      <div
        class="v-mainPage_messageContainer"
        :class="{ me: isMeActiveClass(userId) }"
        v-for="({ date, userPhoto, message, name, userId }, index) in messages"
      >
        <img :src="userPhoto" class="v-mainPage_messagePhoto" />
        <div class="v-mainPage_messageContentContainer">
          <div class="v-mainPage_message">
            <div class="v-mainPage_messageName">{{ name }}</div>
            <MyComponent
              :key="message"
              :tag="getTegMessage(message)"
              :message="message"
            />
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

<script setup lang="ts">
import { useUserStore } from "@/store/store.ts";
import router from "@/router/router";
import { onMounted, onUnmounted, ref, computed } from "vue";
import MyComponent from "@/components/assetsComponent/Component.vue";

const message = ref("");
const messages = ref([]);
const usersOnline = ref([]) as any;
const isActiveUserContainer = ref(false);
const searchedUser = ref("");
const onDragClass = ref(false);
const store = useUserStore();

if (!store.isAuth) {
  router.push("/login");
}

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
        data: { message: message.value, id: store.id },
      })
    );
    message.value = "";
  }
}

connection.onmessage = function (event) {
  const data = JSON.parse(event.data);
  console.log(data);

  if (data.messages) {
    for (let i = 0; i < data.messages.length; i++) {
      const base64Image = data.messages[i].userPhoto;
      const binaryData = Uint8Array.from(atob(base64Image), (c) =>
        c.charCodeAt(0)
      );
      const blobImage = new Blob([binaryData]);
      const imageSrc = URL.createObjectURL(blobImage);
      data.messages[i].userPhoto = imageSrc;

      if (data.messages[i].message.type === "Buffer") {
        const bufferData = new Uint8Array(data.messages[i].message.data); // Преобразовываем Buffer в Uint8Array
        const blobMessage = new Blob([bufferData]);
        const imageUrl = URL.createObjectURL(blobMessage);
        data.messages[i].message = imageUrl;
      }
    }
    messages.value = data.messages;
  }
  if (data.clients) {
    usersOnline.value = data.clients;
  }
};

///////////////////////////////////////////////////////////////////////////////////

//Функции /////////////////////////////////////////////////////////////////////////

function isMeActiveClass(id: string) {
  if (id) {
    return id === store.id;
  }
}

function onActiveUserContainer() {
  isActiveUserContainer.value = !isActiveUserContainer.value;
}

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

  reader.onload = function (event) {
    const arrayBuffer = event.target.result;

    if (connection.readyState === 1) {
      connection.send(
        JSON.stringify({
          event: "message",
          data: {
            message: Array.from(new Uint8Array(arrayBuffer)),
            id: store.id,
          },
        })
      );
    }
  };

  reader.readAsArrayBuffer(file);
}

function getTegMessage(message: string) {
  const patternLink = /^(https?:\/\/)/;
  if (message.includes("blob:http")) {
    return "img";
  } else if (patternLink.test(message)) {
    return "a";
  } else {
    return "div";
  }
}

function onScroll(event: any) {
  const container = event.target as HTMLElement; // Получаем контейнер, на который произошло событие скроллинга
  // Проверяем, достиг ли пользователь нижней границы контейнера
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    // Достигнут конец страницы
  }
}

// Computed ////////////////////////////////////////////////////////////////////////////////

const currentUsers = computed(() => {
  const seachValue = searchedUser.value.toLowerCase().trim();
  if (!seachValue) {
    return usersOnline.value;
  }
  return usersOnline.value.filter((user: any) => {
    return user.name.toLowerCase().trim().includes(seachValue);
  });
});

////////////////////////////////////////////////////////////////////////////////////////////

// Жизненный цикл //////////////////////////////////////////////////////////////////////////
onMounted(() => {
  // connection.onopen();
});

onUnmounted(() => {
  connection.close();
});
///////////////////////////////////////////////////////////////////////////////////////////
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

.v-mainPage_messageImage {
  max-width: 400px;
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

.v-mainPage_usersOnlineContainerClickElem {
  content: "";
  display: block;
  height: 30px;
  width: 30px;
  border: inherit;
  position: absolute;
  clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
  transform: rotate(225deg);
  z-index: 99;
  background-color: #202020;
  right: -14px;
  top: 50%;
  border-radius: 0 0 0 0.25em;
  transition: 0.5s;
  cursor: pointer;
}
.v-mainPage_usersOnlineContainer {
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 20px 20px 20px 50px;
  box-sizing: border-box;
  width: 300px;
  height: 80%;
  max-height: 700px;
  background-color: #1e1c1c;
  border-radius: 30px 0 20px 0;
  box-shadow: 0px 0px 80px -28px rgba(0, 0, 0, 0.16);
  transition: 0.5s;
  left: -300px;
  gap: 15px;
  z-index: 9;

  &.active {
    left: 2px;
  }
}

.v-mainPage_usersOnlineSearch {
  background-color: #ededed;
  border: 1px solid #141416;
  display: inline-block;
  vertical-align: middle;
  resize: none;
  padding: 5px;
  margin-bottom: 10px;

  &:focus-visible {
    outline: none;
  }
}

.v-mainPage_userOnline {
  font-size: 17px;
  line-height: 20px;
  color: white;

  &:hover {
    cursor: pointer;
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
