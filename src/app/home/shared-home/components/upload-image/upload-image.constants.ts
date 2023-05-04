import { CssConstant } from '../../../../core/constants/css.constant';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { MessageConstant } from '../../../../core/constants/message.constant';

export class UploadImage {
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

  public static readonly CROP_IMAGE_POPUP_DATA = {
    width: CssConstant.CROP_POPUP_WIDTH,
    disableClose: true,
    scrollStrategy: new NoopScrollStrategy(),
    data: {
      title: MessageConstant.CROP_PHOTO,
      subTitle: MessageConstant.CROP_PHOTO_SUB,
      btnTxt: MessageConstant.CHANGE_PHOTO,
      btnSubTxt: MessageConstant.APPLY,
      helperTxt: MessageConstant.HELPER_PHOTO_MSG,
      data: UploadImage.EVENT_WITH_DATA,
    },
  };

  public static readonly ERROR = {
    data: 'Some message',
    message: 'Failure',
    statusCode: 400,
  };

  public static readonly DUMMY_IMG: string =
    '../../../../../assets/images/no-img-user.svg';

  public static readonly IMAGE_DATA_ON_CLOSE = {
    data: {
      size: 39730,
      type: 'image/png',
    },
    picture: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAA',
  };
}
