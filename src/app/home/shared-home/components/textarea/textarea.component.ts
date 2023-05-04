import {
  Component,EventEmitter,
  forwardRef, Input,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})

export class TextareaComponent implements ControlValueAccessor {
  public textareaValue: string;
  public disabled: boolean;
  @Input('type') type: string;
  @Input('placeholder') placeholder: string;
  @Output('textareaChange') textareaChange: EventEmitter<string> = new EventEmitter();

  constructor() {}

  public onChange: any = () => {};
  public onBlur: any = () => {};

  public getTextareaValue(value: string): void {
    this.onChange(value);
    this.textareaChange.emit(value);
  }

  public writeValue(writeValue: string): void {
    this.textareaValue = writeValue;
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
