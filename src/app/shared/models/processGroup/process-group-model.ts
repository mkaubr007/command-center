
import { IProcess, IProcessGroupProcesses } from "./process-group-service-rep";

export class ProcessGroup {
  _id?: string
  name: string;
  Processess?: IProcessGroupProcesses[];
  processDetails?: IProcess[];
  parallelism: number;
  client: string;
  environment: string;
  createdAt?: Date;
  updatedAt?: Date; 
  isDeleted?: boolean; 
  isPublished?:boolean;
  isScheduled?:boolean;
   

  
    constructor(data?: ProcessGroup) {
        if (data) {
          for (const key in data) {
            this[key] = data[key];
          }
        }
      }
  }