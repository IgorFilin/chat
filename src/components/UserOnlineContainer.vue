<template>
  <div
    class="v-usersOnline"
    :class="{ active: isActiveUserContainer }"
    @click="showPopup = false"
  >
    <div class="v-usersOnline__clickElem" @click="onActiveUserContainer" />
    <input class="v-usersOnline__search" type="search" v-model="searchedUser" />
    <div class="v-usersOnline__usersContainer">
      <div
        class="v-usersOnline__user"
        :class="{ online: user.online, isOpenPopup: clikedUser.id === user.id }"
        @click="(event) => clickedUserHandler(event, user)"
        v-for="user in filteredActiveOrNotUsers"
        :key="user.id"
      >
        {{ user.name }}
        <div
          v-if="showPopup && clikedUser.id === user.id"
          class="v-usersOnline__popup"
        >
          <div class="v-usersOnline__popupText">шёпот</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useUserStore } from "@/store/user_store.ts";

const user_store = useUserStore();

const searchedUser = ref("");
const isActiveUserContainer = ref(false);
const users = ref([]) as any;
const showPopup = ref(false);
const clikedUser = ref({
  name: "",
  id: "",
});

const props = defineProps({
  usersOnline: {
    type: Array<{ name: string; id: string }>,
    desc: "Массив онлайн пользователей",
    default() {
      return [];
    },
  },
});

function onActiveUserContainer() {
  isActiveUserContainer.value = !isActiveUserContainer.value;
}

function clickedUserHandler(event: any, user: any) {
  event.stopPropagation();
  clikedUser.value = user;
  showPopup.value = true;
}

onMounted(() => {
  user_store.getAllUsers();
});

watch([() => props.usersOnline, () => user_store.users], () => {
  if (props.usersOnline) {
    users.value = user_store.users
      .map((user: any) => {
        if (
          props.usersOnline.some((userOnline: any) => userOnline.id === user.id)
        ) {
          return {
            online: true,
            name: user.name,
            id: user.id,
          };
        } else {
          return user;
        }
      })
      .sort((a: any, b: any) => (a.online ? -1 : b.online ? -1 : 1));
  }
});

const filteredActiveOrNotUsers = computed(() => {
  const seachValue = searchedUser.value.toLowerCase().trim();
  if (!seachValue) {
    return users.value;
  }
  return users.value.filter((user: any) =>
    user.name.toLowerCase().trim().includes(seachValue)
  );
});
</script>

<style lang="scss">
.v-usersOnline {
  position: absolute;
  padding: 20px 0 20px 20px;
  width: 300px;
  height: 80%;
  max-height: 700px;
  background-color: #1e1c1c;
  border-radius: 30px 0 20px 0;
  box-shadow: 0px 0px 80px -28px rgba(0, 0, 0, 0.16);
  transition: 0.5s;
  left: -320px;

  z-index: 9;

  &.active {
    left: 2px;
  }

  .v-usersOnline__search {
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

  .v-usersOnline__user {
    font-size: 17px;
    line-height: 20px;
    color: rgb(222, 212, 212);
    opacity: 0.6;
    cursor: pointer;
    width: fit-content;

    &.online {
      color: rgb(25, 139, 25);
      opacity: 1;
    }
  }

  .v-usersOnline__usersContainer {
    position: relative;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 15px;
    height: 90%;
    padding-top: 15px;

    &::-webkit-scrollbar {
      display: none;
      -ms-overflow-style: none; /* IE и Edge */
      scrollbar-width: none;
    }
  }

  .v-usersOnline__clickElem {
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

  .v-usersOnline__popup {
    position: absolute;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    width: fit-content;
    height: fit-content;
    padding: 10px 12px;
    opacity: 1;
    color: #555;
    top: -8px;
    right: -80px;
  }

  .v-usersOnline__popupText {
    font-size: 15px;

    &:hover {
      cursor: pointer;
    }
  }

  .isOpenPopup {
    position: relative;
  }
}
</style>
