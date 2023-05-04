
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CsvExportComponent } from './csv-export.component';
import { CsvExportService } from './csv-export.service';

describe('CsvExportComponent', () => {
  let component: CsvExportComponent;
  let fixture: ComponentFixture<CsvExportComponent>;
  let csvExportService: CsvExportService;

  class CsvExportServiceMock {
    exportCsv(): Observable<any> {
      return of({});
    }
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CsvExportComponent],
      imports: [
        FormsModule,
      ],
      providers: [
        { provide: CsvExportService, useClass: CsvExportServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CsvExportComponent);
    component = fixture.debugElement.componentInstance;
    csvExportService = TestBed.get(CsvExportService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call export method', async () => {
    const exportCsvSpy = jest.spyOn(csvExportService, 'exportCsv').mockImplementation(() => of({}));

    component.export();

    expect(exportCsvSpy).toHaveBeenCalled();
    expect(component.btnDisable).toBeFalsy();
  });
});
