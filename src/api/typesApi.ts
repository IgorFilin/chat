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
