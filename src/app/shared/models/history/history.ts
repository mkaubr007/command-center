import { IHistory, IHistoryUser } from "./history-service-rep";

export class History implements IHistory {
    field: string;
    previousValue: string;
    newValue: string;
    date: Date;
    user: IHistoryUser
}


