import { Injectable } from '@angular/core';
import { AssigneeDropdownCacheService } from '../services/assignee-dropdown-service/assignee-dropdown.cache.service';

@Injectable()
export class CacheService {
  constructor(
    private assigneeDropdownCacheService: AssigneeDropdownCacheService,
  ) {}

  public initCacheService() {
    this.assigneeDropdownCacheService.setAssigneesToCache();
  }
}
