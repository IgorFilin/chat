export interface LoginUserType {
  email: string;
  password: string | number;
}

export interface RegisterUserType {
  name: string;
  email: string;
  password: string | number;
}

export interface ResponseLoginType {
  message: string;
  name: string;
}

export interface ResponseLogoutType {
  isAuth: boolean;
}

export interface ResponseConfirmRegType {
  name: string;
  message: string;
}

export interface ResponseRegisterUserType {
  isRegConfirm: boolean;
  message: string;
}
