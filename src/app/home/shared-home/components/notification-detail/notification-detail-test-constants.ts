export class NotificationDetailConstants {
  public static readonly CURRENT_NOTIFICATION = {
    assignedBy: {
      id: '5e9e9022abfc01673460a39c',
      name: 'Vikash Gaurav',
      profilePic:
        'https://cc-users-pic.s3.amazonaws.com/RUKQzXpKdZ4hYx1LLsmYrKk1.jpg',
    },
    client: 'deactivateclient',
    date: '2021-01-14T08:14:09.549Z',
    environment: 'QA Env',
    errorId: '5fe45364e032dd001210d777',
    errorType: 'information',
    message: `↵        <div>↵            Vikash Gaurav assigned error -↵            <span class="specific-txt toaster-bold-txt"> "information" </span>↵            for client <span class="toaster-bold-txt"> "deactivateclient" </span>↵            on environment <span class="toaster-bold-txt"> "QA Env" </span>↵            for the service <span class="toaster-bold-txt"> "email service on QA" </span> to you.↵        </div>↵            `,
    serviceName: 'email service on QA',
    source: 'MANUAL-ERROR-ASSIGNEE-BULK',
    user: [
      {
        id: '5efc5dedabfc016734c6906c',
        isRead: false,
      },
    ],
  };

  public static readonly ERROR_DATA = {
    assignedTo: {
      id: '5e9e9022abfc01673460a39c',
      name: 'Vikash Gaurav',
      avatar:
        'https://cc-users-pic.s3.amazonaws.com/RUKQzXpKdZ4hYx1LLsmYrKk1.jpg',
    },
    clientName: 'deactivateclient',
    date: '2021-01-14T08:14:09.549Z',
    environment: 'QA Env',
    errorType: 'information',
    errorMessage:
      'A network related or instance specific error occured while or instance specific error occured while 8',
    serviceName: 'email service on QA',
    source: 'MANUAL-ERROR-ASSIGNEE-BULK',
    status: 'In Progress',
    _id: '5fe45364e032dd001210d777',
  };

  public static readonly STATUS_CHANGE_SUCCESS = {
    data: NotificationDetailConstants.ERROR_DATA,
    message: 'Success',
    statusCode: 200,
  };
}
