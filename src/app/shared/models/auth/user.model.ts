export class User {
  email: string;
  password: string;
  token: string;

  constructor(data?: { email: string; password: string; token: string }) {
    this.email = data ? data.email : null;
    this.password = data ? data.password : null;
    this.token = data ? data.token : null;
  }
}

export class ForgotOrResetPassword {
  email: string;
  passwordToken: string;

  constructor(data?: { email: string; passwordToken: string }) {
    this.email = data ? data.email : null;
    this.passwordToken = data ? data.passwordToken : null;
  }
}

export class UserLogin {
  email: string;
  password: any;

  constructor(data?: { email: string; password: any }) {
    this.email = data ? data.email : null;
    this.password = data ? data.password : null;
  }
}

export class MemberList {
  teamMember: string;
  email: string;
  role: string;
  assignedOn: string[];
}
