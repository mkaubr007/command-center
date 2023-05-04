import { CustomHttpService } from '../../core/services/http.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { TeamService } from './team.service';

describe('TeamService', () => {
  let service: TeamService;
  let http: CustomHttpService;
  let localStorageService: LocalStorageService;
  beforeEach(() => {
    service = new TeamService(http, localStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
