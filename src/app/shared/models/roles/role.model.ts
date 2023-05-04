import { IHistory } from "../history/history-service-rep";
import { ICreatedBy, IRights } from "../rights/right-service-rep";
import { IRoles } from "./role.-service-rep";



export class Role implements IRoles {
    name: string;
    createdBy: ICreatedBy;
    createdDate: Date;
    rights: IRights;
    isDeleted: boolean;
    histories: IHistory
    permissionsInBit: number;

    constructor(data?: Role) {
        if (data) {
          for (const key in data) {
            this[key] = data[key];
          }
        }
      }
}


