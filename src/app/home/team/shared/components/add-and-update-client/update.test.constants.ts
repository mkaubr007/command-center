export class UpdateClientConstants {
    public static readonly SEARCH_TEAM_MEMBERS = [
        {
            _id: '5ece482e97a76536f460e738',
            name: {
                first: 'test first',
                last: 'test last'
            }
        }
    ];

    public static readonly SEARCH_TEAM_MEMBERS_NAME = "test first test last";

    public static readonly ADD_CLIENT_DATA = {
        name: 'test data',
        email: null,
        serviceRepresentative: { id: '5ece482e97a76536f460e739', name: 'test name' },
    }

    public static readonly CLIENT_RESPONSE_DATA = {
        _id: '5ece482e97a76536f460e539',
        name: 'test data',
        createdBy: {
            id: 1,
            name: 'test test'
        },
        serviceRepresentative: { id: '5ece482e97a76536f460e739', name: 'test name' },
    }

    public static readonly CREATE_CLIENT_RESPONSE = {
        data: UpdateClientConstants.CLIENT_RESPONSE_DATA,
        message: 'Client created successfully',
        statusCode: 200
    }

    public static readonly CREATE_CLIENT_ERROR_RESPONSE = {
        error: 'some error',
        message: 'Failure',
        statusCode: 400,
      };
}