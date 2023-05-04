import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Input,
  forwardRef,
} from '@angular/core';
import { EditImageComponent } from '../edit-image/edit-image.component';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CssConstant } from '../../../../core/constants/css.constant';
import { MessageConstant } from '../../../../core/constants/message.constant';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadImageComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadImageComponent implements ControlValueAccessor {
  public imageUrl: string = '../../../../../assets/images/no-img-user.svg';
  @ViewChild('fileInput') el: ElementRef;
  @Input() disabled: boolean;
  @Input() imageName: string;
  @Output() imageFile = new EventEmitter();

  constructor(private cd: ChangeDetectorRef, public _dialog: MatDialog) {}

  public onChange: any = () => {};
  public onBlur: any = () => {};

  public uploadFile(event: Object): void {
    if (event['target'].files.length) {
      this.openCropImagePopup(event);
    }
  }

  public openCropImagePopup(uploadedImageData: Object): void {
    const dialogRef = this._dialog.open(EditImageComponent, {
      width: CssConstant.CROP_POPUP_WIDTH,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.CROP_PHOTO,
        subTitle: MessageConstant.CROP_PHOTO_SUB,
        btnTxt: MessageConstant.CHANGE_PHOTO,
        btnSubTxt: MessageConstant.APPLY,
        helperTxt: MessageConstant.HELPER_PHOTO_MSG,
        data: uploadedImageData,
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((event: { picture: string; data: string | Blob }) => {
        if (event) {
          this.imageName = event['picture'];

          const formData = new FormData();
          formData.append(
            'file',
            event['data'],
            uploadedImageData['target'].files[0].name
          );
          this.imageFile.emit(formData);

          // ChangeDetectorRef since file is loading outside the zone
          this.cd.markForCheck();
        }
      });
  }

  public getInputValue(value: string): void {
    this.onChange(value);
  }

  public writeValue(writeValue: string): void {
    this.imageName = writeValue;
  }
  public registerOnChange(registerOnChange: string): void {
    this.onChange = registerOnChange;
  }
  public registerOnTouched(registerOnTouch: string): void {
    this.onBlur = registerOnTouch;
  }
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
