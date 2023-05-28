import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
  credentials: "include",
});

export const authApi = {
  registerUser(userData) {
    return instance.post("/user/registration", userData);
  },
  loginUser(userData) {
    return instance.post("/user/login", userData);
  },
};
