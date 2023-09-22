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
  isLoading: boolean;
  userPhoto: any;
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
      isLoading: false,
      id: "",
      userPhoto: "",
    } as UserType;
  },
  getters: {},
  actions: {
    async loginAction(data: LoginUserType) {
      try {
        this.isLoading = true;
        const result = await authApi.loginUser(data);
        this.messages = result.data.message;
        this.name = result.data.name;
        this.isAuth = result.data.isAuth;
        this.id = result.data.id;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const err = error as AxiosError<{ message: string }>;
          this.messages = err.response ? err.response?.data.message : "Ошибка";
        }
      } finally {
        this.isLoading = false;
        toast(this.messages);
      }
    },
    async registration(dataUser: dataRegisterUser) {
      try {
        this.isLoading = true;
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
        this.isLoading = false;
        toast(this.messages);
        this.messages = "";
      }
    },
    async auth() {
      try {
        this.isLoading = true;
        const result = await authApi.auth();
        this.isAuth = result.data.isAuth;
        this.name = result.data.name;
        this.id = result.data.id;

        const resultImage = await authApi.getPhoto();
        const blob = new Blob([resultImage.data], { type: "image/webp" });
        const imageSrc = URL.createObjectURL(blob);
        this.userPhoto = imageSrc;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const err = error as AxiosError<{ message: string }>;
          this.messages = err.response ? err.response?.data.message : "Ошибка";
        }
      } finally {
        this.isLoading = false;
      }
    },
    async logout() {
      try {
        this.isLoading = true;
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
      } finally {
        this.isLoading = false;
      }
    },
    async confirmRegistration(key: string) {
      try {
        this.isLoading = true;
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
        this.isLoading = false;
        toast(this.messages);
        this.messages = "";
      }
    },
    async sendAvatarUser(file: any) {
      try {
        if (
          !file ||
          (!file.type.includes("image/webp") &&
            !file.type.includes("image/png"))
        ) {
          return new Error();
        }

        const formDataFile = new FormData(file);
        const result = await authApi.setPhoto(formDataFile);
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
