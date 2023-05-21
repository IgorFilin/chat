import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/store";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
  // Setting the global default position
  position: "bottom-left",
};

const app = createApp(App);
app.use(router);
app.use(store);
app.use(Toast, options);
app.mount("#app");
