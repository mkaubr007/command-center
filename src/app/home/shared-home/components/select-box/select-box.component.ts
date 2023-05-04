import {
  Component,
  Input,
  ChangeDetectionStrategy,
  forwardRef,
  ViewChild,
  EventEmitter,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectBoxComponent),
      multi: true,
    },
  ],
})
export class SelectBoxComponent implements ControlValueAccessor {
  @Input() disabled: boolean;
  @Input() selection: any;
  @Input() data: any[];
  @Input() placeholder: string;
  @Input() labelKey: string;
  @Input() bindKey: string;
  @Input() displayLarge?: boolean;
  @Input() multiple?: boolean;
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();

  @ViewChild(PerfectScrollbarDirective, { static: false })
  directiveRef?: PerfectScrollbarDirective;

  constructor() {}

  public onChange: any = () => {};

  public onBlur: any = () => {};

  public onTouched: () => void;

  public getFirstValue(): string {
    if (this.selection?.length) {
      if (this.labelKey) {
        return this.selection[0][this.labelKey];
      } else {
        return this.selection[0];
      }
    } else {
      return '';
    }
  }

  public onSelection(value: any): void {
    if (value) {
      this.onChange(value);
      this.selectionChange.emit(value);
    }
  }

  public writeValue(value: string) {
    this.selection = value;
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
