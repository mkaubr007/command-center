export interface IHistoryUser {
    id: string;
    name: string;
}

export interface IHistory {
    field: string;
    previousValue: string;
    newValue: string;
    date: Date;
    user: IHistoryUser
}


