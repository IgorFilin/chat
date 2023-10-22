<template>
  <div class="v-usersOnline" :class="{ active: isActiveUserContainer }">
    <div class="v-usersOnline__clickElem" @click="onActiveUserContainer" />
    <input class="v-usersOnline__search" type="search" v-model="searchedUser" />
    <div
      class="v-usersOnline__user"
      v-for="user in currentUsers"
      :key="user.id"
    >
      {{ user.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const searchedUser = ref("");
const isActiveUserContainer = ref(false);

const props = defineProps({
  usersOnline: {
    type: Array<{ name: string; id: string }>,
    desc: "Массив онлайн пользователей",
  },
});

function onActiveUserContainer() {
  isActiveUserContainer.value = !isActiveUserContainer.value;
}

const currentUsers = computed(() => {
  console.log("computed");
  const seachValue = searchedUser.value.toLowerCase().trim();
  if (!seachValue) {
    return props.usersOnline;
  }
  return props.usersOnline?.filter((user: any) =>
    user.name.toLowerCase().trim().includes(seachValue)
  );
});
</script>

<style lang="scss">
.v-usersOnline {
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
    color: white;

    &:hover {
      cursor: pointer;
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
}
</style>
