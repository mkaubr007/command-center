export class EditProfileConstants {
  public static readonly USER_ID = 'test_id';

  public static readonly EDIT_PROFILE_DATA = {
    firstName: 'Test',
    lastName: 'Name',
    email: 'test.name@quovantis.com',
    profilePic:
      'https://cc-users-pic.s3.amazonaws.com/QY6Igea5WyEDq1MsO6eJiE47.jpg',
  };

  public static readonly EDIT_PROFILE_ERROR_RESPONSE = {
    error: 'some error',
    message: 'Failure',
    statusCode: 400,
  };

  public static readonly USER_DATA = {
    createdDate: '1934-10-09T18:30:00.000Z',
    email: 'test.name@quovantis.com',
    lastLogin: '2020-07-14T07:13:23.171Z',
    name: { first: 'Test', last: 'Name' },
    resetPassword: { token: 'token', expires: 1593686432464 },
    role: { id: '5ece482e97a76536f460e738', name: 'test role 2' },
    status: 'active',
    _id: '5e9e9022abfc01673460a39c',
  };

  public static readonly EDIT_PROFILE_RESPONSE = {
    data: EditProfileConstants.USER_DATA,
    message: 'Client created successfully',
    statusCode: 200,
  };

  public static readonly META = {
    profilePic:
      'https://cc-users-pic.s3.amazonaws.com/QY6Igea5WyEDq1MsO6eJiE47.jpg',
    uniqueName: 'dOKKAveWg1U2A73xtwBZrVJq.jpg',
  };

  public static readonly UPDATE_USER_INFO = {
    name: {
      first: 'Juhi shaw',
      last: 'Mahajan',
    },
    meta: {
      profilePic:
        'https://cc-users-pic.s3.amazonaws.com/QY6Igea5WyEDq1MsO6eJiE47.jpg',
      uniqueName: 'dOKKAveWg1U2A73xtwBZrVJq.jpg',
    },
  };
}
