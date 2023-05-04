import { IStatus } from './status.interface';

export class Status implements IStatus {
    _id?: string;
    name: string;
    description: string;
    type: string;

    constructor(data?: IStatus) {
        if (data) {
          for (const key in data) {
            this[key] = data[key];
          }
        }
    }
}