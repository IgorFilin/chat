import { defineStore } from "pinia";

import { authApi } from "@/api/auth.ts";

export const useCounterStore = defineStore("userData", {
  state: () => {
    return {
      name: "",
      isAdmin: null,
    } as UserType;
  },
  getters: {},
  actions: {
    login() {},
  },
});

interface UserType {
  name: string;
  isAdmin: boolean | null;
}
