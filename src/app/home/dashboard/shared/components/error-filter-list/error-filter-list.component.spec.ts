import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../../../../core/core.module';
import { MaterialModule } from '../../../../../material/material.module';
import { SharedHomeModule } from '../../../../shared-home/shared-home.module';
import { NewErrorsList } from '../errors-tab/shared/constants/errors-test.constants';
import { ErrorFilterListComponent } from './error-filter-list.component';
import { MockErrorService} from '../../components/errors-tab/mock-error.service';
import { ErrorService } from '../../components/errors-tab/error.service';

describe('ErrorFilterListComponent', () => {
  let component: ErrorFilterListComponent;
  let fixture: ComponentFixture<ErrorFilterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorFilterListComponent ],
      imports: [
       CoreModule,
       CommonModule,
       FormsModule,
       MaterialModule,
       SharedHomeModule,
     ],
     providers:[{provide: ErrorService, useClass:MockErrorService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorFilterListComponent);
    component = fixture.componentInstance;
    component.listData = NewErrorsList.LIST_DATA;
    component.labelKey = NewErrorsList.SELECTED_KEY;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select one value', () => {
    const addSelectionSpy = jest.spyOn<any, any>(component, 'addSelection');
    const emitSpy = jest.spyOn(component.filterSelection, 'emit').mockImplementation();
    component.onSelection();
    expect(component.allSelected).toBeFalsy();
    expect(addSelectionSpy).toHaveBeenCalled();
    expect(component.indeterminate).toBeTruthy();
    expect(emitSpy).toHaveBeenCalledWith([NewErrorsList.LIST_DATA[0].name]);
  });

  it('should clear value', () => {
    const emitSpy = jest.spyOn(component.filterSelection, 'emit').mockImplementation();
    component.onClear();
    expect(component.listData[0].selected).toBeFalsy();
    expect(component.allSelected).toBeFalsy();
    expect(component.indeterminate).toBeFalsy();
    expect(emitSpy).toHaveBeenCalledWith([]);
  });

  it('should select all value', () => {
    component.onAllSelectionChange(true);
    expect(component.allSelected).toBeTruthy();
  });
});
