import { ErrorTab, ErrorUrlTab } from '../../../../../../../shared/enums/error-tab.enum';

export class ErrorConstants {
  public static readonly BASE_URL = 'https://clarishealth.atlassian.net/browse/';
  public static readonly ASSIGNEES = [{"name": "aman Kumar","avatar": "../../../../../../assets/images/no-img-user.svg","id": "5e944ed15aed5b1b722f6b83"}];
  public static readonly ERROR_TYPES = {
    SUCCESS: "success",
    DATA_ERROR: "Data Error",
    TEST_CSV: "Test CSV",
    MONGO_CONNECTION_ERROR: "Mongo Connection Error",
    SQL_CONNECTION_ERROR: "Sql Connection Error",
    EMAIL_ERROR: "Email Error",
    FILE_NAME_ERROR: "File Name Error",
    INFORMATION: "information",
    UNKNOWN_ERROR: "Unknown Error",
    UNKNOWN_FILE_TYPE: "Unknown File Type",
  };
  public static readonly ERROR_STATUS = {
    CSR_ACTION: 'CSR Action',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
    RESOLVED: 'Resolved',
    PENDING: 'Pending',
    CLOSED: 'Closed',
    TO_DO: 'To Do'
  };
  public static readonly RESOLUTION = {
    UNRESOLVED: 'unresolved',
  };
  public static readonly EXIST_TRUE_NOT_EQUAL_NULL = { $exists: true, $ne: null };
  public static readonly NOT_EQUAL_NULL = { $ne: null };
  public static readonly EXIST_TRUE = { $exists: true };
  public static readonly ERROR_COUNT_RESULT = {
    allError: 10,
    newError: 10,
    unresolvedManualError: 10,
    unresolvedJiraError: 10,
    resolvedError: 10
  }

  public static readonly TAB_ADJUSTMENT = {
    unresolvedManualError: +1,
    newError: -1
  };

  public static readonly TAB_UPDATED_BADGE_COUNT = [
    {
      label: ErrorTab.ALL,
      key: ErrorUrlTab.ALL,
      badge: 10,
      disabled: false,
      showCreateJiraButton: false,
      isAssigneeDisabled: false,
      isStatusDisabled: false
    },
    {
      label: ErrorTab.NEW,
      key: ErrorUrlTab.NEW,
      badge: 10,
      disabled: false,
      showCreateJiraButton: true,
      isAssigneeDisabled: false,
      isStatusDisabled: false
    },
    {
      label: ErrorTab.UNRESOLVED_MANUAL,
      key: ErrorUrlTab.UNRESOLVED_MANUAL,
      badge: 10,
      disabled: false,
      showCreateJiraButton: true,
      isAssigneeDisabled: false,
      isStatusDisabled: false
    },
    {
      label: ErrorTab.UNRESOLVED_JIRA,
      key: ErrorUrlTab.UNRESOLVED_JIRA,
      badge: 10,
      disabled: false,
      showCreateJiraButton: false,
      isAssigneeDisabled: true,
      isStatusDisabled: true
    },
    {
      label: ErrorTab.RESOLVED,
      key: ErrorUrlTab.RESOLVED,
      badge: 10,
      disabled: false,
      showCreateJiraButton: false,
      isAssigneeDisabled: true,
      isStatusDisabled: true
    },
  ];

  public static readonly JIRA_TICKET_CREATED = 'created-ticket';
  public static readonly UNASSIGNED = 'Unassigned';
  public static readonly NO_FILTER_DATA = 'No filter data';
  public static readonly ASSIGNEE_FILTER = 'assignee-filter';
}
