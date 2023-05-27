<template>
  <div class="registration-container">
    <h2 class="registration-title">Регистрация</h2>
    <form class="registration-form">
      <div class="form-group">
        <label for="name">Имя:</label>
        <input type="text" id="name" v-model="name" />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <button class="registration-button" @click="submitForm">
        Зарегистрироваться
      </button>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "RegistrationComponent",
  data() {
    return {
      name: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async submitForm(e) {
      // Обработка отправки формы
      e.preventDefault();
      const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };
      this.$store.dispatch("registerUser", userData);
      this.name = "";
      this.email = "";
      this.password = "";
    },
  },
  computed: {
    ...mapState(["isAuth"]),
  },
  watch: {
    isAuth(value) {
      if (value) this.$store.dispatch("redirect", "/main");
    },
  },
  mounted() {
    if (this.$store.state.isAuth) {
      console.log(this.$store.state.isAuth);
      this.$store.dispatch("redirect", "/main");
    }
  },
};
</script>

<style scoped lang="scss">
.registration-container {
  background-color: #202020;
  padding: 20px;
  color: white;
  max-width: 400px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  max-height: 600px;
  border-radius: 20px;
  margin: 20vh auto;
}

.registration-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.registration-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  padding: 8px;
  border-radius: 4px;
  border: none;
  background-color: #f1f1f1;
}

input:focus {
  outline: none;
}

.registration-button {
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}
</style>
