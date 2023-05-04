import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { BlockUIModule } from 'ng-block-ui';
import { MaterialModule } from '../../../../material/material.module';
import { AssigneeDropdownCacheService } from '../../../../services/assignee-dropdown-service/assignee-dropdown.cache.service';

import { AssigneeDropdownComponent } from './assignee-dropdown.component';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { LocalStorageConstants } from 'src/app/core/constants/local-storage.constants';
import { AssigneeDropdownCacheConstants } from 'src/app/services/assignee-dropdown-service/assignee-dropdown.cache.constants';
import { Subject } from 'rxjs';

class AssigneeDropdownCacheServiceMock {
  assigneeSubject = new Subject();
  assigneeHitAgain = false;

  setAssigneesToCache() {
  }

  setAssigneesToCacheAgain() {
  }
}

describe('AssigneeDropdownComponent', () => {
  let component: AssigneeDropdownComponent;
  let fixture: ComponentFixture<AssigneeDropdownComponent>;
  let localStorage: LocalStorageService;
  let assigneeDropdownCacheService: AssigneeDropdownCacheService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssigneeDropdownComponent],
      imports: [
        MaterialModule,
        CommonModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        FormsModule,
        BlockUIModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        NgSelectModule
      ],
      providers: [
        LocalStorageService,
        { provide: AssigneeDropdownCacheService, useClass: AssigneeDropdownCacheServiceMock }
      ]
    }) .overrideTemplate(AssigneeDropdownComponent, '<div></div>')
      .compileComponents();
     
    fixture = TestBed.createComponent(AssigneeDropdownComponent);
    component = fixture.componentInstance;
    assigneeDropdownCacheService = TestBed.inject(AssigneeDropdownCacheService);
  }));

  it('should create AssigneeDropdownComponent', () => {
    expect(component).toBeTruthy();
  });

  it('get assignees value from localstorage and one of the error assigneed not present in the assignee options', () => {
    
    localStorage = TestBed.inject(LocalStorageService); 
    localStorage.setItemInLocalStorageWithoutJSON(
      LocalStorageConstants.ASSIGNEES, JSON.stringify(AssigneeDropdownCacheConstants.ASSIGNEES));

    component.element = AssigneeDropdownCacheConstants.DropDownElement;
    component.ngOnInit();

    expect(component.assignedOptions).toEqual(AssigneeDropdownCacheConstants.ASSIGNEES);
  });

  it('Should get date from  assigneeSubject when localstorage does not have data', () => {
    
    localStorage = TestBed.inject(LocalStorageService); 
    localStorage.deleteLocalStorage(LocalStorageConstants.ASSIGNEES);

    const setAssigneesSpy = jest.spyOn(assigneeDropdownCacheService, 'setAssigneesToCacheAgain').mockImplementation();
    assigneeDropdownCacheService.assigneeSubject.next(AssigneeDropdownCacheConstants.ASSIGNEES);
    assigneeDropdownCacheService.assigneeHitAgain = false;

    component.element = AssigneeDropdownCacheConstants.DropDownElement;
    component.ngOnInit();

    expect(setAssigneesSpy).toHaveBeenCalled();
    assigneeDropdownCacheService.assigneeSubject.subscribe(data => {
      expect(component.assignedOptions).toEqual(data);
    });
  });

  it('Should emit data on selection change', () => {
    const selectionChangeSpy = jest.spyOn(component.selectionChange, 'emit').mockImplementation();

    component.onChange(AssigneeDropdownCacheConstants.ASSIGNEES);

    expect(selectionChangeSpy).toHaveBeenCalledWith(AssigneeDropdownCacheConstants.ASSIGNEES);
  });


});
