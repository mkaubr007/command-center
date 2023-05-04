import { IRights } from '../team-member/team-member';
import { IcheckInTimeInterval } from '../client-service-rep/client-service-rep';

export class Service {
    _id?: string;
    id?: string;
    name: string;
    createdBy?: IRights;
    description?: string;
    type?: string;
    createdDate?: Date;
    checkInTimeInterval?: IcheckInTimeInterval;
  
    constructor(data?: Service) {
      if (data) {
        for (const key in data) {
          this[key] = data[key];
        }
      }
    }
  }