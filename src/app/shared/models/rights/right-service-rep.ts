export interface ICreatedBy {
    id: string;
    name: string;
  }

  export interface IRights {
    name: string;
    createdBy: ICreatedBy;
    createdDate: Date;
    description: string;
    category: string;
    permissionBit: number
}


