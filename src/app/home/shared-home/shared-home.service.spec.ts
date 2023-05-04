import { SharedHomeService } from './shared-home.service';

describe('SharedHomeService', () => {
  let service: SharedHomeService;

  beforeEach(() => {
    service = new SharedHomeService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
