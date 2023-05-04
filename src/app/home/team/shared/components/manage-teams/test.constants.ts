import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { MessageConstant } from '../../../../../core/constants/message.constant';
import { ManageTeamTable } from '../../../../../shared/enums/manage-team-table.enum';
import { OrderBy, SortBy, Sorting } from '../../../../../shared/enums/sorting.enum';
import { TeamsUrlTab } from '../../../../../shared/enums/teams-tab.enum';
import { IClientServiceRep } from '../../../../../shared/models/client-service-rep/client-service-rep';
import { IPaginator } from '../../../../../shared/models/paginator/paginator.interface';
import { ISorting } from '../../../../../shared/models/sorting/sorting.interface';
import {
  IMemberList,
  ITeamMember
} from '../../../../../shared/models/team-member/team-member';
import { TeamMemberResponse } from '../../../../../shared/models/team-member/team-member.model';

export class ManageTeam {
  public static readonly GET_TEAM_MEMEBER_LIST = [
    {
      createdBy: {
        id: '5e956594d4ddea41e4242f22',
        name: ' Test center',
      },
      email: 'asdf@sdfas.ddsdfas',
      meta: {
        profilePic:
          'https://cc-users-pic.s3.amazonaws.com/mfTAfhsMyj6Jp5bMQUDp2pMV.png',
        uniqueName: 'mfTAfhsMyj6Jp5bMQUDp2pMV.png',
      },
      name: {
        first: 'test',
        last: 'testing',
      },
      role: {
        id: '5ece5076eace747e9c3bbdd0',
        name: 'test role 4',
      },
    },
  ];

  public static readonly GET_TEAM_MEMEBER_RESPONSE = {
    data: {
      count: 40,
      result: [
        {
          createdBy: {
            id: '5e956594d4ddea41e4242f22',
            name: ' Test center',
          },
          email: 'asdf@sdfas.ddsdfas',
          meta: {
            profilePic:
              'https://cc-users-pic.s3.amazonaws.com/mfTAfhsMyj6Jp5bMQUDp2pMV.png',
            uniqueName: 'mfTAfhsMyj6Jp5bMQUDp2pMV.png',
          },
          name: {
            first: 'test',
            last: 'testing',
          },
          role: {
            id: '5ece5076eace747e9c3bbdd0',
            name: 'test role 4',
          },
        },
      ],
    },
    message: 'Success',
    statusCode: 200,
  };

  public static readonly GET_TEAM_MEMBER_SUCCESS_RESPONSE = {
    data: {
      count: 40,
      result: [
        {
          createdBy: {
            id: '5e956594d4ddea41e4242f22',
            name: ' Test center',
          },
          email: 'asdf@sdfas.ddsdfas',
          meta: {
            profilePic:
              'https://cc-users-pic.s3.amazonaws.com/mfTAfhsMyj6Jp5bMQUDp2pMV.png',
            uniqueName: 'mfTAfhsMyj6Jp5bMQUDp2pMV.png',
          },
          name: {
            first: 'test',
            last: 'testing',
          },
          role: {
            id: '5ece5076eace747e9c3bbdd0',
            name: 'test role 4',
          },
        },
      ],
    },
    message: 'Success',
    statusCode: 201,
  };

  public static readonly GET_TEAM_MEMBER_FAILURE_RESPONSE = {
    data: {},
    message: 'Success',
    statusCode: 201,
  };

  public static readonly teamMemberData: ITeamMember[] = [
    {
      name: { first: 'abc', last: 'xyz' },
      email: 'abc@gmail.com',
      createdBy: { id: '1', name: 'xyz' },
      role: { id: '1', name: 'xyz' },
      meta: { profilePic: 'abc', uniqueName: 'abc' },
    },
  ];

  public static readonly teamMemberDataResponse: TeamMemberResponse = {
    result: [
      {
        name: { first: 'abc', last: 'xyz' },
        email: 'abc@gmail.com',
        createdBy: { id: '1', name: 'xyz' },
        role: { id: '1', name: 'xyz' },
        meta: { profilePic: 'abc', uniqueName: 'abc' },
      },
    ],
    count: 1,
  };
  public static readonly assigneeList: IClientServiceRep[] = [
{
  _id: '1',
  name: { first: 'abc', last: 'xyz' },
  meta: { profilePic: 'abc', uniqueName: 'abc', description: 'desc' },
  }
];
  public static readonly individualMemberData: IMemberList[] = [
    {
      email: 'a@a.com',
      id: '5ef5eecd0d9dbc235c4a90eb',
      profilePic: null,
      role: 'test role 3',
      teamMember: 'juhi shaw',
      assignedOn: [
        'LA Care Health Plan',
        'LA Care Health Plan',
        'LA Care Health Plan',
        'LA Care Health Plan',
        'LA Care Health Plan',
        'LA Care Health Plan',
      ],
    },
  ];

  public static readonly messageData = {
    width: '440px',
    disableClose: true,
    scrollStrategy: new NoopScrollStrategy(),
    data: {
      title: MessageConstant.ADD_NEW_TEAM_MEMBERS,
      btnTxt: MessageConstant.SAVE,
      btnSubTxt: MessageConstant.CANCEL,
      component: TeamsUrlTab.TEAMS,
      isDisabled: false,
    },
  };

  public static readonly editMessageData = {
    width: '440px',
    disableClose: true,
    scrollStrategy: new NoopScrollStrategy(),
    data: {
      title: MessageConstant.EDIT_TEAM_MEMBER,
      btnTxt: MessageConstant.UPDATE,
      btnSubTxt: MessageConstant.CANCEL,
      component: TeamsUrlTab.TEAMS,
      isDisabled: true,
      memberData: ManageTeam.teamMemberData[0],
    },
  };

  public static readonly MEMBER_DATA_ERROR_RESPONSE = {
    data: ManageTeam.teamMemberData,
    message: 'Failure',
    statusCode: 400,
  };

  public static readonly ErrorsTableHeader: ISorting[] = [
    {
      active: ManageTeamTable.TEAM_MEMBER,
      direction: Sorting.ASC,
    },
    {
      active: ManageTeamTable.TEAM_MEMBER,
      direction: Sorting.DESC,
    },
    {
      active: ManageTeamTable.EMAIL,
      direction: Sorting.ASC,
    },
    {
      active: ManageTeamTable.EMAIL,
      direction: Sorting.DESC,
    },
    {
      active: ManageTeamTable.ROLE,
      direction: Sorting.ASC,
    },
    {
      active: ManageTeamTable.ROLE,
      direction: Sorting.DESC,
    },
  ];

  public static readonly PAGINATOR: IPaginator = {
    length: 20,
    pageIndex: 2,
    pageSize: 10,
    previousPageIndex: 1,
  };

  public static readonly DELETE_TEAM_MEMBER = {
    data: {
      createdBy: {
        id: '5e956594d4ddea41e4242f22',
        name: ' Test center',
      },
      email: 'asdf@sdfas.ddsdfas',
      meta: {
        profilePic:
          'https://cc-users-pic.s3.amazonaws.com/mfTAfhsMyj6Jp5bMQUDp2pMV.png',
        uniqueName: 'mfTAfhsMyj6Jp5bMQUDp2pMV.png',
      },
      name: {
        first: 'test',
        last: 'testing',
      },
      role: {
        id: '5ece5076eace747e9c3bbdd0',
        name: 'test role 4',
      },
    },
    message: 'Success',
    statusCode: 200,
  };

  public static readonly DELETE_TEAM_MEMBER_ERROR = {
    data: {
      createdBy: {
        id: '5e956594d4ddea41e4242f22',
        name: ' Test center',
      },
      email: 'asdf@sdfas.ddsdfas',
      meta: {
        profilePic:
          'https://cc-users-pic.s3.amazonaws.com/mfTAfhsMyj6Jp5bMQUDp2pMV.png',
        uniqueName: 'mfTAfhsMyj6Jp5bMQUDp2pMV.png',
      },
      name: {
        first: 'test',
        last: 'testing',
      },
      role: {
        id: '5ece5076eace747e9c3bbdd0',
        name: 'test role 4',
      },
    },
    message: 'Failure',
    statusCode: 400,
  };

  public static readonly INDIVIDUAL_MEMBER: IMemberList = {
    email: 'a@a.com',
    id: '5ef5eecd0d9dbc235c4a90eb',
    profilePic: null,
    role: 'test role 3',
    teamMember: 'juhi shaw',
    assignedOn: [
      'LA Care Health Plan',
      'LA Care Health Plan',
      'LA Care Health Plan',
      'LA Care Health Plan',
      'LA Care Health Plan',
      'LA Care Health Plan',
    ],
  };

  public static readonly SEARCH_PARAM_DATA = {
  match: {
    searchInput: ''
  },
  skip: 1,
  limit: 10,
  sort: { [SortBy.TEAM_MEMBER]: OrderBy.ASC }
  };
}
