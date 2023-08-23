import { defineStore } from "pinia";
import { authApi } from "@/api/auth.ts";
import { LoginUserType } from "@/api/typesApi";
import { useToast } from "vue-toastification";
import axios, { AxiosError } from "axios";

interface UserType {
  name: string;
  isAdmin: boolean | null;
  isAuth: boolean;
  messages: string;
}

const toast = useToast();

export const useUserStore: any = defineStore("userData", {
  state: () => {
    return {
      name: "",
      isAdmin: null,
      isAuth: false,
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
        this.auth();
      }
    },
    async auth() {
      try {
        const result = await authApi.auth();
        this.isAuth = result.data.isAuth;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const err = error as AxiosError<{ message: string }>;
          this.messages = err.response ? err.response?.data.message : "Ошибка";
        }
      }
    },
    async logout() {
      try {
        const result = await authApi.logout();
        this.isAuth = result.data.isAuth;
        toast("Вы успешно вышли, возвращайтесь!");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const err = error as AxiosError<{ message: string }>;
          this.messages = err.response ? err.response?.data.message : "Ошибка";
          toast(this.messages);
        }
      }
    },
  },
});
