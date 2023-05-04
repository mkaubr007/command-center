import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AssigneeDropdownCacheService } from '../services/assignee-dropdown-service/assignee-dropdown.cache.service';
import { CacheService } from './cache-service';

class AssigneeDropdownCacheServiceMock {
  setAssigneesToCache() {}
}

describe('Cacheservice', () => {
  let cacheService: CacheService;
  let assigneeDropdownCacheService: AssigneeDropdownCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        CacheService,
        {
          provide: AssigneeDropdownCacheService,
          useClass: AssigneeDropdownCacheServiceMock,
        },
      ],
    });
    cacheService = TestBed.inject(CacheService);
    assigneeDropdownCacheService = TestBed.inject(AssigneeDropdownCacheService);
  });

  it('should be created', () => {
    expect(cacheService).toBeTruthy();
  });

  it('should initCacheService', async () => {
    const setAssigneesSpy = jest
      .spyOn(assigneeDropdownCacheService, 'setAssigneesToCache')
      .mockImplementation();

    cacheService.initCacheService();

    expect(setAssigneesSpy).toHaveBeenCalled();
  });
});
