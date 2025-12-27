export interface IUser {
  email: string;
  password: string;
}

export interface IUserResponse {
  _id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterRequest {
  email: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  user: IUserResponse;
}
