import { defineStore } from "pinia";
import { authApi } from "@/api/auth.ts";
import { LoginUserType } from "@/api/typesApi";
import { useToast } from "vue-toastification";
import axios, { AxiosError } from "axios";

const toast = useToast();

export const useUserStore: any = defineStore("userData", {
  state: () => {
    return {
      name: "",
      isAdmin: null,
      messages: "" as string | undefined,
    } as UserType;
  },
  getters: {},
  actions: {
    async loginAction(data: LoginUserType) {
      try {
        const result = await authApi.loginUser(data);
        this.messages = result.data.message;
        this.name = result.data.name;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const err = error as AxiosError<{ message: string }>;
          this.messages = err.response ? err.response?.data.message : "Ошибка";
        }
      } finally {
        toast(this.messages);
      }
    },
  },
});

interface UserType {
  name: string;
  isAdmin: boolean | null;
  messages: string;
}
