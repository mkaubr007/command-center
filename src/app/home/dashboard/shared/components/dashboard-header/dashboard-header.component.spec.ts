import { MaterialModule } from './../../../../../material/material.module';
import { SharedHomeModule } from './../../../../shared-home/shared-home.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorService } from '../errors-tab/error.service';
import { DashboardHeaderComponent } from './dashboard-header.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DashboardRoutingModule } from '../../../dashboard-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DashboardComponent } from '../../../dashboard.component';
import { ErrorsTabComponent } from '../errors-tab/errors-tab.component';
import { ErrorsTableComponent } from '../../errors-table/errors-table.component';
import { CreateEditJiraTicketComponent } from '../create-edit-jira-ticket/create-edit-jira-ticket.component';
import { FileProcessingComponent } from '../file-processing/file-processing.component';
import { ServiceComponent } from '../service/service.component';
import { TeamOverviewComponent } from '../team-overview/team-overview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { tap } from 'rxjs/operators';
import { SearchFieldComponent } from '../../../../shared-home/components/search-field/search-field.component';
import { Daterange } from 'src/app/shared/models/date/daterange.model';
import { MockErrorService } from '../../components/errors-tab/mock-error.service';
import { of } from 'rxjs';
const SEARCH_VALUE = 'error type';

describe('DashboardHeaderComponent', () => {
  let component: DashboardHeaderComponent;
  let fixture: ComponentFixture<DashboardHeaderComponent>;
  let errorService: ErrorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedHomeModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        PerfectScrollbarModule,
        DashboardRoutingModule,
        NgSelectModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        DashboardComponent,
        ServiceComponent,
        TeamOverviewComponent,
        FileProcessingComponent,
        ErrorsTabComponent,
        DashboardHeaderComponent,
        CreateEditJiraTicketComponent,
        ErrorsTableComponent,
      ],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
      ]
    })
      .overrideTemplate(DashboardHeaderComponent, '<div></div>')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHeaderComponent);
    component = fixture.componentInstance;
    errorService = TestBed.inject(ErrorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    const onSearchByErrorChangeMock = jest
      .spyOn(component.errorService, 'onSearchByErrorChange')
      .mockImplementation();

    const getCurrentSearchMock = jest.spyOn(errorService, 'getCurrentSearch')
      .mockImplementation(() => of({}));

    component.ngOnInit();
    const formControl = component.searchForm.get('searchByErrorType');

    expect(getCurrentSearchMock).toHaveBeenCalled();

    formControl.patchValue(SEARCH_VALUE);
    formControl.updateValueAndValidity({ emitEvent: true });
    formControl.valueChanges.pipe(
      tap((value) => {
        expect(value).toBe(SEARCH_VALUE);
        expect(onSearchByErrorChangeMock).toHaveBeenCalled();
      })
    );
  });

  it('should reset form', () => {
    const searchFormResetMock = jest
      .spyOn(component.searchForm, 'reset')
      .mockImplementation();

    component.searchFieldComponentRef = new SearchFieldComponent();

    const searchFieldComponentRefOnClearMock = jest
      .spyOn(component.searchFieldComponentRef, 'onClear')
      .mockImplementation();

    component.resetForm();

    expect(searchFormResetMock).toHaveBeenCalled();
    expect(searchFieldComponentRefOnClearMock).toHaveBeenCalled();
    expect(component.doRefresh).toBe(true);
  });

  it('updateDate', () => {
    const setDateRangeSpy = jest
      .spyOn(errorService, 'setDateRange')

    const dateRange: Daterange = { startDate: 'test', endDate: 'test' }

    component.updateDate(dateRange);

    expect(setDateRangeSpy).toHaveBeenCalled();
  });

  it('filterClick when filter is not open', () => {
    component.isfilterOpen = false;

    component.filterClick();

    expect(component.isfilterOpen).toBeTruthy();
  });

  it('filterClick when filter is open', () => {
    component.isfilterOpen = true;

    component.filterClick();

    expect(component.isfilterOpen).toBeFalsy();
  });

});
