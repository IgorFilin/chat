import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/",
});

export const authApi = {
  registerUser(userData) {
    return instance.post("/users", userData);
  },
  loginUser(userData) {
    return instance.post("/login", userData);
  },
};
