import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { LocalStorageConstants } from '../../../../core/constants/local-storage.constants';
import { AssigneeDropdownCacheService } from '../../../../services/assignee-dropdown-service/assignee-dropdown.cache.service';
import { TeamMemberStatus } from '../../../../shared/enums/teams-tab.enum';
import { IClientServiceRep } from '../../../../shared/models/client-service-rep/client-service-rep';

@Component({
  selector: 'app-assignee-dropdown',
  templateUrl: './assignee-dropdown.component.html',
  styleUrls: ['./assignee-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssigneeDropdownComponent implements OnInit {
  public assignedOptions = [];
  public imageUrl = '../../../../../assets/images/no-img-user.svg';

  @Input() disabled?: boolean;
  @Input() bindLabel?: string;
  @Input() bindValue?: string;
  @Input() selection?: string;
  @Input() element?: any;
  @Input() placeholder = 'Assign';
  @Input('dropdownPosition') dropdownPosition?= 'bottom';
  @Input('appendTo') appendTo?= 'body';

  @Output()
  selectionChange: EventEmitter<IClientServiceRep> = new EventEmitter<IClientServiceRep>();
  public teamMemberStatus = TeamMemberStatus;

  constructor(
    private assigneeDropdownCacheService: AssigneeDropdownCacheService
  ) { }

  ngOnInit(): void {
    this.getAssignee();
    this.assigneeDropdownCacheService.assigneeSubject.subscribe((data) => {
      if (data) {
        this.assignedOptions = data;
      }
    });
    this.setAssigneeStatusInactive();
  }

  private getAssignee(): void {
    const assignees = JSON.parse(
      localStorage.getItem(LocalStorageConstants.ASSIGNEES)
    );
    if (assignees) {
      this.assignedOptions = assignees;
    }
    if (!this.assigneeDropdownCacheService.assigneeHitAgain) {
      this.assigneeDropdownCacheService.setAssigneesToCacheAgain();
    }
  }

  private setAssigneeStatusInactive() {

    if (this.element.assignedTo && !this.assignedOptions.map(activeAssignee => activeAssignee.id).includes(this.element.assignedTo.id)) {
      this.element.assignedTo.status = TeamMemberStatus.INACTIVE;
    }
  }

  public onChange(event): void {
    this.selectionChange.emit(event);
  }
}
