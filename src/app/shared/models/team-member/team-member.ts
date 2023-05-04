import { TeamMember } from './team-member.model';
import { IName } from '../auth/auth';

export interface IProfileData {
  name: string;
  uniqueName: string;
  url: string;
}

export interface IProfileParam {
  data: IProfileData;
  message: string;
  statusCode: number;
}

export interface IMetaData {
  profilePic: string;
  uniqueName: string;
  url?: string;
}

export interface IAddTeamMember {
  data: TeamMember;
  message: string;
  statusCode: number;
}

export interface ITeamMember {
  name: IName;
  email?: string;
  createdBy?: IRights;
  createdDate?: string;
  histories?: [];
  role?: IRights;
  meta?: IMetaData;
  specialities?: [];
  _id?: string;
}

export interface ICreatedByRole {
  _id?: string;
  id?: string;
  name: string;
  createdBy?: IRights;
  createdDate?: Date;
  rights: IRights[];
  isDeleted?: boolean;
  histories?: IHistory[];
}

export interface IRights {
  id: string;
  name: string;
  email?: string;
}

export interface IHistory {
  field: string;
  previousValue: string;
  newValue: string;
  date: Date;
  user: IRights;
}

export interface ITeamMemberParam {
  data: ITeamMemberDataParam;
  message: string;
  statusCode: number;
}

export interface ITeamMemberDataParam {
  count: number;
  result: ITeamMember[];
}

export interface IMemberList {
  assignedOn?: string[];
  email?: string;
  profilePic?: string;
  role?: string;
  teamMember?: string;
  id?: string;
  _id?: string;
}

export interface ITeamOverview {
  _id: string;
  name: string;
  avatar: string;
  pendingErrorCount: number;
  unresolvedManualErrorCount: number;
}
