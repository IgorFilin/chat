<template>
  <div class="registration-container">
    <h2 class="registration-title">Логинизация</h2>
    <form class="registration-form" @submit.prevent="submitForm">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <button class="registration-button" type="submit">Войти</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "LoginComponent",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async submitForm() {
      const userDate = {
        password: this.password,
        email: this.email,
      };
      await this.$store.dispatch("loginUser", userDate);
      this.email = "";
      this.password = "";
    },
  },
};
</script>

<style scoped>
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
  background-color: #303030;
  color: white;
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
