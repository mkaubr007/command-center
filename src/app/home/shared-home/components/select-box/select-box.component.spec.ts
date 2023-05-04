import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { SelectBoxTestConstant } from './select-box-test.constant';
import { SelectBoxComponent } from './select-box.component';


describe('SelectBoxComponent', () => {
  let component: SelectBoxComponent;
  let fixture: ComponentFixture<SelectBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBoxComponent ],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBoxComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return first data from value as Array of object ', () => {
    component.selection = SelectBoxTestConstant.SELECTION_ARRAY_OF_OBJECT;
    component.labelKey = SelectBoxTestConstant.LABEL_KEY;
    expect(component.getFirstValue()).toEqual(SelectBoxTestConstant.SELECTION_STRING_ARRAY[0]);
  });

  it('should return first data from value as string Array', () => {
    component.selection = SelectBoxTestConstant.SELECTION_STRING_ARRAY;
    component.labelKey = '';
    expect(component.getFirstValue()).toEqual(SelectBoxTestConstant.SELECTION_STRING_ARRAY[0]);
  });

  it('should return empty string', () => {
    component.selection = [];
    component.labelKey = '';
    expect(component.getFirstValue()).toEqual('');
  });

  it('should write value', () => {
    component.writeValue(SelectBoxTestConstant.LABEL_KEY);
    expect(component.selection).toEqual(SelectBoxTestConstant.LABEL_KEY);
  })
});
