import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../../../core/core.module';
import { MaterialModule } from '../../../../material/material.module';
import { NewErrorsList } from '../../../dashboard/shared/components/errors-tab/shared/constants/errors-test.constants';

import { TriStateCheckboxComponent } from './tri-state-checkbox.component';

describe('TriStateCheckboxComponent', () => {
  let component: TriStateCheckboxComponent;
  let fixture: ComponentFixture<TriStateCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriStateCheckboxComponent ],
      imports: [
        CoreModule,
        CommonModule,
        FormsModule,
        MaterialModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriStateCheckboxComponent);
    component = fixture.componentInstance;
    component.list = NewErrorsList.LIST_DATA;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select all', () => {
    const emitSpy = jest.spyOn(component.selectionChange, 'emit').mockImplementation();
    component.selectAll(true);
    expect(component.allSelected).toBeTruthy();
    expect(component.list[1].selected).toBeTruthy();
    expect(emitSpy).toHaveBeenCalledWith(true);
  });
});
