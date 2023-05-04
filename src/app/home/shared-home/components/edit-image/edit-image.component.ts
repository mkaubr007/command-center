import { Component, OnInit, Injector } from '@angular/core';
import { Popup } from '../../../../shared/models/popup/popup.model';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import {
  ImageCroppedEvent,
  base64ToFile,
  Dimensions,
  ImageTransform,
} from 'ngx-image-cropper';
import { ICroppedImage } from '../../../../shared/models/image/cropped-image.interface';
import { DeleteComponent } from '../delete/delete.component';
import { CssConstant } from '../../../../core/constants/css.constant';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { MessageConstant } from '../../../../core/constants/message.constant';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss'],
})
export class EditImageComponent implements OnInit {
  public dialogRef = null;
  public data: Popup;
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  public canvasRotation = 0;
  public rotation = 0;
  public scale = 1;
  public showCropper = false;
  public containWithinAspectRatio = false;
  public transform: ImageTransform = {};
  public croppedImageData: ICroppedImage;
  public messageConstantRef = MessageConstant;

  constructor(private _injector: Injector, public _dialog: MatDialog) {
    this.dialogRef = this._injector.get(MatDialogRef, null);
    this.data = this._injector.get(MAT_DIALOG_DATA, null);
  }

  ngOnInit() {
    this.imageChangedEvent = this.data.data;
  }

  public closePopup(event?: boolean): void {
    if (event) {
      const croppedImageObject = {
        picture: this.croppedImage,
        data: this.croppedImageData,
      };
      this.dialogRef.close(croppedImageObject);
    } else {
      this.dialogRef.close();
    }
  }

  public openDeletePopup(data: FormData): void {
    if (data) {
      this.openDeleteConfirmationPopup();
    }
  }

  public openDeleteConfirmationPopup(): void {
    const dialogRef = this._dialog.open(DeleteComponent, {
      width: CssConstant.POPUP_WIDTH,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.DELETE_PHOTO,
        subTitle: MessageConstant.DELETE_PHOTO_MSG,
        btnTxt: MessageConstant.DELETE,
        btnSubTxt: MessageConstant.CANCEL,
      },
    });
    dialogRef.afterClosed().subscribe((event: boolean) => {
      if (event) {
        this.dialogRef.close();
      }
    });
  }

  public uploadFile(event: Object): void {
    if (event['target'].files.length) {
      this.imageChangedEvent = event;
    }
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
    this.croppedImageData = base64ToFile(this.croppedImage);
  }

  public imageLoaded(data: FormData): void {
    this.showCropper = true;
  }

  public cropperReady(sourceImageDimensions: Dimensions): void {
    // console.log('Cropper ready', sourceImageDimensions);
  }

  public loadImageFailed(): void {
    // console.log('Load failed');
  }

  private rotateLeft(): void {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  private rotateRight(): void {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate(): void {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  private flipHorizontal(): void {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  private flipVertical(): void {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  private resetImage(): void {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  private zoomOut(): void {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  private zoomIn(): void {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  private toggleContainWithinAspectRatio(): void {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  private updateRotation(): void {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }
}
