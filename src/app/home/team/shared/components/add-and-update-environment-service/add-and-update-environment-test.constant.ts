import { ServiceHealth } from '../../../../../shared/enums/service-health.enum';
import { IClient, IService, IEnvironments, IServiceResponse, IClientResponse } from '../../../../../shared/models/client-service-rep/client-service-rep';

export class AddAndUpdateEnvTest {

    public static testClient: IClient = {
        _id: '5e9fed13af2cd928ec601bb4',
        status: 'active',
        name: 'Client 1',
        createdBy: {
            id: '5e9e9022abfc01673460a39c',
            name: 'akumar@gmail.com'
        },
        createdDate: new Date('2020-04-22T07:06:59.720Z'),
        serviceRepresentative: {
            id: '5e9e9022abfc01673460a39c',
            name: 'akumar@gmail.com'
        },
        supportPersons: [
            {
                id: '5e9e9022abfc01673460a39c',
                name: 'akumar@gmail.com'
            }
        ],
        environments: [
            {
                _id: '5f0ef3580e2ff61aa9953350',
                services: [
                    {
                        status: 'Healthy',
                        _id: '5f0ef3580e2ff61aa9953351',
                        id: '5f0d4850be905ffa68fd1edb',
                        name: 'OCR service'
                    },
                    {
                        status: 'Healthy',
                        _id: '5f0ef3580e2ff61aa9953352',
                        id: '5f0d5073793cc926ecd37e30',
                        name: 'Image processing service'
                    }
                ],
                name: 'Development',
                isPrioritized: true,
                status: 'active'
            },
            {
                _id: '5f0ef3900e2ff61aa9953355',
                status: 'active',
                services: [
                    {
                        status: 'Healthy',
                        _id: '5f0ef3900e2ff61aa9953356',
                        id: '5f0d4850be905ffa68fd1edb',
                        name: 'OCR service'
                    },
                    {
                        status: 'Healthy',
                        _id: '5f0ef3900e2ff61aa9953357',
                        id: '5f0d5073793cc926ecd37e30',
                        name: 'Image processing service'
                    },
                    {
                        status: 'Healthy',
                        _id: '5f0ef3900e2ff61aa9953358',
                        id: '5f0ef3900e2ff61aa9953354',
                        name: 'Test Service 2'
                    },
                    {
                        status: 'Healthy',
                        _id: '5f0ef3e50e2ff61aa9953361',
                        id: '5f0ef3e50e2ff61aa9953359',
                        name: 'Test Service 3'
                    },
                    {
                        id: '1',
                        name: 'OCR service',
                        checkInTimeInterval: {
                            unit: '',
                            time: null,
                        }
                    }
                ],
                name: 'QA',
                isPrioritized: true
            }
        ]
    };

    public static servicesList: IService[] = [
        {
            _id: '5f0d4850be905ffa68fd1edb',
            name: 'OCR service',
            createdBy: {
                id: '5e9e9022abfc01673460a39c',
                name: 'Vikash Gaurav'
            },
            createdDate: new Date('2020-01-09T18:30:00.000Z')
        },
        {
            _id: '5f0d5073793cc926ecd37e30',
            name: 'Image processing service',
            createdBy: {
                id: '5e9e9022abfc01673460a39c',
                name: 'Vikash Gaurav'
            },
            createdDate: new Date('2020-01-09T18:30:00.000Z')
        }
    ];

    public static newEnvironmentData: IEnvironments = {
        services: [
            {
                status: 'Healthy',
                _id: '5f0ef3580e2ff61aa9953351',
                id: '5f0d4850be905ffa68fd1edb',
                name: 'OCR service'
            },
            {
                status: 'Healthy',
                _id: '5f0ef3580e2ff61aa9953352',
                id: '5f0d5073793cc926ecd37e30',
                name: 'Image processing service'
            }
        ],
        name: 'Development',
        status: 'active',
        isPrioritized: true
    };

    public static newServiceData: IService = {
        _id: '1',
        name: 'OCR service',
        createdBy: {
            id: '5e9e9022abfc01673460a39c',
            name: 'Vikash Gaurav'
        },
        createdDate: new Date('2020-01-09T18:30:00.000Z')
    };

    public static serviceResponse: IServiceResponse = {
        data: AddAndUpdateEnvTest.newServiceData,
        message: 'Success',
        statusCode: 201,
    };

    public static EnvResponse: IClientResponse = {
        data: AddAndUpdateEnvTest.testClient,
        message: 'Success',
        statusCode: 201
    };

    public static readonly ERROR_RESPONSE = {
        error: 'something went wrong',
        message: 'Failure',
        statusCode: 400,
    };

    public static readonly NEW_SERVICE = {
        id: AddAndUpdateEnvTest.newServiceData._id,
        name: AddAndUpdateEnvTest.newServiceData.name,
        checkInTimeInterval: {
            unit: '',
            time: null,
        },
        status: ServiceHealth.NOT_SET
    };
}
