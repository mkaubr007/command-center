import { RoleConstants } from "../core/constants/role.constant";
import { TeamsUrlTab } from "../shared/enums/teams-tab.enum";

export class AuthConstants {

  public static readonly USER_ID = '1';
  public static readonly FIRST_NAME = 'Dwight';
  public static readonly LAST_NAME = 'Schrute';
  public static readonly PROFILE_PIC = 'sample.png';
  public static readonly USER_EMAIL = 'schrutefarms@dundermifflin.com';
  public static readonly USER_LOGIN_DETAILS = {
    email: AuthConstants.USER_EMAIL,
    password: '12345'
  };
  public static readonly USER_DATA = {
    name: {
      first: AuthConstants.FIRST_NAME,
      last: AuthConstants.LAST_NAME,
    },
    meta: {
      profilePic: AuthConstants.PROFILE_PIC,
    },
    _id: AuthConstants.USER_ID
  };
  public static readonly RESET_PASSWORD_PARAMS = {
    hash : '123',
    userId : AuthConstants.USER_ID,
    password : '123@sDFG'
  };
  public static readonly RESET_PASSWORD_RESPONSE = {
    data : {
      email : AuthConstants.USER_EMAIL,
      redirectURL : 'www.google.com',
      passwordToken : '1234'
    }, 
    message: 'Password reset successfully',
    status : 200 ,
    userId: AuthConstants.USER_ID
  };

  public static readonly AUTH_TOKEN_NEW_USER = {
    access_token: '123',
    token_type: 'new',
    user: {
      email : AuthConstants.USER_EMAIL,
      password: AuthConstants.RESET_PASSWORD_PARAMS.password,
      role: {
        id: '1',
        name: RoleConstants.CLIENT_SERVICE_REPRESENTATIVE
      },
      token : '1234',
      histories: [],
      name: AuthConstants.USER_DATA.name,
      createdDate: new Date().toDateString(),
      specialities: [],
      status: 'active',
      _id: '12345'
    }
  };

  public static readonly AUTH_TOKEN_OLD_USER = {
    access_token: '123',
    token_type: 'new',
    user: {
      email : AuthConstants.USER_EMAIL,
      password: AuthConstants.RESET_PASSWORD_PARAMS.password,
      role: {
        id: '1',
        name: RoleConstants.CLIENT_SERVICE_REPRESENTATIVE
      },
      token : '1234',
      histories: [],
      name: AuthConstants.USER_DATA.name,
      createdDate: new Date().toDateString(),
      specialities: [],
      status: 'active',
      _id: '12345',
      lastlogin: 'Fri Jan 29 2021',
      meta: {
        profilePic: AuthConstants.PROFILE_PIC,
      },
    }
  };

  public static readonly NEW_USER_LOGIN_RESPONSE = {
    message : 'Success',
    data : AuthConstants.AUTH_TOKEN_NEW_USER,
    statusCode : 200
  };

  public static readonly OLD_USER_LOGIN_RESPONSE = {
    message : 'Success',
    data : AuthConstants.AUTH_TOKEN_OLD_USER,
    statusCode : 200
  }

  public static readonly LOGIN_ERROR_RESPONSE = {
    error : 'Fail',
    message : 'Failed attempt at login',
    class : '1',
    statusCode : 400,
    status : 400,
  };

  public static readonly ERROR = {
    error: 'Failure',
    message: 'Invalid Link!',
    statusCode: 400,
  };

  public static readonly FORGOT_PASSWORD_RESET_DATA = {
    data: { email: 'a@a' },
    message: 'Success',
    status: 200,
  };

  public static readonly FORGOT_PASSWORD_ERROR_RESPONSE = {
    message: 'Failure',
    status: 504,
    userId: '1',
  };

  public static readonly RETRY_ERROR = {
    error: 'Failure',
    message: 'Retry again',
    statusCode: 400,
  };

  public static readonly ACCESS_DENIED_FRAGMENT = 'access_denied';

  public static readonly INVALID_ROUTE_ERROR = {
    error: 'Failure',
    message: 'You are not authorized to see this page!',
    statusCode: 400,
  };

  public static readonly LOGIN_RESPONSE = {
    message: 'Success',
    status: 200,
    data: {
      user: {
        _id: '1',
      }
    }
  };

  public static readonly NAGIVATION_OPTIONS = {
    queryParams: {
      _tab: TeamsUrlTab.TEAMS,
    }
  };
}
