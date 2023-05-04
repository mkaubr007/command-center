import { IName } from '../auth/auth';
import { IMetaData, IRights, IHistory } from './team-member';

export class TeamMemberResponse {
  count: number;
  result: TeamMember[];

  constructor(data?: TeamMemberResponse) {
    if (data) {
      for (const key in data) {
        this[key] = data[key];
      }
    }
  }
}
export class TeamMember {
  name: IName;
  email?: string;
  createdBy?: IRights;
  createdDate?: string;
  histories?: [];
  role?: IRights;
  meta?: IMetaData;
  specialities?: [];
  _id?: string;
  redirectUrlForMail?: string;
  status?:string;
  
  constructor(data?: TeamMember) {
    if (data) {
      for (const key in data) {
        this[key] = data[key];
      }
    }
  }
}

export class CreatedByRole {
  _id?: string;
  id?: string;
  name: string;
  createdBy?: IRights;
  createdDate?: Date;
  rights: IRights[];
  isDeleted?: boolean;
  histories?: IHistory[];

  constructor(data?: CreatedByRole) {
    if (data) {
      for (const key in data) {
        this[key] = data[key];
      }
    }
  }
}
