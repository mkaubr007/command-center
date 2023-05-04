import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
  ],
})
export class ToggleComponent implements OnInit, ControlValueAccessor {
  public value: boolean;
  public disabled: boolean;
  @Input() label: string;
  @Input() name: string;
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  public onChange: any = () => {};

  public onBlur: any = () => {};

  ngOnInit(): void {}

  public onSelection(event: boolean): void {
    this.onChange(event);
    this.valueChange.emit(event);
  }

  public writeValue(writeValue: boolean): void {
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
