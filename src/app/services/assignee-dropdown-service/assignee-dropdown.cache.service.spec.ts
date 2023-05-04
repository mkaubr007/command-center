import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { LocalStorageConstants } from 'src/app/core/constants/local-storage.constants';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UpdateClientConstants } from 'src/app/home/team/shared/components/add-and-update-client/update.test.constants';
import { TeamService } from 'src/app/home/team/team.service';
import { IClientServiceRep } from '../../shared/models/client-service-rep/client-service-rep';
import { AssigneeDropdownCacheConstants } from './assignee-dropdown.cache.constants';
import { AssigneeDropdownCacheService } from './assignee-dropdown.cache.service';

class TeamServiceMock {
  searchTeamMembers(): Observable<IClientServiceRep[]> {
    return of(UpdateClientConstants.SEARCH_TEAM_MEMBERS);
  }
}

describe('AssigneeDropdownCacheService', () => {
  let service: AssigneeDropdownCacheService;
  let localStorage: LocalStorageService;
  let teamService: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        LocalStorageService,
        AssigneeDropdownCacheService,
        { provide: TeamService, useClass: TeamServiceMock },
      ]
    });
    service = TestBed.inject(AssigneeDropdownCacheService);
    teamService = TestBed.inject(TeamService);
    localStorage = TestBed.get(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set assignees again to cache', async () => {
    const setAssigneesToCacheSpy = jest.spyOn(service, "setAssigneesToCache").mockImplementation();

    service.assigneeHitAgain = true;
    service.assigneeHitInProgeress = false;

    await service.setAssigneesToCacheAgain();

    expect(setAssigneesToCacheSpy).toHaveBeenCalledTimes(0);

    service.assigneeHitAgain = false ;

    await service.setAssigneesToCacheAgain();
  });

  it('should set assignees using localstorage', () => {
    localStorage.setItemInLocalStorageWithoutJSON(
      LocalStorageConstants.ASSIGNEES, JSON.stringify(AssigneeDropdownCacheConstants.ASSIGNEES));
    const nextSpy = jest.spyOn(service['assigneeSubject'], 'next').mockImplementation();

    service.setAssigneesToCache();

    expect(nextSpy).toHaveBeenCalled();
  });

  it('should set assignees using http hit', async () => {
    jest.spyOn(teamService, 'searchTeamMembers').mockImplementation(() => of(AssigneeDropdownCacheConstants.ASSGINEE_LIST));
    const nextSpy = jest.spyOn(service['assigneeSubject'], 'next').mockImplementation();
    localStorage.deleteLocalStorage(LocalStorageConstants.ASSIGNEES);

    await service.setAssigneesToCache();

    expect(nextSpy).toHaveBeenCalledWith(AssigneeDropdownCacheConstants.ASSIGNEES);
    expect(localStorage.getLocalStorage(LocalStorageConstants.ASSIGNEES)).toEqual(AssigneeDropdownCacheConstants.ASSIGNEES);
    expect(service.assigneeHitInProgeress).toEqual(false);
  });

  it('should throw error', async () => {
    jest.spyOn(teamService, 'searchTeamMembers').mockImplementation(() => throwError('test Error'));
    jest.spyOn(service['assigneeSubject'], 'next').mockImplementation();
    localStorage.deleteLocalStorage(LocalStorageConstants.ASSIGNEES);

    await service.setAssigneesToCache();

    expect(localStorage.getLocalStorage(LocalStorageConstants.ASSIGNEES)).toBe(null);
    expect(service.assigneeHitInProgeress).toEqual(false);
  });

  
  it('should update assignees', async () => {
    
    jest.spyOn(service['assigneeSubject'], 'next').mockImplementation();
    const response = await service.updateAssigneeCache();

    expect(response[0].name).toBe(UpdateClientConstants.SEARCH_TEAM_MEMBERS_NAME);

  });
});
