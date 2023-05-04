import { IName } from '../auth/auth';
import { IErrorUser } from '../error/error.interface';
import { IRights } from '../team-member/team-member';

export interface IClientServiceRep {
  _id: string;
  name: IName | string;
  meta?: IMetaData;
}

export interface IBasicUser {
  id: string;
  name: string;
  avatar?: string;
  status?: string;
}

export interface IClientServiceResponse {
  data: IClientServiceRep;
  message: string;
  statusCode: number;
}

export interface IAssigneeDropdown {
  id: string;
  name: string;
  imageUrl: string;
}

export interface IClientEnvResponse {
  data: boolean,
  message: string;
  statusCode: number;
}

export interface IcheckInTimeInterval {
  time?: number;
  unit?: string;
}

export interface IService {
  _id?: string;
  id?: string;
  name: string;
  createdBy?: IRights;
  description?: string;
  type?: string;
  createdDate?: Date;
  status?: string;
  checkInTimeInterval?: IcheckInTimeInterval;
}

export interface IServiceResponse {
  data: IService;
  message: string;
  statusCode: number;
}

export interface IEnvironments {
  isPrioritized: boolean;
  name: string;
  status: string;
  services: IService[];
  _id?: string;
}


export interface IClient {
  _id?: string;
  createdDate?: Date;
  supportPersons?: IBasicUser[];
  name: string;
  createdBy: IBasicUser;
  serviceRepresentative: IBasicUser;
  environments?: IEnvironments[];
  isEnvPrioritized?: IEnvironments[];
  status: string;
  team?: IErrorUser[];
}


export interface IClientResponse {
  data: IClient;
  message: string;
  statusCode: number;
}

export interface IClientsResponse {
  data: IClientResponseData;
  message: string;
  statusCode: number;
}

export interface IClientResponseData {
  count: number;
  result: IClient[];
}

export interface IMetaData{
  profilePic: string;
  uniqueName: string;
  description: string;
}
