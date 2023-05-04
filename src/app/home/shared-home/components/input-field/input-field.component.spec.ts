import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFieldComponent } from './input-field.component';
import { MaterialModule } from '../../../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, BrowserAnimationsModule],
      declarations: [InputFieldComponent],
    }).overrideTemplate(InputFieldComponent, '<div></div>')
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should write input value', () => {
    component.writeValue('1');
    expect(component.inputValue).toEqual('1');
  });

  it('should emit input change', () => {
    const onChangeSpy = jest.spyOn(component, 'onChange').mockImplementation();
    const emitSpy = jest.spyOn(component.inputChange, 'emit').mockImplementation();
    component.getInputValue('1');
    expect(onChangeSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should set input field to disabled', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBeTruthy();
  })
});
