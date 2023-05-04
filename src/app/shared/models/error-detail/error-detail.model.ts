import {IBasicUser} from '../client-service-rep/client-service-rep';
import { IErrorDetail, IPriority } from '../../models/error-detail/error-detail.interface';
export class ErrorDetail implements IErrorDetail {
  _id?: string;
  status?: string;
  errorType: string;
  errorMessage: string;
  priority?: IPriority;
  assignedTo?: IBasicUser;
  date?: Date;
  jiraTicketId?: string;
  serviceName: string;
  environment: string;
  trace?: string;
  clientName: string;
  oldErrorStatus?:string;

  constructor(data?: ErrorDetail) {
    if (data) {
      for (const key in data) {
        this[key] = data[key];
      }
    }
  }
}
