export class PasswordValidatorConstants {
    public static readonly PASSWORD = 'Abxuy.werto@1';
    public static readonly INCORRECT_PASSWORD = 'TEST';
    public static readonly USER_ID = '1';
    public static readonly MINIMUM_PASSWORD_LENGTH = 10;
    public static readonly MAXIMUM_PASSWORD_LENGTH = 128;
    public static readonly SUCCESS = {
        message: 'Success',
        statusCode: 200
    };
    public static readonly FAILURE = {
        message: 'Success',
        statusCode: 400
    }
    public static readonly PARAMS = {
        currentPassword: PasswordValidatorConstants.PASSWORD,
        newPassword: PasswordValidatorConstants.PASSWORD,
        userId: PasswordValidatorConstants.USER_ID,
    }
}