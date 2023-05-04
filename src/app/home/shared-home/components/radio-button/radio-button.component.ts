import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true,
    },
  ],
})
export class RadioButtonComponent implements ControlValueAccessor {
  public value: boolean;
  public disabled: boolean;
  @Input() option: any;
  @Input() name: string;
  @Input() isOptionLabelVisible: boolean;

  constructor() {}

  public onChange: any = () => {};
  public onBlur: any = () => {};

  public getSelectedEnv(event: any): void {
    this.onChange(event.value);
  }

  public writeValue(writeValue: any): void {
    this.value = writeValue;
  }

  public registerOnChange(registerOnChange: any): void {
    this.onChange = registerOnChange;
  }

  public registerOnTouched(registerOnTouch: any): void {
    this.onBlur = registerOnTouch;
  }
  
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
