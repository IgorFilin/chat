import axios, { AxiosResponse } from "axios";
import { LoginUserType, RegisterUserType, ResponseLoginType } from "./typesApi";

const instance = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
  credentials: "include",
} as any);

export const authApi = {
  registerUser(userData: RegisterUserType) {
    return instance.post<AxiosResponse>("/user/registration", userData);
  },
  loginUser(userData: LoginUserType) {
    return instance.post<ResponseLoginType>("/user/login", userData);
  },
  auth() {
    return instance.get("user/auth");
  },
};
