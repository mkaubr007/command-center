import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeamMemberStatus, TeamsUrlTab } from '../../../../../shared/enums/teams-tab.enum';
import { MatTableDataSource } from '@angular/material/table';
import { TeamService } from '../../../team.service';
import { AddAndUpdateTeamComponent } from '../add-and-update-team/add-and-update-team.component';
import {
  IMemberList,
  ITeamMember,
  IAddTeamMember,
} from '../../../../../shared/models/team-member/team-member';
import { ManageTeamTable } from '../../../../../shared/enums/manage-team-table.enum';
import { SharedService } from '../../../../../shared/shared.service';
import { IErrorResponse } from '../../../../../shared/models/error/error.interface';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import {
  TeamMemberResponse,
  TeamMember,
} from '../../../../../shared/models/team-member/team-member.model';
import { IPaginator } from '../../../../../shared/models/paginator/paginator.interface';
import { MessageConstant } from '../../../../../core/constants/message.constant';
import {
  Sorting,
  SortBy,
  OrderBy,
} from '../../../../../shared/enums/sorting.enum';
import { ISorting } from '../../../../../shared/models/sorting/sorting.interface';
import { DeleteComponent } from '../../../../shared-home/components/delete/delete.component';
import { SetWalkthroughVisible } from '../../../../../shared/models/walkthrough/walkthrough.model';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';
import { CssConstant } from '../../../../../core/constants/css.constant'
import { RouteConstants } from '../../../../../core/constants/route.constants';
import { SocketService } from '../../../../shared-home/services/socket/socket.service';
import { ErrorService } from '../../../../dashboard/shared/components/errors-tab/error.service';

@Component({
  selector: 'app-manage-teams',
  templateUrl: './manage-teams.component.html',
  styleUrls: ['./manage-teams.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageTeamsComponent implements OnInit, OnDestroy {
  public isDataLoading = true;
  public imageUrl = RouteConstants.NO_USER_IMAGE_PATH;

  public memberList: IMemberList[];
  public teamMembersData: ITeamMember[];

  public limit: number;
  public defaultPageLimit = 10;
  public totalLength = 0;
  public messageConstants = MessageConstant;
  public sortingOrder: { sortBy: string; orderBy: number };
  public currentPage = 1;
  public isSortingApplied: string = ManageTeamTable.TEAM_MEMBER;
  public defaultSortingOrder: string = Sorting.ASC;
  public manageTeamTableRef = ManageTeamTable;
  public sortingOrderRef = Sorting;
  public displayedColumns: string[] = [
    ManageTeamTable.TEAM_MEMBER,
    ManageTeamTable.EMAIL,
    ManageTeamTable.ROLE,
    ManageTeamTable.ASSIGNED_ON,
    ManageTeamTable.ACTION,
  ];

  //TODO --> To be taken from API
  public assignedOn = [
    'LA Care Health Plan',
    'LA Care Health Plan',
    'LA Care Health Plan',
    'LA Care Health Plan',
    'LA Care Health Plan',
    'LA Care Health Plan',
  ];

  public dataSource: MatTableDataSource<ITeamMember> = new MatTableDataSource<
    ITeamMember
  >();

  public searchInput = '';
  public title: string;
  public subTitle: string;
  public noSearchResults = false;
  public searchParams: any;

  @Output() walkthroughData: EventEmitter<
    SetWalkthroughVisible
  > = new EventEmitter();
  @Output() memberLength: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(PerfectScrollbarDirective, { static: false })
  directiveRef?: PerfectScrollbarDirective;
  private inputSubscription: Subscription

  constructor(
    public _dialog: MatDialog,
    private _teamService: TeamService,
    private _cd: ChangeDetectorRef,
    private _sharedService: SharedService,
    private _socketService: SocketService,
    private _errorService: ErrorService
  ) { }

  ngOnInit(): void {
    this.isDataLoading = true;
    this.createTeamMemberList();
    this.searchMember();
  }

  ngOnDestroy() {
    if(this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }

  public searchMember(): void {
    this.inputSubscription = this._teamService.getInputValue().subscribe((value) => {
      this.noSearchResults = true;
      this.searchInput = value;
      this.createTeamMemberList();
    });
  }

  public setCountAndTeamMember({ result, count }: TeamMemberResponse) {
    this.noSearchResults = count === 0;
    this.setTeamMemberData(result, count);
    this._sharedService.stopBlockUI();
  }

  public initSearchParams(): void {
    this.searchParams = {
      match: {
        searchInput: this.searchInput,
      },
      skip: this.currentPage,
      limit: this.defaultPageLimit,
      sort: { [SortBy.TEAM_MEMBER]: OrderBy.ASC },
    };
  }

  public createTeamMemberList(): void {
    this.initSearchParams();
    this.teamMembersData = [];
    this._teamService
      .searchByTeamMemberUserNameOrEmail(this.searchParams)
      .subscribe(
        ({ result, count }: TeamMemberResponse) => {
          this.setTeamMemberData(result, count);
          this.noSearchResults = false;
          this._sharedService.stopBlockUI();
        },
        (error: IErrorResponse) => {
          this.handleError(error);
        }
      );
  }

  public sortColumn(event: ISorting): void {
    switch (event.direction) {
      case Sorting.ASC:
        switch (event.active) {
          case ManageTeamTable.TEAM_MEMBER:
            this.isSortingApplied = event.active;
            this.defaultSortingOrder = Sorting.ASC;
            this.sortingOrder = {
              sortBy: SortBy.TEAM_MEMBER,
              orderBy: OrderBy.ASC,
            };
            this.getSortedData(SortBy.TEAM_MEMBER, OrderBy.ASC);
            break;

          case ManageTeamTable.ROLE:
            this.isSortingApplied = event.active;
            this.defaultSortingOrder = Sorting.ASC;
            this.sortingOrder = {
              sortBy: SortBy.ROLE,
              orderBy: OrderBy.ASC,
            };
            this.getSortedData(SortBy.ROLE, OrderBy.ASC);
            break;

          case ManageTeamTable.EMAIL:
            this.isSortingApplied = event.active;
            this.defaultSortingOrder = Sorting.ASC;
            this.sortingOrder = {
              sortBy: SortBy.EMAIL,
              orderBy: OrderBy.ASC,
            };
            this.getSortedData(SortBy.EMAIL, OrderBy.ASC);
            break;
        }
        break;

      case Sorting.DESC:
        switch (event.active) {
          case ManageTeamTable.TEAM_MEMBER:
            this.isSortingApplied = event.active;
            this.defaultSortingOrder = Sorting.DESC;
            this.sortingOrder = {
              sortBy: SortBy.TEAM_MEMBER,
              orderBy: OrderBy.DESC,
            };
            this.getSortedData(SortBy.TEAM_MEMBER, OrderBy.DESC);
            break;

          case ManageTeamTable.ROLE:
            this.isSortingApplied = event.active;
            this.defaultSortingOrder = Sorting.DESC;
            this.sortingOrder = {
              sortBy: SortBy.ROLE,
              orderBy: OrderBy.DESC,
            };
            this.getSortedData(SortBy.ROLE, OrderBy.DESC);
            break;

          case ManageTeamTable.EMAIL:
            this.isSortingApplied = event.active;
            this.defaultSortingOrder = Sorting.DESC;
            this.sortingOrder = {
              sortBy: SortBy.EMAIL,
              orderBy: OrderBy.DESC,
            };
            this.getSortedData(SortBy.EMAIL, OrderBy.DESC);
            break;
        }
        break;
    }
  }

  public getSortedData(sortValue: string, orderBy: number): void {
    this._sharedService.startBlockUI();
    this.searchParams.sort = { [sortValue]: orderBy };
    this._teamService
      .searchByTeamMemberUserNameOrEmail(this.searchParams)
      .subscribe(
        ({ result, count }: TeamMemberResponse) => {
          this.setTeamMemberData(result, count);
          this._sharedService.stopBlockUI();
        },
        (error: IErrorResponse) => {
          this.handleError(error);
        }
      );
  }

  public changePage(event: IPaginator): void {
    this.currentPage = event.pageIndex + 1;
    this.getPaginatedData(this.defaultPageLimit, this.currentPage);
  }

  public getPaginatedData(limit: number, currentPage: number): void {
    const sortBy = this.sortingOrder?.sortBy
      ? this.sortingOrder?.sortBy
      : SortBy.TEAM_MEMBER;
    const orderBy = this.sortingOrder?.orderBy
      ? this.sortingOrder?.orderBy
      : OrderBy.ASC;
    this._sharedService.startBlockUI();
    this.searchParams.sort = { [sortBy]: orderBy };
    this.searchParams.limit = limit;
    this.searchParams.skip = currentPage;
    this._teamService
      .searchByTeamMemberUserNameOrEmail(this.searchParams)
      .subscribe(
        ({ result, count }: TeamMemberResponse) => {
          this.setCountAndTeamMember({ result, count });
        },
        (error: IErrorResponse) => {
          this.handleError(error);
        }
      );
  }

  public changePageSize(event: number): void {
    this.defaultPageLimit = event;
    this.currentPage = 1;
    this.getPaginatedData(event, this.currentPage);
  }

  public  setTeamMemberData(teamMemberList: TeamMember[], count?: number): void {
    if (teamMemberList) {
      this.teamMembersData = teamMemberList;
      this.totalLength = count;
      this.setWalkthrough();
      this.limit = this.defaultPageLimit;
      this.isDataLoading = false;
      this.dataSource = new MatTableDataSource<ITeamMember>(
        this.teamMembersData
      );
      this._cd.detectChanges();
      this._sharedService.stopBlockUI();
    }
  }

  public setWalkthrough() {
    if (this.totalLength) {
      this.memberLength.emit(true);
    } else {
      this.memberLength.emit(false);
    }
  }

  public getFullName(name: string): string {
    return Object.values(name).join(' ');
  }

  public openPopup(event: boolean): void {
    if (event) {
      this.addTeamMemberPopup();
    }
  }

  public addTeamMemberPopup(): void {
    const dialogRef = this._dialog.open(AddAndUpdateTeamComponent, {
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
    });

    dialogRef.afterClosed().subscribe((event: boolean) => {
      let stepperData: SetWalkthroughVisible;
      if (event) {
        this.teamMembersData = [];
        this.createTeamMemberList();
      }
      if (this.totalLength <= 0) {
        stepperData = {
          stepper: 2,
          isMemberAdded: false,
        };
      } else {
        stepperData = {
          stepper: 2,
          isMemberAdded: true,
        };
      }
      this.walkthroughData.emit(stepperData);
    });
  }

  public openEditMemberPopup(value: IMemberList): void {
    this.teamMembersData.forEach((result) => {
      if (result._id === value._id) {
        this.updateTeamMemberPopup(result);
      }
    });
  }

  public updateTeamMemberPopup(memberData: ITeamMember): void {
    const dialogRef = this._dialog.open(AddAndUpdateTeamComponent, {
      width: '440px',
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.EDIT_TEAM_MEMBER,
        btnTxt: MessageConstant.UPDATE,
        btnSubTxt: MessageConstant.CANCEL,
        component: TeamsUrlTab.TEAMS,
        isDisabled: true,
        memberData,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createTeamMemberList();
      }
    });
  }

  public openDeactivateMemberPopup(name: string, memberId: string, role: string): void {

    let errorMessage = MessageConstant.DEACTIVATE_MEMBER_TXT;

    const isCsrUser = role == MessageConstant.CLIENT_SERVICE_REPRESENTATIVE
    this._errorService.getUnresolvedErrorAndCsrCountForUser(memberId, isCsrUser).subscribe(response => {
      if(response.errorCount!=0){
        if (isCsrUser) {
          errorMessage = MessageConstant.DEACTIVATE_MEMBER_FOR_CSR_USER_TXT.replace("##ERRORCOUNT##", response?.errorCount?.toString()).replace('##CSRCOUNT##', response?.csrCount?.toString());
        } else {
          errorMessage = MessageConstant.DEACTIVATE_MEMBER_FOR_NON_CSR_USER_TXT.replace("##ERRORCOUNT##", response?.errorCount?.toString());
        }
      }
        
      const dialogRef = this._dialog.open(DeleteComponent, {
        width: CssConstant.POPUP_WIDTH,
        disableClose: true,
        scrollStrategy: new NoopScrollStrategy(),
        data: {
          title: MessageConstant.DEACTIVATE_TEAM_MEMBER_HEADER,
          subTitle: errorMessage,
          btnTxt: MessageConstant.DEACTIVATE,
          btnSubTxt: MessageConstant.CANCEL,
        },
      });
      dialogRef.afterClosed().subscribe((event: boolean) => {
        if (event) {
          this.teamMembersData = [];
          this._cd.detectChanges();
          this.deactivateTeamMember(memberId);
        }
      });
    });

  }

  private deactivateTeamMember(id: string): void {
    this._sharedService.startBlockUI();
    const memberData = new TeamMember();
    memberData.status = TeamMemberStatus.INACTIVE
    this._teamService.updateTeamMember(memberData, id).subscribe(
      (response: IAddTeamMember) => {
        this.createTeamMemberList();
        this._sharedService.openSuccessSnackBar(response);
        this._socketService.emitDeactivatedTeamMember();
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  public handleError(error: IErrorResponse): void {
    this.isDataLoading = true;
    this._sharedService.openErrorSnackBar(error);
    this._sharedService.stopBlockUI();
  }

  public onClear(): void {
    this.noSearchResults = false;
    this.searchInput = '';
    this.createTeamMemberList();
  }
}
