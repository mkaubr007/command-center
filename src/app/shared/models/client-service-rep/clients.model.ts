import { IErrorUser } from '../error/error.interface';
import { IBasicUser, IEnvironments } from './client-service-rep';

export class Clients {
  _id?: string;
  createdDate?: Date;
  supportPersons?: IBasicUser[];
  name: string;
  createdBy?: IBasicUser;
  serviceRepresentative: IBasicUser;
  environments?: IEnvironments[];
  //Currently blank so not able to define type
  services?: any;
  team?: IErrorUser[];

  constructor(data?: Clients) {
    if (data) {
      for (const key in data) {
        this[key] = data[key];
      }
    }
  }
}
