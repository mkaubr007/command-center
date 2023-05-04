import { TestBed } from '@angular/core/testing';

import { ProcessGroupService } from './process-group.service';

describe('ProcessGroupService', () => {
  let service: ProcessGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
