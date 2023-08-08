import { defineStore } from "pinia";
import { authApi } from "@/api/auth.ts";
import { LoginUserType } from "@/api/typesApi";

export const useUserStore: any = defineStore("userData", {
  state: () => {
    return {
      name: "",
      isAdmin: null,
      messages: "",
    } as UserType;
  },
  getters: {},
  actions: {
    async loginAction(data: LoginUserType) {
      try {
        const result = await authApi.loginUser(data);
        console.log("result", result);
        this.messages = result.data.message;
        this.name = result.data.name;
      } catch (error: any) {
        console.log(error.response.data.message);
      }
    },
  },
});

interface UserType {
  name: string;
  isAdmin: boolean | null;
  messages: string;
}
