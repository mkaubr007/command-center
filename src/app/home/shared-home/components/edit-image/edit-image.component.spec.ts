import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { base64ToFile, ImageCropperModule } from 'ngx-image-cropper';
import { of } from 'rxjs';
import { MaterialModule } from '../../../../material/material.module';
import { SharedService } from '../../../../shared/shared.service';
import { DeleteComponent } from '../delete/delete.component';
import { EditImageComponent } from './edit-image.component';
import { EditImage } from './edit-image.constants';


describe('EditImageComponent', () => {
  let component: EditImageComponent;
  let fixture: ComponentFixture<EditImageComponent>;

  class MatDialogMock {
    open() {
      return {
        afterClosed: () => of({ data: 'returned data' }),
      };
    }
    close() {
      return {};
    }
  }

  const dialogMock = { close: (value = '') => {}, open: (value = '') => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditImageComponent],
      imports: [
        MaterialModule,
        ImageCropperModule,
        BrowserAnimationsModule,
        CommonModule,
      ],
      providers: [
        SharedService,
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: MatDialogRef, useValue: dialogMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditImageComponent);
    component = fixture.debugElement.componentInstance;
    const data: any = {
      data: EditImage.EDIT_IMAGE_POPUP_DATA.data,
    };
    component.data = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open delete popup on false value', () => {
    const closePopup = jest.spyOn(component['dialogRef'], 'close');
    jest.spyOn(component, 'closePopup');

    component.closePopup();

    expect(component.closePopup).toHaveBeenCalled();
    expect(closePopup).toHaveBeenCalled();
  });

  it('should open delete image popup', () => {
    jest.spyOn(TestBed.inject(MatDialog), 'open');

    const openDeleteConfirmationPopupSpy = jest.spyOn(
      component,
      'openDeleteConfirmationPopup'
    );

    component.openDeleteConfirmationPopup();

    expect(component._dialog.open).toHaveBeenCalledWith(
      DeleteComponent,
      EditImage.DELETE_POPUP
    );
    expect(openDeleteConfirmationPopupSpy).toHaveBeenCalled();
  });

  it('should close popup on true value', () => {
    const closePopup = jest.spyOn(component['dialogRef'], 'close');
    component.openDeleteConfirmationPopup();
    expect(closePopup).toHaveBeenCalled();
  });

  it('should upload file', () => {
    jest.spyOn(component, 'uploadFile');
    
    component.uploadFile(EditImage.EVENT_WITH_DATA);
    component.imageChangedEvent = EditImage.EVENT_WITH_DATA;

    expect(component.uploadFile).toHaveBeenCalled();
  });

  it('should crop the image and convert to base 64', () => {
    jest.spyOn(component, 'imageCropped');

    component.croppedImage = EditImage.IMAGE_CROPPED_EVENT.base64;
    component.croppedImageData = base64ToFile(component.croppedImage);

    component.imageCropped(EditImage.IMAGE_CROPPED_EVENT);

    expect(component.imageCropped).toHaveBeenCalledWith(
      EditImage.IMAGE_CROPPED_EVENT
    );
  });

  it('should show the loaded image', () => {
    jest.spyOn(component, 'imageLoaded');

    component.showCropper = true;
    const formData = new FormData();

    component.imageLoaded(formData);

    expect(component.imageLoaded).toHaveBeenCalledWith(formData);
    expect(component.showCropper).toEqual(true);
  });

  it('should show the cropper', () => {
    jest.spyOn(component, 'cropperReady');

    component.cropperReady(EditImage.SOURCE_DIMENSIONS);

    expect(component.cropperReady).toHaveBeenCalledWith(
      EditImage.SOURCE_DIMENSIONS
    );
  });

  it('should console log that the loaded image failed', () => {
    jest.spyOn(component, 'loadImageFailed');

    component.loadImageFailed();

    expect(component.loadImageFailed).toHaveBeenCalled();
  });

  it('should open delete popup', () => {
    jest.spyOn(component, 'openDeletePopup');
    jest.spyOn(component, 'openDeleteConfirmationPopup').mockImplementation();
    const formData = new FormData();

    component.openDeletePopup(formData);

    expect(component.openDeletePopup).toHaveBeenCalledWith(formData);
  });
});
