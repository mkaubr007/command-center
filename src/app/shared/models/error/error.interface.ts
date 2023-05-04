export interface IErrorResponse {
  error: string;
  message: string;
  class?: string;
  statusCode?: number;
  status?: number;
}
export interface Success {
  data: any;
  class?: string;
  message: string;
  statusCode?: number;
  status?: number;
}

export interface IFilterName {
  name: string;
  selected?: boolean;
}

export interface IErrorUser {
  id?: string;
  name: string;
  avatar?: string;
  selected?: boolean;
  deactivated?: boolean;
}

export interface IErrorFilter {
  _id?: string;
  type?: IFilterName[];
  status?: IFilterName[];
  assignee?: IErrorUser[];
}

export interface IUserErrorCount {
  errorCount: number;
  csrCount?: number;
}
