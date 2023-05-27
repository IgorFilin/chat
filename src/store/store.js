import { createStore } from "vuex";
import { useToast } from "vue-toastification";
import { authApi } from "@/api/auth";
import router from "@/router/router.js";

const toast = useToast();

const store = createStore({
  state: {
    isAuth: false,
    // Состояния вашего приложения
  },
  mutations: {
    // Мутации для изменения состояния
    authorization(state, payload) {
      state.isAuth = payload;
    },
  },
  actions: {
    // Действия для выполнения асинхронных операций
    showWarningMessage(context, message) {
      toast(message, {
        position: "bottom-left",
        timeout: 7238,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 1.72,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: "button",
        icon: true,
        rtl: false,
      });
    },
    async registerUser(context, payload) {
      try {
        await authApi.registerUser(payload);
      } catch (e) {
        context.dispatch("showWarningMessage", e.response.data.message[0]);
      }
    },
    async loginUser(context, payload) {
      try {
        const response = await authApi.loginUser(payload);
        context.commit("authorization", true);
        context.dispatch("showWarningMessage", response.data.message);
      } catch (e) {
        const message = Array.isArray(e.response.data.message)
          ? e.response.data.message[0]
          : e.response.data.message;
        context.dispatch("showWarningMessage", message);
      }
    },
    redirect(context, payload) {
      router.push({ path: payload });
    },
  },
  getters: {
    // Геттеры для получения данных из состояния
  },
});

window.store = store.state;
export default store;
