import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  forwardRef, Output, EventEmitter,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchFieldComponent),
      multi: true,
    },
  ],
})
export class SearchFieldComponent implements OnInit, ControlValueAccessor {
  public searchValue: string;
  public disabled: boolean;
  @Input() placeholder: string;
  @Output() cleared: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  public onChange: any = () => {};
  public onBlur: any = () => {};

  ngOnInit(): void {}

  public getSearchInputValue(value: string): void {
    this.onChange(value);
  }

  public writeValue(writeValue: string): void {
    this.searchValue = writeValue;
  }
  public registerOnChange(registerOnChange: string): void {
    this.onChange = registerOnChange;
  }
  public registerOnTouched(registerOnTouch  : string): void {
    this.onBlur = registerOnTouch ;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  public onClear(): void {
    this.searchValue = '';
    this.cleared.emit(this.searchValue);
  }
  public onKeyPress(event: KeyboardEvent): boolean {
    return !(this.searchValue === '' && event.key === ' ');
  }
  public onPaste(event: ClipboardEvent): boolean {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text').trim();
    return !!pastedText;
  }
}
