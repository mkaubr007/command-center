import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true,
    },
  ],
})
export class InputFieldComponent implements ControlValueAccessor {
  public inputValue: string;
  public disabled: boolean;
  @Input('type') type: string;
  @Input('placeholder') placeholder: string;
  @Output('inputChange') inputChange: EventEmitter<string> = new EventEmitter();

  constructor(
    private cd: ChangeDetectorRef) {
  }

  public onChange: any = () => {};
  public onBlur: any = () => {};

  public getInputValue(value: string): void {
    this.onChange(value);
    this.inputChange.emit(value);
  }

  public writeValue(writeValue: string): void {
    this.inputValue = writeValue;
    this.cd.detectChanges();
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
