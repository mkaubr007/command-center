import { IHistory } from "../history/history-service-rep";
import { ICreatedBy, IRights } from "../rights/right-service-rep";


export interface IRoles
{
    name: string;
    createdBy: ICreatedBy;
    createdDate: Date;
    rights: IRights;
    isDeleted: boolean;
    histories: IHistory
    permissionsInBit: number;
}



