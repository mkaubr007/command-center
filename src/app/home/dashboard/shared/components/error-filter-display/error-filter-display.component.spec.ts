import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '../../../../../core/core.module';
import { SharedHomeModule } from '../../../../shared-home/shared-home.module';
import { ErrorService } from '../errors-tab/error.service';
import { MockErrorService } from '../errors-tab/mock-error.service';
import { NewErrorsList } from '../errors-tab/shared/constants/errors-test.constants';
import { ErrorFilterDisplayComponent } from './error-filter-display.component';

describe('ErrorFilterDisplayComponent', () => {
  let component: ErrorFilterDisplayComponent;
  let fixture: ComponentFixture<ErrorFilterDisplayComponent>;
  let errorService: ErrorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ErrorFilterDisplayComponent
       ],
       imports: [
        CoreModule,
        CommonModule,
        SharedHomeModule,
      ],
      providers: [
        {provide: ErrorService, useClass:MockErrorService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorFilterDisplayComponent);
    component = fixture.componentInstance;
    errorService =  TestBed.inject(ErrorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    component.errorService.filterSelection = NewErrorsList.FILTER_SELECTION
    component.errorService.filterListData = NewErrorsList.FILTER_LIST_DATA;
    const getErrorFilterSpy = spyOn(errorService.getErrorsByFilter, 'next');
    
    component.filterDeSelection(0,'name','test','type');

    expect(getErrorFilterSpy).toHaveBeenCalled();
    
  });
});
