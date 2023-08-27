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
  key: string;
}

export interface ResponseRegisterUserType {
  isRegConfirm: boolean;
}
