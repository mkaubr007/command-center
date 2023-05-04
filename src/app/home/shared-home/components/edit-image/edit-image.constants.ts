import { CssConstant } from '../../../../core/constants/css.constant';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { MessageConstant } from '../../../../core/constants/message.constant';
import { ImageCroppedEvent, Dimensions } from 'ngx-image-cropper';

export class EditImage {
  public static readonly ERROR = {
    data: 'Some message',
    message: 'Failure',
    statusCode: 400,
  };

  public static readonly DELETE_POPUP = {
    width: CssConstant.POPUP_WIDTH,
    disableClose: true,
    scrollStrategy: new NoopScrollStrategy(),
    data: {
      title: MessageConstant.DELETE_PHOTO,
      subTitle: MessageConstant.DELETE_PHOTO_MSG,
      btnTxt: MessageConstant.DELETE,
      btnSubTxt: MessageConstant.CANCEL,
    },
  };

  public static readonly EDIT_IMAGE_POPUP_DATA = {
    title: MessageConstant.DELETE_PHOTO,
    subTitle: MessageConstant.DELETE_PHOTO,
    btnTxt: MessageConstant.DELETE,
    btnSubTxt: MessageConstant.CANCEL,
    data: new FileReader(),
  };

  public static readonly EVENT_WITH_DATA: Object = {
    target: {
      files: [
        {
          File: {
            name: '2c3e6e46d9502f417bf1b8db2d6e9159.jpg',
            size: 29648,
            type: 'image/jpeg',
          },
          length: 1,
        },
      ],
    },
  };

  public static readonly IMAGE_CROPPED_EVENT: ImageCroppedEvent = {
    base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAA',
    cropperPosition: { x1: 43, y1: 0, x2: 193, y2: 150 },
    height: 256,
    imagePosition: { x1: 81, y1: 0, x2: 363, y2: 282 },
    width: 256,
  };

  public static readonly SOURCE_DIMENSIONS: Dimensions = {
    height: 300,
    width: 300,
  };
}
