import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() disabled?: boolean;
  @Input() label?: any;
  @Input() profilePic?: string;
  @Input() image?: boolean;
  @Input() fullName?: string;

  @Input() checkedStatus?: boolean;
  @Input() indeterminate?: boolean;

  public dummyProfilePic = '../../../../../assets/images/no-img-user.svg';

  @Output() selection: EventEmitter<any> = new EventEmitter();

  constructor() { }

  public onChange: any = () => { };

  public onBlur: any = () => { };

  public getCheckedValue(checkedStatus: MatCheckboxChange): void {
    this.onChange(checkedStatus.source.checked);
    this.selection.emit(checkedStatus.checked);
  }

  public writeValue(writeValue: boolean): void {
    this.checkedStatus = writeValue;
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
