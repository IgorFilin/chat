import { createStore } from "vuex";
import { useToast } from "vue-toastification";
import { authApi } from "@/api/auth";

const toast = useToast();

const store = createStore({
  state: {
    // Состояния вашего приложения
  },
  mutations: {
    // Мутации для изменения состояния
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
  },
  getters: {
    // Геттеры для получения данных из состояния
  },
});

export default store;
