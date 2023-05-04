import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { CssConstant } from '../../../../../core/constants/css.constant';
import { MessageConstant } from '../../../../../core/constants/message.constant';
import { TeamsUrlTab } from '../../../../../shared/enums/teams-tab.enum';
import {
  IClientsResponse,
  IClientResponseData,
  IClientEnvResponse,
} from '../../../../../shared/models/client-service-rep/client-service-rep';
import { ApiResponse } from '../../../../../shared/models/util/api-response';
import { IArrFieldUpdate } from '../../../../../shared/models/util/arrfieldupdate.interface';

export class ManageClient {

  public static readonly DEACTIVATE_CLIENT = {
    "status": "active",
    "_id": "5f7fe269b3cb9700119fd4d6",
    "name": "test",
    "serviceRepresentative": {
      "id": "5f294de0fa02c32730e2bd3e",
      "name": "test team one"
    },
    "createdBy": {
      "id": "5e9e9022abfc01673460a39c",
      "name": "Vikash Gaurav"
    },
    "supportPersons": [],
    "environments": [
      {
        "isPrioritized": false,
        "name": "env 1",
        "status": "active",
        "services": [],
        "_id": "1"
      }
    ],
    "histories": [],
    "__v": 0,
    "isEnvPrioritized": []
  };

  public static readonly DELETE_CLIENT_MSG_DATA = {
    width: '440px',
    disableClose: true,
    scrollStrategy: new NoopScrollStrategy(),
    data: {
      title: MessageConstant.DEACTIVATE_CLIENT,
      subTitle: MessageConstant.DELETE_CLIENT_TXT,
      btnTxt: MessageConstant.DEACTIVATE,
      btnSubTxt: MessageConstant.CANCEL,
    },
  };

  public static readonly DELETE_ENV_MSG_DATA = {
    width: '440px',
    disableClose: true,
    scrollStrategy: new NoopScrollStrategy(),
    data: {
      title: MessageConstant.DELETE_ENVIRONMENT,
      subTitle: MessageConstant.DELETE_ENVIRONMENT_TXT,
      btnTxt: MessageConstant.DELETE,
      btnSubTxt: MessageConstant.CANCEL,
    },
  };

  public static readonly ADD_CLIENT_MSG_DATA = {
    width: '440px',
    disableClose: true,
    scrollStrategy: new NoopScrollStrategy(),
    data: {
      title: MessageConstant.ADD_NEW_CLIENT,
      btnTxt: MessageConstant.SAVE,
      btnSubTxt: MessageConstant.CANCEL,
      component: TeamsUrlTab.CLIENT,
    },
  };

  public static readonly CLIENT = {
    "_id" : "5feab1311f11d1001202eb80",
    "status" : "active",
    "name" : "testclient1",
    "serviceRepresentative" : {
      "id" : "5fc765a0da18b500129fdc6c",
      "name" : "test test"
    },
    "createdBy" : {
      "id" : "5f6c9d766a57271c30cfcf75",
      "name" : "Dhruv Sethi"
    },
    "supportPersons" : [ ],
    "environments" : [
      {
        "status" : "active",
        "_id" : "5feab1601f11d1001202eb81",
        "isPrioritized" : true,
        "services" : [
          {
            "status" : "Not Set",
            "_id" : "5fead8cf69873f20a889a59a",
            "id" : "5f19593f8f1b6c4e10cc8548",
            "name" : "Bulk processing"
          },
          {
            "status" : "Not Set",
            "_id" : "5fead8cf69873f20a889a59b",
            "id" : "5fead89d69873f20a889a55b",
            "name" : "testservice14",
            "checkInTimeInterval" : {
              "time" : 540,
              "unit" : "Hours"
            }
          }
        ],
        "name" : "envtest1"
      }
    ],
    "histories" : [ ],
    "__v" : 0
  }

  public static readonly EDIT_ENV_SERVICE_MSG_DATA = {
    width: CssConstant.ADD_SERVICE_ENV_POPUP_WIDTH,
    disableClose: true,
    scrollStrategy: new NoopScrollStrategy(),
    data: {
      title: MessageConstant.ADD_OR_UPDATE,
      btnTxt: MessageConstant.UPDATE,
      btnSubTxt: MessageConstant.CANCEL,
      component: TeamsUrlTab.CLIENT,
      isDisabled: false,
      client: ManageClient.DEACTIVATE_CLIENT,
      environment: ManageClient.DEACTIVATE_CLIENT.environments[0],
      services: []
    },
  };

  public static readonly CLIENT_RESPONSE: IClientsResponse = {
    data: {
      count: 71,
      result: [
        {
          _id: '5e9fe41eaf2cd928ec601bb2',
          status: 'active',
          supportPersons: [
            {
              id: '5e9e9022abfc01673460a39c',
              name: 'akumar@gmail.com',
            },
          ],
          name: 'Rahul',
          createdBy: {
            id: '5e9e9022abfc01673460a39c',
            name: 'testcommandcenter12@gmail.com',
          },
          serviceRepresentative: {
            id: '5e9e9022abfc01673460a39c',
            name: 'vikash.gaurav@quovantis.com',
          },
          environments: [
            {
              isPrioritized: false,
              status: 'active',
              name: 'command',
              services: [
                {
                  id: '5eb260bf91cb3413a46cdbd3',
                  name: 'New Service',
                  status: 'Healthy',
                  _id: '5eb3d223c78a472f40c162c8',
                },
              ],
            },
          ],
        },
      ],
    },
    message: 'Success',
    statusCode: 200,
  };

  public static readonly CLIENT_DATA_RESPONSE: IClientResponseData = {
    count: 71,
    result: [
      {
        _id: '5e9fe41eaf2cd928ec601bb2',
        status: 'active',
        supportPersons: [
          {
            id: '5e9e9022abfc01673460a39c',
            name: 'akumar@gmail.com',
          },
        ],
        name: 'Rahul',
        createdBy: {
          id: '5e9e9022abfc01673460a39c',
          name: 'testcommandcenter12@gmail.com',
        },
        serviceRepresentative: {
          id: '5e9e9022abfc01673460a39c',
          name: 'vikash.gaurav@quovantis.com',
        },
        environments: [
          {
            isPrioritized: false,
            status: 'active',
            name: 'command',
            services: [
              {
                id: '5eb260bf91cb3413a46cdbd3',
                name: 'New Service',
                status: 'Healthy',
                _id: '5eb3d223c78a472f40c162c8',
              },
            ],
          },
        ],
      },
    ],
  };

  public static readonly CLIENT_DATA_RESPONSE_SAME_SERVICE_REPRESENTATIVE: IClientResponseData = {
    count: 71,
    result: [
      {
        _id: '5e9fe41eaf2cd928ec601bb2',
        status: 'active',
        supportPersons: [
          {
            id: '5e9e9022abfc01673460a39c',
            name: 'akumar@gmail.com',
          },
        ],
        name: 'Rahul',
        createdBy: {
          id: '5e9e9022abfc01673460a39c',
          name: 'testcommandcenter12@gmail.com',
        },
        serviceRepresentative: {
          id: '5e944ed15aed5b1b722f6b83',
          name: 'vikash.gaurav@quovantis.com',
        },
        environments: [
          {
            isPrioritized: false,
            status: 'active',
            name: 'command',
            services: [
              {
                id: '5eb260bf91cb3413a46cdbd3',
                name: 'New Service',
                status: 'Healthy',
                _id: '5eb3d223c78a472f40c162c8',
              },
            ],
          },
        ],
      },
    ],
  };

  public static readonly ASSIGNEES = '[{"name": "aman Kumar","imageUrl": "../../../../../../assets/images/no-img-user.svg","id": "5e944ed15aed5b1b722f6b83"}]';

  public static readonly UNRESOLVED_ERROR_AND_CSR_COUNT = {
    errorCount: 1,
    csrCount: 1
  };
  public static readonly UPDATE_ENV_PARAMS: IArrFieldUpdate = {
    id: "1",
    arrField: "environments",
    keyToUpdate: "isPrioritized",
    value: true,
    elementKey: "_id"
  };

  public static readonly UPDATE_ENV_SUCCESS: IClientEnvResponse = {
    data: true,
    message: "Success",
    statusCode: 200
  }

  public static readonly UPDATE_ENV_SUCCESS_RESPONSE: ApiResponse<IClientEnvResponse> = {
    data: ManageClient.UPDATE_ENV_SUCCESS,
    message: "Success",
    statusCode: 200
  }

  public static readonly ADD_ENV_SERVICE_MSG_DATA = {
    width: CssConstant.ADD_SERVICE_ENV_POPUP_WIDTH,
    disableClose: true,
    scrollStrategy: new NoopScrollStrategy(),
    data: {
      title: MessageConstant.ADD_NEW_ENVIRONMENT,
      btnTxt: MessageConstant.ADD,
      btnSubTxt: MessageConstant.CANCEL,
      component: TeamsUrlTab.CLIENT,
      isDisabled: false,
      client: ManageClient.CLIENT_DATA_RESPONSE.result[0],
      services: []
    },
  };

  public static readonly CLIENT_ERROR_RESPONSE = {
    error: 'Failure',
    message: 'Failure',
    statusCode: 400,
  };

  public static readonly DEACTIVATED_CLIENT_RESPONSE = {
    "message": "Success",
    "statusCode": 200,
    "data": ManageClient.DEACTIVATE_CLIENT
  };

  public static readonly UPDATE_CLIENT_LISTING_PARAMS = {
    clients: "5f7fe269b3cb9700119fd4d6",
    environments: ["env 1"],
    services: []
  };

  public static readonly CLIENT_LISTING_PARAMS_UPDATED_ENV = {
    clients: "",
    environments: ["envtest1"],
    services: ["Bulk processing", "testservice14"]
  };

  public static readonly CLIENT_LISTING_PARAMS_UPDATED_SERVICE = {
    clients: "",
    environments: [],
    services: ["Bulk processing"]
  };

  public static readonly SERVICES = [
    {
      "createdBy": {
        "id": "5e9e9022abfc01673460a39c",
        "name": "Vikash Gaurav"
      },
      "_id": "5f19593f8f1b6c4e10cc8548",
      "name": "OCR service",
      "createdDate": new Date("2020-01-09T18:30:00.000Z"),
    },
    {
      "createdBy": {
        "id": "5e9e9022abfc01673460a39c",
        "name": "Vikash Gaurav"
      },
      "_id": "5f0d5073793cc926ecd37e30",
      "name": "Image processing service",
      "createdDate": new Date("2020-01-09T18:30:00.000Z"),
    },
    {
      "createdBy": {
        "id": "5e9e9022abfc01673460a39c",
        "name": "Vikash Gaurav"
      },
      "_id": "5fead8cf69873f20a889a59b",
      "name": "Bulk processing",
      "createdDate": new Date("2020-07-17T08:58:08.832Z"),
    }
  ];

  public static readonly SERVICE_TO_ADD = ['testservice14'];

  public static readonly SERVICE_TO_REMOVE = ['OCR service','Image processing service'];

  public static readonly SERVICE_FOR_SOCKET = ManageClient.SERVICES[0];

  public static readonly OBJECT_FOR_SOCKET = {
    clients: "",
    environments: [],
    services: [ManageClient.SERVICE_FOR_SOCKET.name]
  }

  public static readonly UPDATED_ENVIRONMENTS = [
    {
      name: "envtest1",
      isPrioritized: false,
      status: "active",
      services: [
      ],
      _id: "5feab1601f11d1001202eb81",
    },
  ]
}
