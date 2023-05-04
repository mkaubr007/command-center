import { ICreatedBy, IRights } from "./right-service-rep";

export class Rights implements IRights {
  name: string;
  createdBy: ICreatedBy;
  createdDate: Date;
  description: string;
  category: string;
  permissionBit: number

  constructor(data?: Rights) {
    if (data) {
      for (const key in data) {
        this[key] = data[key];
      }
    }
  }

}

