import { Component, OnInit, forwardRef, Input, Injector } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';

@Component({
  selector: 'app-email-field',
  templateUrl: './email-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmailFieldComponent),
      multi: true,
    },
  ],
})
export class EmailFieldComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string;
  
  public email: string;
  public emailControl: NgControl;
  public disabled: boolean;

  constructor(private _injector: Injector) {}

  public onTouched: any = () => {};

  ngOnInit(): void {
    this.emailControl = this._injector.get(NgControl);
  }

  public onChange(email: string): void {
    this.email = email;
  }

  public writeValue(value: string): void {
    this.email = value ? value : '';
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
