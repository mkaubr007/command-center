import { IUser } from './../shared/models/auth/auth';
import { of } from 'rxjs'

export class MockAuthService {
    onLogin(): any {
      return of(true);
    }

    resetPassword(): any {
      return of(true);
    }

    loginUser():any {
      return of(true);
    }

    getUserData(): IUser {
      return {
        "name": {
          "first": "Dhruv",
          "last": "Sethi"
        },
        "meta": {
          "profilePic": "https://cc-users-pic.s3.amazonaws.com/E1km9HpOxeh6FfClTo2U48bl.jpg"
        },
        "_id": "5f6c9d766a57271c30cfcf75"
      } as IUser;
    }
  }