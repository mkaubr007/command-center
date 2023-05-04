export class AddTeamConstants {
  public static readonly CREATED_BY_ROLES = {
    id: 'test id',
    name: 'test name',
    createdBy: {
      id: 'test createdBy id',
      name: 'test admin 2',
    },
    rights: [],
  };

  public static readonly MEMBER_ROLES = [
    {
      name: 'test role 2',
      _id: '123',
      id: '123',
      createdBy: {
        id: 'test createdBy Id',
        name: 'test admin 2',
      },
      createdDate: new Date(1592540839722),
      rights: [],
    }
  ];

  public static readonly PROFILE_DATA = {
    name: 'dummy-man-570x570.png',
    uniqueName: 'mfTAfhsMyj6Jp5bMQUDp2pMV.png',
    url: 'https://cc-users-pic.s3.amazonaws.com/mfTAfhsMyj6Jp5bMQUDp2pMV.png',
  };

  public static readonly ADD_TEAM_MEMBER_DATA = {
    name: {
      first: 'test',
      last: 'testing',
    },
    email: 'a@a.com',
    meta: {
      profilePic:
        'https://cc-users-pic.s3.amazonaws.com/mfTAfhsMyj6Jp5bMQUDp2pMV.png',
      uniqueName: 'mfTAfhsMyj6Jp5bMQUDp2pMV.png',
    },
    createdBy: AddTeamConstants.CREATED_BY_ROLES,
    role: AddTeamConstants.CREATED_BY_ROLES,
  };

  public static readonly SELECT_MEMBER_ROLE = {
    _id: '5ece482e97a76536f460e738',
    name: 'test role 2',
  };

  public static readonly ADD_TEAM_MEMBER_SUCCESS_RESPONSE = {
    data: AddTeamConstants.ADD_TEAM_MEMBER_DATA,
    message: 'Success',
    statusCode: 201,
  };

  public static readonly ADD_TEAM_MEMBER_ERROR_RESPONSE = {
    error: 'some error',
    message: 'Failure',
    statusCode: 400,
  };

  public static readonly UPLOAD_PROFILE_SUCCESS_RESPONSE = {
    data: AddTeamConstants.PROFILE_DATA,
    message: 'Success',
    statusCode: 201,
  };

  public static readonly POPUP_DATA_RESPONSE = {
    title: 'title',
    subTitle: 'subtitle',
    btnTxt: 'click me',
    btnSubTxt: 'hover on me',
    component: 'app-component',
    isDisabled: false,
    data: {},
  };

  public static readonly UPLOAD_PROFILE_ERROR_RESPONSE = {
    data: AddTeamConstants.PROFILE_DATA,
    message: 'Failure',
    statusCode: 400,
  };
}
