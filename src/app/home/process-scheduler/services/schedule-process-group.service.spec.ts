import { TestBed } from '@angular/core/testing';

import { ScheduleProcessGroupService } from './schedule-process-group.service';

describe('ScheduleProcessGroupService', () => {
  let service: ScheduleProcessGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleProcessGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
