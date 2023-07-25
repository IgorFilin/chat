import { defineStore } from "pinia";

export const useCounterStore = defineStore("userData", {
  state: () => {
    return {
      name: "",
      isAdmin: null,
    } as UserType;
  },
  getters: {},
  actions: {},
});

interface UserType {
  name: string;
  isAdmin: boolean | null;
}
