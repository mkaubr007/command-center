import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../../../auth/auth.service';
import { CoreModule } from '../../../../../core/core.module';
import { CustomHttpService } from '../../../../../core/services/http.service';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { MaterialModule } from '../../../../../material/material.module';
import { JiraService } from '../../../../../shared/services/jira.service';
import { StatusService } from '../../../../../shared/services/status.service';
import { CacheService } from '../../../../cache-service';
import { SharedHomeModule } from '../../../../shared-home/shared-home.module';
import { TeamService } from '../../../../team/team.service';
import { ErrorFilterListComponent } from '../error-filter-list/error-filter-list.component';
import { ErrorService } from '../errors-tab/error.service';
import { NewErrorsList } from '../errors-tab/shared/constants/errors-test.constants';
import { ErrorFilterComponent } from './error-filter.component';
import { MockErrorService} from '../../components/errors-tab/mock-error.service';

describe('ErrorFilterComponent', () => {
  let component: ErrorFilterComponent;
  let fixture: ComponentFixture<ErrorFilterComponent>;
  let errorService: ErrorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ErrorFilterComponent,
        ErrorFilterListComponent,
       ],
       imports: [
        CoreModule,
        CommonModule,
        FormsModule,
        RouterTestingModule,
        MaterialModule,
        HttpClientModule,
        SharedHomeModule,
      ],
      providers: [
        LocalStorageService,
        TeamService,
        CacheService,
        StatusService,
        CustomHttpService,
        JiraService,
        AuthService,
        {provide: ErrorService, useClass:MockErrorService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorFilterComponent);
    component = fixture.componentInstance;
    errorService =  TestBed.inject(ErrorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear all', () => {
    const nextSpy = jest.spyOn(component.clearAll, 'next').mockImplementation();
    component.onClearAll();
    expect(nextSpy).toHaveBeenCalled();
  });

  it('onApply', () => {
    const nextSpy = jest.spyOn(errorService.getErrorsByFilter, 'next').mockImplementation();
    const emitSpy = jest.spyOn(component.apply, 'emit').mockImplementation();
    component.onApply();
    expect(emitSpy).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalled();
  });

  it('filterSelection', () => {
    component.filterSelection(NewErrorsList.SELECTED_FILTER, NewErrorsList.SELECTED_KEY);
    expect(errorService.filterSelection[NewErrorsList.SELECTED_KEY]).toEqual(NewErrorsList.SELECTED_FILTER);
  });

  it('onCancel', () => {
    const emitSpy = jest.spyOn(component.apply, 'emit').mockImplementation();
    component.onClose();
    expect(emitSpy).toHaveBeenCalled();
  });
});
