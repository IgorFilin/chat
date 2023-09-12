import { defineStore } from "pinia";
import { authApi } from "@/api/auth.ts";
import { LoginUserType } from "@/api/typesApi";
import { useToast } from "vue-toastification";
import axios, { AxiosError } from "axios";
import { dataRegisterUser } from "@/api/dataRegisterUser";
import uuid from "uuid-random";

interface UserType {
  name: string;
  isAdmin: boolean | null;
  isAuth: boolean;
  messages: string;
  confirmReg: boolean;
  id: string;
}

const toast = useToast();

export const useUserStore: any = defineStore("userData", {
  state: () => {
    return {
      name: "",
      isAdmin: null,
      isAuth: false,
      confirmReg: false,
      messages: "" as string | undefined,
      id: "",
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
    async registration(dataUser: dataRegisterUser) {
      try {
        const result = await authApi.registerUser(dataUser);
        this.confirmReg = result.data.isRegConfirm;
        this.messages = result.data.message;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const err = error as AxiosError<{ message: string }>;
          if (err.response) {
            this.messages = Array.isArray(err.response?.data.message)
              ? err.response?.data.message[0]
              : "Ошибка";
          }
        }
      } finally {
        toast(this.messages);
        this.messages = "";
      }
    },
    async auth() {
      try {
        const result = await authApi.auth();
        this.isAuth = result.data.isAuth;
        this.name = result.data.name;
        if (!this.id) {
          this.id = uuid();
        }
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
        this.name = "";
        toast("Вы успешно вышли, возвращайтесь!");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const err = error as AxiosError<{ message: string }>;
          this.messages = err.response ? err.response?.data.message : "Ошибка";
          toast(this.messages);
        }
      }
    },
    async confirmRegistration(key: string) {
      try {
        const result = await authApi.confirmReg(key);
        this.name = result.data.name;
        this.messages = result.data.message;
        await this.auth();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const err = error as AxiosError<{ message: string }>;
          if (err.response) {
            this.messages = Array.isArray(err.response?.data.message)
              ? err.response?.data.message[0]
              : "Ошибка";
          }
        }
      } finally {
        toast(this.messages);
        this.messages = "";
      }
    },
  },
});
