import { TestBed } from '@angular/core/testing';

import { ProcessArgumentsService } from './process-arguments.service';

describe('ProcessArgumentsService', () => {
  let service: ProcessArgumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessArgumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
