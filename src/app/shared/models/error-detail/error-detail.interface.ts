import {IBasicUser} from "../client-service-rep/client-service-rep";

export interface IErrorDetailResponse {
  data: IErrorDetail;
  message: string;
  statusCode: number;
}

export interface IErrorDetailSearchFilter {
  sortBy?: string;
  orderBy?: number;
  limit?: number;
  page?: number;
  match?: any;
  searchBy?: string;
  tab?: string;
}

export interface IErrorsDetailResponse {
  data: IErrorDetailResponseData;
  message: string;
  statusCode: number;
}

export interface IErrorDetailResponseData {
  count: number;
  result: IErrorDetail[];
  page?: number;
  totalCount?: number;
}

export interface IJiraState {
  tab: string;
  page: string | number;
  limit: string | number;
  errorId: string;
}

export interface IErrorDetail {
  _id?: string;
  status?: string;
  errorType: string;
  errorMessage: string;
  priority?: IPriority;
  assignedTo?: IBasicUser;
  date?: Date;
  jiraTicketId?: string;
  serviceName: string;
  clientName: string;
  environment: string;
  trace?: string;
  errorTimestamps?: Date[];
  oldErrorStatus?:string;
}

export interface IPriority {
    name: string;
    icon: string;
}

export interface IErrorDetailCount {
    allError: number;
    newError: number;
    unresolvedManualError: number;
    unresolvedJiraError: number;
    resolvedError: number;
}
