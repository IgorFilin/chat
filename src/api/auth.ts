import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
  credentials: "include",
} as any);

export const authApi = {
  registerUser(userData: any) {
    return instance.post("/user/registration", userData);
  },
  loginUser(userData: any) {
    return instance.post("/user/login", userData);
  },
};
