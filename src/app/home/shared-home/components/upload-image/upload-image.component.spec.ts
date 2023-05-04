import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadImageComponent } from './upload-image.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedService } from '../../../../shared/shared.service';
import { of, throwError } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditImageComponent } from '../edit-image/edit-image.component';
import { UploadImage } from './upload-image.constants';

describe('UploadImageComponent', () => {
  let component: UploadImageComponent;
  let fixture: ComponentFixture<UploadImageComponent>;

  class MatDialogMock {
    open() {
      return {
        afterClosed: () =>
          of({
            data: new Blob(),
            picture: UploadImage.IMAGE_DATA_ON_CLOSE.picture,
          }),
      };
    }
  }

  const dialogMock = { close: (value = '') => {}, open: (value = '') => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MaterialModule],
      declarations: [UploadImageComponent],
      providers: [
        SharedService,
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: MatDialogRef, useValue: dialogMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadImageComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the open edit image popup if file is present', () => {
    jest
      .spyOn(component, 'openCropImagePopup')
      .mockImplementation(() => throwError(UploadImage.ERROR));

    jest.spyOn(component, 'uploadFile');

    component.uploadFile(UploadImage.EVENT_WITH_DATA);

    expect(component.uploadFile).toHaveBeenCalledWith(
      UploadImage.EVENT_WITH_DATA
    );

    expect(component.openCropImagePopup).toHaveBeenCalledWith(
      UploadImage.EVENT_WITH_DATA
    );
  });

  it('should open edit image popup', () => {
    jest.spyOn(TestBed.inject(MatDialog), 'open');

    const openCropImagePopupSpy = jest.spyOn(component, 'openCropImagePopup');

    component.openCropImagePopup(UploadImage.EVENT_WITH_DATA);

    expect(component._dialog.open).toHaveBeenCalledWith(
      EditImageComponent,
      UploadImage.CROP_IMAGE_POPUP_DATA
    );
    expect(openCropImagePopupSpy).toHaveBeenCalled();
  });

  it('should emit formData when popup is closed and has image', () => {
    component.imageName = '';
    jest.spyOn(component, 'openCropImagePopup');
    jest.spyOn(component.imageFile, 'emit').mockImplementation();

    const formData = new FormData();
    formData.append(
      'file',
      new Blob(),
      UploadImage.EVENT_WITH_DATA['target'].files[0].name
    );

    component.openCropImagePopup(UploadImage.EVENT_WITH_DATA);

    expect(component.imageName).toEqual(
      UploadImage.IMAGE_DATA_ON_CLOSE.picture
    );
    expect(component.imageFile.emit).toHaveBeenCalledWith(formData);
  });

  it('should get input value', () => {
    jest.spyOn(component, 'onChange').mockImplementation();
    jest.spyOn(component, 'getInputValue');

    component.getInputValue(UploadImage.DUMMY_IMG);

    expect(component.getInputValue).toHaveBeenCalledWith(UploadImage.DUMMY_IMG);
    expect(component.onChange).toHaveBeenCalledWith(UploadImage.DUMMY_IMG);
  });

  it('should write value', () => {
    jest.spyOn(component, 'writeValue');
    component.imageName = UploadImage.DUMMY_IMG;

    component.writeValue(UploadImage.DUMMY_IMG);

    expect(component.writeValue).toHaveBeenCalledWith(UploadImage.DUMMY_IMG);
    expect(component.imageName).toEqual(UploadImage.DUMMY_IMG);
  });

  it('should register on change', () => {
    jest.spyOn(component, 'registerOnChange');
    // jest.spyOn(component, 'onChange');
    component.imageName = UploadImage.DUMMY_IMG;

    component.registerOnChange(UploadImage.DUMMY_IMG);

    expect(component.registerOnChange).toHaveBeenCalledWith(
      UploadImage.DUMMY_IMG
    );
    expect(component.onChange).toEqual(UploadImage.DUMMY_IMG);
  });

  it('should register on touch', () => {
    jest.spyOn(component, 'registerOnTouched');
    component.onBlur = UploadImage.DUMMY_IMG;

    component.registerOnTouched(UploadImage.DUMMY_IMG);

    expect(component.registerOnTouched).toHaveBeenCalledWith(
      UploadImage.DUMMY_IMG
    );
    expect(component.onBlur).toEqual(UploadImage.DUMMY_IMG);
  });

  it('should disable the state', () => {
    jest.spyOn(component, 'setDisabledState');
    component.disabled = false;

    component.setDisabledState(false);

    expect(component.setDisabledState).toHaveBeenCalledWith(false);
    expect(component.disabled).toEqual(false);
  });
});
