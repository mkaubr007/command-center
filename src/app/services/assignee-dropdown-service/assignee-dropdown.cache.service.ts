import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageConstants } from 'src/app/core/constants/local-storage.constants';
import { TeamService } from 'src/app/home/team/team.service';
import Utils from '../../home/shared-home/utils/utils';
import { IName } from '../../shared/models/auth/auth';
import { IAssigneeDropdown, IClientServiceRep } from '../../shared/models/client-service-rep/client-service-rep';

@Injectable({
  providedIn: 'root'
})
export class AssigneeDropdownCacheService {
  public assigneeSubject = new BehaviorSubject<IAssigneeDropdown[]>([]);
  public assigneeHitInProgeress = false;
  public assigneeHitAgain = false;
  constructor(
    private teamService: TeamService) {
  }

  private getAssignees(data: IClientServiceRep[]): IAssigneeDropdown[] {
    const assignees = [];
    data.forEach((user) => {
      const name = Utils.getFullName(user.name as IName);
      assignees.push({
        name,
        imageUrl: user?.meta?.profilePic || '',
        id: user._id,
      });
    });
    return assignees;
  }

  public async setAssigneesToCache(): Promise<void> {
    const cacheAssignees: IAssigneeDropdown[] = JSON.parse(localStorage.getItem(LocalStorageConstants.ASSIGNEES)) as IAssigneeDropdown[];
    if (!cacheAssignees) {
      try {
        this.assigneeHitInProgeress = true;
        const data: IClientServiceRep[] = await this.teamService.searchTeamMembers(
          {}, { _id: 1, name: 1, meta: 1 }, { 'name.first': 1 }).toPromise();
        const assignees = this.getAssignees(data);
        this.assigneeSubject.next(assignees);
        localStorage.setItem(LocalStorageConstants.ASSIGNEES, JSON.stringify(assignees));
        this.assigneeHitInProgeress = false;
      } catch (err) {
        console.log(err);
        this.assigneeHitInProgeress = false;
      }
    } else {
      this.assigneeSubject.next(cacheAssignees);
    }
  }

  public async setAssigneesToCacheAgain(): Promise<void> {
    if (!this.assigneeHitInProgeress && !this.assigneeHitAgain) {
      this.assigneeHitAgain = true;
      await this.setAssigneesToCache();
    }
  }

  public async updateAssigneeCache(): Promise<any> {
    this.assigneeHitInProgeress = true;
    const data: IClientServiceRep[] = await this.teamService.searchTeamMembers(
      {}, { _id: 1, name: 1, meta: 1, status: 1 }, { 'name.first': 1 }).toPromise();
    const assignees = this.getAssignees(data);
    this.assigneeSubject.next(assignees);
    localStorage.setItem(LocalStorageConstants.ASSIGNEES, JSON.stringify(assignees));
    this.assigneeHitInProgeress = false;
    return assignees;
  }
}
