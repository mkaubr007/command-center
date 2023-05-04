import { IMetaData } from '../team-member/team-member';

export interface IAuth {
  access_token: string;
  token_type: string;
  user: IUser;
  permission?: number;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IName {
  first: string;
  last: string;
}

export interface IForgotOrResetPassword {
  email?: string;
  redirectURL?: string;
  passwordToken?: string;
}

export interface IUserRole {
  id: string;
  name: string;
}

export interface IUser {
  email: string;
  password: string;
  role: IUserRole;
  token: string;
  histories: [];
  name: IName;
  createdDate: string;
  specialities: [];
  status: string;
  _id: string;
  lastLogin?: Date;
  meta?: IMetaData;
  newNotificationCount?: number;
}

export interface IForgotOrResetPasswordData {
  data?: IForgotOrResetPassword;
  message: string;
  status: number;
  userId?: string;
}

export interface IResetPasswordParam {
    hash?: any;
    userId?: any;
    password?: any;
    redirectUrlForMail?:string;
}

export interface IChangePasswordParam {
  currentPassword: string;
  newPassword: string;
  userId: string;
}
