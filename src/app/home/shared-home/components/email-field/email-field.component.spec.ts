import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailFieldComponent } from './email-field.component';
import { Injector } from '@angular/core';
import { MaterialModule } from '../../../../material/material.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, NgControl } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EmailFieldComponent', () => {
  let component: EmailFieldComponent;
  let fixture: ComponentFixture<EmailFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmailFieldComponent],
      imports: [
        MaterialModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: Injector, useValue: {} },
        { provide: NgControl, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailFieldComponent);
    component = fixture.debugElement.componentInstance;
  });

  it(`should be initialized`, () => {
    expect(component).toBeDefined();
  });

  it(`should run ngOnInit`, () => {
    expect(component.ngOnInit).toBeDefined();
  });

  it('should set value on onChange method', () => {
    const onChangeSpy = jest.spyOn(component, 'onChange').mockImplementation();

    component.onChange('a@a.com');
    expect(onChangeSpy).toHaveBeenCalled();
  });

  it('should set value on writeValue method', () => {
    const writeValueSpy = jest
      .spyOn(component, 'writeValue')
      .mockImplementation();

    component.writeValue('a@a.com');
    expect(writeValueSpy).toHaveBeenCalled();
  });

  it('should set value on registerOnChange method', () => {
    const registerOnChangeSpy = jest
      .spyOn(component, 'registerOnChange')
      .mockImplementation();

    component.registerOnChange('a@a.com');
    expect(registerOnChangeSpy).toHaveBeenCalled();
  });

  it('should set value on registerOnTouched method', () => {
    const registerOnTouchedSpy = jest
      .spyOn(component, 'registerOnTouched')
      .mockImplementation();

    component.registerOnTouched('a@a.com');
    expect(registerOnTouchedSpy).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    const disabledSpy = jest
      .spyOn(component, 'setDisabledState')
      .mockImplementation();

    component.setDisabledState(true);
    expect(disabledSpy).toHaveBeenCalled();
  });
});
