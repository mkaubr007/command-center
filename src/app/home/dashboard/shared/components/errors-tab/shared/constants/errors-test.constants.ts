import { IErrorDetailResponse, IErrorDetailResponseData } from '../../../../../../../shared/models/error-detail/error-detail.interface';
import { ISorting } from '../../../../../../../shared/models/sorting/sorting.interface';
import { OrderBy, Sorting } from '../../../../../../../shared/enums/sorting.enum';
import { ErrorsTableHeader } from '../../../../../../../shared/enums/error-tab.enum';
import { CssConstant } from 'src/app/core/constants/css.constant';
import { MessageConstant } from 'src/app/core/constants/message.constant';
import { SortBy } from '../enum/errors.enum';
import { HomeDropdownConstants } from '../../../../../../shared-home/components/home-dropdown/home-dropdown.constants';

export class NewErrorsList {

  public static readonly ERROR_DETAIL_RESPONSE: IErrorDetailResponseData = {
    result: [
      {
        date: new Date('2020-04-20T07:45:31.551Z'),
        _id: '5e9d5714a9d8db39785b723a',
        errorType: 'New Error',
        errorMessage: 'These are Error Details',
        priority: { name: 'test', icon: 'test' },
        assignedTo: {
          id: '5f294e44fa02c32730e2bd40',
          name: 'test team  three'
        },
        status: 'In progress',
        jiraTicketId: '5ea13f96e2e42475513c141c',
        serviceName: 'New Service',
        environment: 'command',
        trace: 'string',
        clientName: 'LA Care'
      },
      {
        date: new Date('2020-04-21T06:47:58.698Z'),
        _id: '5e9e972558ba403818d1acc1',
        trace: 'Test Trace2',
        serviceName: 'test service',
        environment: 'claris',
        errorType: 'New Error',
        errorMessage: 'These are Error Details',
        clientName: 'LA Care',
        assignedTo: {
          id: '5ef04a9b84ad1e3ad451f681',
          name: 'Kanishka Sikka'
        }
      }
    ],
    count: 2,
    page: 2
  };

  public static readonly ERROR_DETAIL_UPDATE_RESPONSE: IErrorDetailResponse = {
    data: {
      date: new Date('2020-04-21T06:47:58.698Z'),
      _id: '5e9e972558ba403818d1acc1',
      trace: 'Test Trace2',
      serviceName: 'test service',
      environment: 'claris',
      errorType: 'New Error',
      errorTimestamps: [],
      errorMessage: 'These are Error Details',
      clientName: 'LA Care',
      assignedTo: {
        id: '5ef04a9b84ad1e3ad451f681',
        name: 'Kanishka Sikka'
      },
      status: 'In Progress'
    },
    message: 'Success',
    statusCode: 200
  };

  public static readonly ERROR_DETAIL_ERROR_RESPONSE = {
    data: NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE,
    message: 'Failure',
    statusCode: 400,
  };

  public static readonly ERROR_PERMISSION_FAIL_RESPONSE = {
    data: {
      permissions: {
        CREATE_ISSUES: {
          havePermission: false
        }
      }
    },
    message: 'Success',
    statusCode: 200,
  };

  public static readonly ERROR_PERMISSION_SUCCESS_RESPONSE = {
    data: {
      permissions: {
        CREATE_ISSUES: {
          havePermission: true
        }
      }
    },
    message: 'Success',
    statusCode: 200,
  };

  public static readonly JIRA_MANUAL_ERROR_STATE = {
    tab: 'unresolved-manual-errors',
    page: 2,
    limit: 2,
    errorId: '5e9d5714a9d8db39785b723a'
  };

  public static readonly JIRA_NEW_ERROR_STATE = {
    tab: 'new-errors',
    page: 2,
    limit: 2,
    errorId: '5e9d5714a9d8db39785b723a'
  };

  public static readonly STATUS_CHANGE_PARAMS = { status: 'CSR Action' };

  public static readonly STATUS = 'CSR Action';

  public static readonly LOCAL_STORAGE_CONSTANTS = {
    user_id: 'testID',
    role: 'Admin'
  };

  public static readonly CREATE_JIRA_POPUP_DATA = {
    width: CssConstant.CREATE_JIRA_TICKET_POPUP_WIDTH,
    disableClose: true,
    data: {
      title: MessageConstant.CREATE_JIRA,
      btnTxt: MessageConstant.CREATE,
      btnSubTxt: MessageConstant.CANCEL,
      isDisabled: true,
      data: { _id: 123 },
    }
  };

  public static readonly GET_STATUS_PARAMS = {
    match: { type: 'manual' }
  };

  public static readonly GET_STATUS_SUCCESS_RESPONSE = {
    'data': [
      {
        '_id': '5f3284e974de6b1744f05541',
        'name': 'Pending',
        'description': 'This is a new error',
        'type': 'manual'
      },
      {
        '_id': '5f3284e974de6b1744f05542',
        'name': 'In Progress',
        'description': 'Support is working on the error',
        'type': 'manual'
      },
      {
        '_id': '5f3284e974de6b1744f05543',
        'name': 'CSR Action',
        'description': 'A CSR must take action on the error, but it is otherwise resolved',
        'type': 'manual'
      }
    ],
    'message': 'Success',
    'statusCode': 200
  };

  public static readonly ON_STATUS_CHANGE_FAILURE_RESPONSE = {
    error: 'Fail',
    message: 'First assign the error to a team member, then change status.',
    statusCode: 412,
  }

  public static readonly GET_STATUS_FAILURE_RESPONSE = {
    data: NewErrorsList.GET_STATUS_SUCCESS_RESPONSE.data[0],
    message: 'Failure',
    statusCode: 400
  };

  public static readonly ERROR_DETAIL_SORTING: ISorting[] = [
    {
      active: ErrorsTableHeader.ERROR_TYPE,
      direction: Sorting.ASC,
    },
    {
      active: ErrorsTableHeader.ERROR_TYPE,
      direction: Sorting.DESC,
    },
    {
      active: ErrorsTableHeader.SERVICE,
      direction: Sorting.ASC,
    },
    {
      active: ErrorsTableHeader.SERVICE,
      direction: Sorting.DESC,
    },
    {
      active: ErrorsTableHeader.GENERATED_ON,
      direction: Sorting.ASC,
    },
    {
      active: ErrorsTableHeader.GENERATED_ON,
      direction: Sorting.DESC,
    },
    {
      active: ErrorsTableHeader.STATUS,
      direction: Sorting.ASC,
    },
    {
      active: ErrorsTableHeader.STATUS,
      direction: Sorting.DESC,
    },
  ];

  public static readonly GET_ERROR_PARAMS = {
    sort_by: 'date',
    order_by: -1,
    limit: 6,
    page: 2,
    match: { status: { $in: ['Pending'] } },
    searchBy: 'Error Type',
    errorKey: 'ALL'
  };

  public static readonly PAGINATOR_TEXT = MessageConstant.UNRESOLVED_MANUAL;

  public static readonly SEARCH_PARAM_RESULT = {
    sortBy: SortBy.GENERATED_ON, orderBy: OrderBy.DESC,
    limit: 6, page: 2, match: { status: { $in: ['Pending'] } },
    searchBy: NewErrorsList.GET_ERROR_PARAMS.searchBy
  };

  public static readonly LIST_DATA = [{ name : 'Mongo Error', selected : true}, { name : 'Connection Error'}];
  public static readonly SELECTED_FILTER = ['Mongo Error', 'Connection Error'];
  public static readonly SELECTED_KEY = 'name';
  public static readonly USER_ID = '12345';
  public static readonly FILTER_SELECTION =   { name: [{ name: 'test' }],status:[],assignee:[] };
  public static readonly FILTER_LIST_DATA = { type: [{ name: 'test' }] };

  public static readonly DASHBOARD_PARAMS_INPUT = {
    clientNames: [HomeDropdownConstants.DEFAULT_SELECTED_CLIENTS[0].name] as string[],
    environments: HomeDropdownConstants.ALL_ENVIRONMENTS.map(env => env.name),
    services: HomeDropdownConstants.DEFAULT_SELECTED_SERVICES.map(service => service.name)
  };

  public static readonly DISTINCT_CLIENTS = [{ _id: 1, name: 'test1' }, { _id: 2, name: 'test2' }];
  public static readonly DISTINCT_ENVIRONMENTS = ['env1','env2','env3'];
  public static readonly DISTINCT_SERVICES = ['service1','service2','service3'];

  public static readonly DASHBOARD_PARAMS_OUTPUT = {
    clientName: {
      $in: [
        "client1",
        "client2",
      ],
    },
    environment: {
      $in: [],
    },
    serviceName: {
      $in: [
        "service1",
        "service2",
      ],
    },
  };
  public static readonly USER = {
    name: {
      first: 'Vikash',
      last: 'Gaurav',
    },
    meta: {
      profilePic: 'https://cc-users-pic.s3.amazonaws.com/5WFTshejNeLjQ5sQdDtDPhLg.jpg',
    }
  };

  public static readonly TAB_ADJUSTMENTS_ALL_ERROR_TAB_PENDING_STATUS = {
    "unresolved-manual-errors": -0,
    "new-errors": 0,
  };

  public static readonly TAB_ADJUSTMENTS_NEW_ERROR_TAB_PENDING_STATUS = {
    "new-errors": 0,
  }

  public static readonly TAB_ADJUSTMENTS_RESOLVED_ERROR_TAB_RESOLVED_STATUS = {
    "resolved-errors": 0,
  };

  public static readonly TAB_ADJUSTMENTS_ALL_ERROR_TAB_RESOLVED_STATUS = {
    "resolved-errors": 0,
  };

  public static readonly TAB_ADJUSTMENTS_RESOLVED_ERROR_TAB_JIRA_TICKET_CREATED_STATUS = {
    "resolved-errors": -0,
    "unresolved-jira-errors": 0,
  };

  public static readonly TAB_ADJUSTMENTS_ALL_ERROR_TAB_JIRA_TICKET_CREATED_STATUS = {
    "unresolved-jira-errors": 0,
  };
}
