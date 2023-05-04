import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { CustomHttpService } from 'src/app/core/services/http.service';
import { ErrorDetail } from '../../models/error-detail/error-detail.model';
import { CsvExportService } from './csv-export.service';

describe('CsvExportService', () => {
  let csvExportService: CsvExportService;
  let customHttpService: CustomHttpService;
  const { URL } = window;

  class CustomHttpServiceMock {
    get(): Observable<any> {
      return of({'body':{'data':{'result':[new ErrorDetail()]}}});
    }
  }

  beforeAll((): void => {
    delete window.URL;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    window.URL = {
      createObjectURL: (url) => url,
      revokeObjectURL: (url) => url,
    };
  });

  afterAll((): void => {
    window.URL = URL;
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        CsvExportService,
        { provide: CustomHttpService, useClass: CustomHttpServiceMock },
      ]
    }).compileComponents();

    csvExportService = TestBed.inject(CsvExportService);
    customHttpService = TestBed.inject(CustomHttpService);
  });

  it('should create', () => {
    expect(csvExportService).toBeTruthy();
  });

  it('should export file', async () => {
    const httpSpy = jest.spyOn(customHttpService, 'get');

    const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation();
    jest.spyOn(document.body, 'appendChild').mockImplementation();
    csvExportService.exportCsv({}, '/error-details/export', 'COMMAND_CENTER_ERRORS').subscribe(data => {
      expect(httpSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalledWith(document.createElement('a'));
    });

  });
});
