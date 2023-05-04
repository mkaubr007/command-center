export class PaginatorConstant {
  public static readonly KEYPRESS_EVENT = {
    which: 57,
    shiftKey: false,
  };

  public static readonly KEYPRESS_EVENT_ENTER = {
    which: 13,
    shiftKey: false,
    code: 'Enter',
  };

  public static readonly EVENT_CODE = 'Enter';

  public static readonly FOCUSOUT_CODE = 'focusout';

  public static readonly KEYPRESS_EVENT_NON_NUMERIC = {
    which: 44,
    shiftKey: false,
  };

  public static readonly PASTED_EVENT = {
    clipboardData: {
      getData: function (type) {
        return '123';
      },
    },
  };
}
