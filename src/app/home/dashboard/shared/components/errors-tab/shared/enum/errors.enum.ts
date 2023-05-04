export enum Sorting {
  ASC = 'asc',
  DESC = 'desc',
}

export enum OrderBy {
  ASC = 1,
  DESC = -1,
}

export enum SortBy {
  ERROR_TYPE = 'errorType',
  SERVICE = 'serviceName',
  GENERATED_ON = 'date',
  STATUS = 'status',
  ASSIGNEE = 'assignedTo.name',
  JIRA_TICKET = 'jiraTicketId'
}
