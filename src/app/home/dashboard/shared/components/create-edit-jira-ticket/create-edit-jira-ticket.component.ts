import { Component, OnInit, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Popup } from '../../../../../shared/models/popup/popup.model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import Utils from '../../../../shared-home/utils/utils';
import { cloneDeep } from 'lodash';
import { ICreatedByRole } from '../../../../../shared/models/team-member/team-member';
import { SharedService } from '../../../../../shared/shared.service';
import {
  IJiraField,
  IJiraIssueType,
  IJiraUser,
} from '../../../../../shared/models/jira/jira.interface';
import { JiraService } from '../../../../../shared/services/jira.service';
import { MessageConstant } from '../../../../../core/constants/message.constant';
import { StatusCodeConstant } from '../../../../../core/constants/status-code.constant';
import { JiraConstants } from '../../../../../core/constants/jira.constant';
import { RouteConstants } from '../../../../../core/constants/route.constants';

@Component({
  selector: 'app-create-edit-jira-ticket',
  templateUrl: './create-edit-jira-ticket.component.html',
  styleUrls: ['./create-edit-jira-ticket.component.scss'],
})
export class CreateEditJiraTicketComponent implements OnInit {
  public dialogRef = null;
  public popupData: Popup;
  public messageConstantRef = MessageConstant;
  public createJiraForm: FormGroup;
  public project: any;
  public issueTypes: string[] = [];
  public loading = false;
  public currentIssueType: IJiraIssueType;

  public issueTypeData: ICreatedByRole[];
  public priority: ICreatedByRole[];
  public imageUrl = RouteConstants.NO_USER_IMAGE_PATH;
  public assigneeData: IJiraUser[];
  public dynamicFields: IJiraField[] = [];

  constructor(
    private _injector: Injector,
    private _fb: FormBuilder,
    private _jiraService: JiraService,
    private _sharedService: SharedService
  ) {
    this.dialogRef = this._injector.get(MatDialogRef, null);
    this.popupData = this._injector.get(MAT_DIALOG_DATA, null);
    this.initCreateEditJiraTicketForm();
  }

  ngOnInit(): void {
    if (this._jiraService.project && this._jiraService.jiraUsers.length) {
      this.setIssueTypes(this._jiraService.project);
      this.assigneeData = this._jiraService.jiraUsers;
    } else {
      this.getJiraData();
    }
    this.initCreateEditJiraTicketForm(this.popupData);
  }

  public setIssueTypes(data: any) {
    const issues = [];
    this.project = data;

    data.issuetypes.forEach((issuetype) => {
      const issueName = issuetype.name;
      if (!JiraConstants.EXCLUDED_ISSUES.includes(issueName)) {
        issues.push(issuetype);
        this.issueTypes.push(issueName);
      }
    });
    this.project.issuetypes = issues;
  }

  private async getJiraData(): Promise<void> {
    try {
      this.loading = true;
      const [issuetype, jiraUser] = await Promise.all([
        this._jiraService.getIssueTypes().toPromise(),
        this._jiraService.getJiraUsers().toPromise(),
      ]);
      this.cacheJiraData([issuetype, jiraUser]);
      this.setIssueTypes(issuetype['data'].projects[0]);
      this.assigneeData = jiraUser['data'];
    } catch (error) {
      this._sharedService.openErrorSnackBar(error);
    } finally {
      this.loading = false;
    }
  }

  public cacheJiraData([project, jiraUsers]: any[]): void {
    this._jiraService.project = project['data'].projects[0];
    this._jiraService.jiraUsers = jiraUsers['data'];
  }

  public initCreateEditJiraTicketForm(data?: any): void {
    let description = data ? data.data?.errorMessage : '';
    if (data && data.data.trace) {
      description = `${description}
${data.data.trace}`;
    }
    this.createJiraForm = this._fb.group({
      summary: [
        data ? data.data['errorType'] : '',
        [Validators.required, Utils.emptySpaceValidator()],
      ],
      description: [
        description,
        [Validators.required, Utils.emptySpaceValidator()],
      ],
      issuetype: [Validators.required],
      assignee: [null],
      priority: [],
    });
  }

  private createJiraTicketData() {
    const fieldsData = cloneDeep(this.createJiraForm.value);
    let assignee;
    const errorDetail = {
      status: 'To Do',
      resolution: null,
      _id: this.popupData.data._id,
    };

    const description = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              text: this.createJiraForm.get('description').value,
              type: 'text',
            },
          ],
        },
      ],
    };

    fieldsData.description = description;
    fieldsData.project = {
      id: JiraConstants.ETL_PROJECT_ID,
    };

    if (fieldsData.parent) {
      fieldsData.parent = { key: fieldsData.parent };
    }

    if (fieldsData.priority) {
      errorDetail['priority'] = {
        name: fieldsData.priority.name,
        icon: fieldsData.priority.iconUrl,
      };
    } else {
      delete fieldsData.priority;
    }

    if (this.createJiraForm.get('assignee').value) {
      assignee = {
        accountId: this.createJiraForm.get('assignee').value.accountId,
      };

      errorDetail['assignedTo'] = {
        id: this.createJiraForm.get('assignee').value.accountId,
        name: this.createJiraForm.get('assignee').value.displayName,
        avatar: this.createJiraForm.get('assignee').value.avatarUrls['16x16'],
      };
    }

    delete fieldsData.assignee;

    const ticketData = {
      update: {},
      fields: fieldsData,
      assignee,
      errorDetail,
    };

    return ticketData;
  }

  public async closePopup(event: boolean): Promise<void> {
    if (event) {
      if (this.createJiraForm.valid) {
        const ticketData = this.createJiraTicketData();
        this.loading = true;

        this._jiraService.createJiraTicket(ticketData).subscribe(
          (response) => {
            if (response) {
              const message = `${MessageConstant.CREATE_JIRA_SUCCESSFULLY} ${response.data.key}`;
              response.message = message;
              this.loading = false;
              const noOfErrorUpdated = this.popupData.data.errorTimestamps && this.popupData.data.errorTimestamps.length;
              this.dialogRef.close({isTicketCreated: true, noOfErrorUpdated});
              this._sharedService.openSuccessSnackBar(response);
            }
          },
          (error) => {
            this.loading = false;
            this.dialogRef.close();
            this._sharedService.openErrorSnackBar(error);
          }
        );
      } else {
        this._sharedService.openErrorSnackBar({
          error: MessageConstant.CREATE_JIRA_FORM_ERROR,
          message: MessageConstant.CREATE_JIRA_FORM_ERROR_MESSAGE,
          statusCode: StatusCodeConstant.PRECONDITION_FAILED,
        });
      }
    } else {
      this.dialogRef.close();
    }
  }

  public onCustomFieldChange(value: any, field: string): void {
    this.createJiraForm.get(field).setValue(value);
  }

  public onIssueTypeSelect(data: IJiraIssueType): void {
    this.initCreateEditJiraTicketForm(this.popupData);
    this.currentIssueType = data;
    this.createJiraForm.get('issuetype').patchValue({
      id: this.currentIssueType.id
    });
    this.dynamicFields = [];
    const fieldsToAvoid = this._jiraService.fieldsToAvoid;

    for (var field in data.fields) {
      if (
        !fieldsToAvoid.includes(data.fields[field].key) &&
        data.fields[field].required
      ) {
        this.addDynamicField(data.fields[field]);
      }
    }
  }

  public addDynamicField(field: IJiraField): void {
    if (field.key != 'priority') {
      this.createJiraForm.addControl(
        field.key,
        new FormControl('', Validators.required)
      );
      this.alterfieldData(field);
    } else {
      this.createJiraForm.get('priority').setValidators(Validators.required);
    }

    if (field.hasDefaultValue) {
      this.createJiraForm.get(field.key).setValue(field.defaultValue);
    }

    this.createJiraForm.updateValueAndValidity();
  }

  public alterfieldData(field: IJiraField): void {
    const type = field.schema.custom
      ? field.schema.custom.split(':')
      : field.schema.type.split(':');
    field.schema.custom = type[type.length - 1];
    this.dynamicFields.push(field);
  }
}
