import { ProcessListArguments } from "../cosa-nostra/process.model";

export interface IProcessGroup {
  _id?: string
  name: string;
  Processess?: IProcessGroupProcesses[],
  processDetails?: IProcess[],
  parallelism: number;
  client: string;
  environment: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  isPublished?: boolean;
  isScheduled?: boolean;
}

export interface IProcessGroupProcesses {
  id: string;
  isEnabled: boolean;
  status?: string;
}

export interface IProcess {
  _id?: string;
  selected: boolean;
  arguments: ProcessListArguments
  dependencies: []
  isEnabled: boolean
  failureFatal: boolean
  nonFatalExceptions: []
  status: string
  isDeleted: boolean
  isPublished: boolean
  createdAt: Date
  name: string
  displayName: string
  assembly: string
  class: string
  runnerAssembly: string
  runner: string
  environment: string

}

export interface IProcessGroupResponse {
  data: IProcessGroupResponseData;
  message: string;
  statusCode: number;
}

export interface IProcessGroupResponses {
  data: IProcessGroup;
  message: string;
  statusCode: number;
}

export interface IProcessGroupResponseData {
  count: number;
  result: IProcessGroup[];
}
