export class MessageConstant {
  public static readonly NO_USER: string = 'No one here, yet.';
  public static readonly NO_TEAM_MEMBER_SUBTXT: string =
    'Click on the button above to add a team member.';
  public static readonly NO_CLIENT_SUBTXT: string =
    'Click on the button above to add a client.';
  public static readonly NO_ROLES_SUBTXT: string =
    'Click on the button above to add a role.';
  public static readonly NO_SERVICE: string = 'No services added, yet.';
  public static readonly NO_ERRORS_FOUND = 'No errors found';
  public static readonly NO_ERRORS_FOUND_SUBTXT =
    'Seems like everything is on track. Good Job!';
  public static readonly NO_TEAM_SUBTXT = 'No one assigned yet';
  public static readonly NO_SEARCH_RESULTS = 'No search results found.';
  public static readonly TRY_DIFF_NAME = 'Try again using a different name.';
  public static readonly NO_CLIENT: string = 'Nothing here, yet.';
  public static readonly TRY_DIFF_SEARCH_WORD =
    'Try again with different search words.';
  public static readonly RESPONSE_SUCCESS = 'Success';
  public static readonly RESPONSE_FAILURE = 'Failure';
  public static readonly FORGET_PWD_CONFIRM_POPUP_TITLE =
    'Please check your email';
  public static readonly FORGET_PWD_CONFIRM_POPUP_SUBTITLE =
    'A password reset link has been sent to your inbox. Please follow the instructions on the email to reset your password.';
  public static readonly FORGET_PWD_CONFIRM_POPUP_BUTTON_TEXT = 'Ok';
  public static readonly RESET_PWD_CONFIRM_POPUP_TITLE =
    'Your password has been reset';
  public static readonly RESET_PWD_CONFIRM_POPUP_SUBTITLE =
    'Use your new password to log in to your account';
  public static readonly RESET_PWD_CONFIRM_POPUP_BUTTON_TEXT = 'Log In';
  public static readonly CREATE_JIRA_FORM_ERROR = 'Invalid form';
  public static readonly CREATE_JIRA_FORM_ERROR_MESSAGE =
    'Please enter all the required fields';
  public static readonly NEW_ERROR_STATUS_CHANGE_ERROR = 'Fail';
  public static readonly NEW_ERROR_STATUS_CHANGE_ERROR_MESSAGE =
    'First assign the error to a team member, then change status.';
  public static readonly NO_DATA = 'N/A';
  /*Team*/
  public static readonly TEAM = 'Team';
  public static readonly TEAM_MEMBERS = 'Team member';
  public static readonly ADD_NEW_TEAM_MEMBERS = 'Add a new team member';
  public static readonly EDIT_TEAM_MEMBER = 'Edit team member';
  public static readonly SEARCH_TEAM = 'Search team member';
  public static readonly DELETE_MEMBER = 'Delete member';
  public static readonly DEACTIVATE_MEMBER_TXT =
    'This action will remove access of the team member from the application and you will no longer be able to assign tickets or clients to them. Are you sure you want to proceed?';
  public static readonly DEACTIVATE_MEMBER_FOR_CSR_USER_TXT =
    'This action will remove access of the team member from the application and you will no longer be able to assign tickets or clients to them. This user has the following - ##ERRORCOUNT## Unresolved manual/Pending error(s). ##CSRCOUNT## client(s) for whom they are assigned as CSR. Deactivating will not change assignment and will need to be done manually from Error tab and Manage clients.';
  public static readonly DEACTIVATE_MEMBER_FOR_NON_CSR_USER_TXT =
    'This action will remove access of the team member from the application and you will no longer be able to assign tickets or clients to them. This user has the following - ##ERRORCOUNT## Unresolved manual/Pending error(s). Deactivating will not change assignment and will need to be done manually from Error tab.';

  public static readonly UPDATE_TEAM_MEMBERS = 'Update Member';
  /*Role*/
  public static readonly ROLE = 'Role';
  public static readonly ADD_NEW_ROLE = 'Add a new role';
  public static readonly UPDATE_ROLE = 'Update role';
  public static readonly SEARCH_ROLE = 'Search role';

  /*Environment & services*/
  public static readonly ENVIRONMENT = 'Environment';
  public static readonly ADD_NEW_ENVIRONMENT = 'Add a new environment';
  public static readonly SERVICE = 'Service';
  public static readonly SERVICE_NAME = 'Service name';
  public static readonly ADD_NEW_SERVICE = 'Add a new service';
  public static readonly ENTER_SERVICE_NAME = 'Enter service name';
  public static readonly ENVIRONMENT_NAME = 'Environment name';
  public static readonly ENTER_ENVIRONMENT_NAME = 'Enter environment name';
  public static readonly PRIORTISE = 'Prioritize';
  public static readonly SELECT_SERVICE = 'Select service';
  public static readonly SELECT_ENVIRONMENT = 'Select environment';
  public static readonly NOT_LISTED_ABOVE = 'Not listed above?';
  public static readonly ALSO_INCLUDE_IN = 'Also include in';
  public static readonly DELETE_ENVIRONMENT = 'Delete environment?';
  public static readonly DELETE_ENVIRONMENT_TXT =
    'This action will permanently remove all associated records from this platform. Are you sure you want to proceed?';
  public static readonly CHECK_IN_INTERVAL = 'Check-in interval with ETL';
  public static readonly SELECT_UNIT = 'Select Unit';

  /*Client*/
  public static readonly CLIENT = 'Client';
  
  public static readonly CLIENT_SERVICE_REP = 'Client service representative';
  public static readonly ADD_NEW_CLIENT = 'Add a new client';
  public static readonly UPDATE_CLIENT = 'Update Client';
  public static readonly SEARCH_CLIENT = 'Search client';
  public static readonly ENTER_CLIENT_NAME = 'Enter client name';
  public static readonly CLIENT_NAME = 'Client name';
  public static readonly CLIENT_SERVICE_REPRESENTATIVE =
    'Client service representative';

  public static readonly DELETE_CLIENT = 'Delete client';
  public static readonly DEACTIVATE_CLIENT = 'Deactivate client';
  public static readonly REMOVE_SERVICE = 'Remove service';

  public static readonly DEACTIVATE_ENVIRONMENT = 'Deactivate environment';
  public static readonly DEACTIVATE_TEAM_MEMBER_HEADER =
    'Deactivate team member';

  public static readonly REMOVE = 'Remove';

  public static readonly DELETE_CLIENT_TXT =
    'This action will permanently remove all associated records from this platform. Are you sure you want to proceed?';

  public static readonly DEACTIVE_SERVICE_TXT =
    'This action will remove this service from the environment. Are you sure you want to continue?';

  /*Common*/
  public static readonly ADD = 'Add';
  public static readonly SAVE = 'Save';
  public static readonly UPDATE = 'Update';
  public static readonly DELETE = 'Delete';
  public static readonly DEACTIVATE = 'Deactivate';
  public static readonly CREATE = 'Create';
  public static readonly CANCEL = 'Cancel';
  public static readonly INVITE_VIA_EMAIL = 'Invite via email address';
  public static readonly ADD_NEW = 'Add new';
  public static readonly UPDATE_NEW = 'Update';
  public static readonly ADD_OR_UPDATE = 'Add or Update';
  public static readonly ENTER_EMAIL = 'Enter email';
  public static readonly EMAIL = 'Email';
  public static readonly TIME = 'Time';
  public static readonly APPLY = 'Apply';

  /*Dashboard*/
  public static readonly SERVICE_HEALTH = 'Service(s) Health';
  public static readonly TEAM_OVERVIEW = 'Team Overview';

  /*Client Sorting*/
  public static readonly NAME = 'name';
  public static readonly SERVICE_REP = 'serviceRepresentative';

  /*Process Group*/
  public static readonly NAMEPG = 'name';
  public static readonly Parallelism = 'parallelism';
  public static readonly FAILUREFATAL = 'enabled';
  public static readonly Scheduled = 'Scheduled';
  public static readonly Published = 'isPublished';
  public static readonly ADD_NEW_PROCESS_GROUP = 'Add a new Process Group';
  public static readonly EDIT_PROCESS_GROUP = 'Edit Process Group';



  /*Client Status*/
  public static readonly ACTIVE = 'active';
  public static readonly INACTIVE = 'inactive';

  /*Errors*/
  public static readonly ALL = 'All error';
  public static readonly NEW = 'New error';
  public static readonly UNRESOLVED_MANUAL = 'Unresolved manual error';
  public static readonly UNRESOLVED_JIRA = 'Unresolved Jira error';
  public static readonly RESOLVED = 'Resolved error';
  public static readonly PENDING = 'Pending';
  public static readonly FILLED = 'filled';
  public static readonly EMPTY = 'empty';
  public static readonly LABEL_NAME = 'name';
  public static readonly SEARCH_BY_ERROR_TYPES = 'Search by error types';
  public static readonly EXPORT_CSV_BUTTON_TITLE = 'Export CSV';

  /*JIRA*/
  public static readonly CREATE_JIRA = 'Create a Jira ticket';
  public static readonly SUMMARY = 'Summary';
  public static readonly DESCRIPTION = 'Description';
  public static readonly ISSUE_TYPE = 'Issue type';
  public static readonly PRIORITY = 'Priority';
  public static readonly PRIORITY_KEY = 'priority';
  public static readonly ASSIGNEE = 'Assignee';
  public static readonly ENTER_JIRA_TICKET_NAME = 'Enter Jira ticket name';
  public static readonly ENTER_JIRA_TICKET_DESCRIPTION =
    'Enter Jira ticket description';
  public static readonly CREATE_JIRA_SUCCESSFULLY = 'Successfully Created';

  /*Customize uploaded picture*/
  public static readonly CROP_PHOTO = 'Crop Photo';
  public static readonly CROP_PHOTO_SUB =
    'Drag the cropper to reposition. Use corner handles to scale up and down.';
  public static readonly CHANGE_PHOTO = 'Change Photo';
  public static readonly DELETE_PHOTO = 'Delete photo';
  public static readonly DELETE_PHOTO_MSG =
    'This action will permanently remove your photo from profile picture. Are you sure you want to proceed?';
  public static readonly HELPER_PHOTO_MSG =
    'Make sure to upload only png, jpg or jpeg files';

  //Pagination constants
  public static readonly PAGINATION_TEAM_MEMBER = 'Team Member(s)';
  public static readonly PAGINATION_CLIENT = 'Client(s)';
  public static readonly PAGINATION_ARGUMENT = 'Argument(s)';
  public static readonly PAGINATION_PROCESS = 'Process(s)';
  public static readonly PAGINATION_PROCESSGROUP = 'Process Group(s)';
  public static readonly PAGINATION_SCHEDULE = 'Schedule(s)';
  public static readonly PAGINATION_ROLE = 'Role(s)';
  public static readonly PAGINATION_ALL = 'All error(s)';
  public static readonly PAGINATION_NEW = 'New error(s)';
  public static readonly PAGINATION_UNRESOLVED_MANUAL =
    'Unresolved manual error(s)';
  public static readonly PAGINATION_UNRESOLVED_JIRA =
    'Unresolved Jira error(s)';
  public static readonly PAGINATION_RESOLVED = 'Resolved error(s)';

  public static readonly SELECT_DATE_RANGE = 'Select Date Range';
  public static readonly APPLY_BUTTON = 'Apply';
  public static readonly CLEAR_BUTTON = 'Clear';
  public static readonly CUSTOM_RANGE_LABEL = 'Custom Date(s)';

  //Logout
  public static readonly LOGOUT_TITLE = 'Access Updated';
  public static readonly LOGOUT_CSR_SUBTITLE =
    'Your access has been updated by the Administrator, because of which you will be logged out. Please login again to continue working.';
  public static readonly LOGOUT_BUTTON = 'Logout';
  
  //process-groups
  public static readonly NO_PROCESS_GROUPS: string = 'Nothing here, yet.';
  public static readonly NO_PROCESS_GROUPS_SUBTXT: string =
    'Click on the button above to add a Process Group.';
    public static readonly NO_PROCESS_GROUP_FILTER_SELECTED_SUBTXT: string =
      'Please select Client/Environment to see related Process Groups.';
  public static readonly DELETE_PROCESS_GROUP = 'Delete Process Group';  
  public static readonly DELETE_PROCESS_GROUP_TXT =
  'This action will permanently remove the Process Group. Are you sure you want to proceed?';
  public static readonly UNLINK_PROCESS_GROUP = 'Unlink Process';  
  public static readonly UNLINK_PROCESS_GROUP_TXT =
  'This action will permanently unlink this Process. Are you sure you want to proceed?';
  public static readonly NO_PROCESS_GROUPS_POPUP_SUBTXT: string =
    'Create a few Process-groups first so that you can view them here.';
    public static readonly UNPUBLISH_PROCESS_GROUP = 'Unpublish Process Group';  
    public static readonly UNPUBLISH_PROCESS_GROUP_TXT =
    'This action will unpublish the Process Group. Are you sure you want to proceed?';
    public static readonly PUBLISH_PROCESS_GROUP = 'Publish Process Group';  
    public static readonly PUBLISH_PROCESS_GROUP_TXT =
    'This action will publish the Process Group. Are you sure you want to proceed?';
  public static readonly PROCESS_GROUPS_TAB_ERROR = {
    error: 'Failure',
    message: 'Some error occured while performing the request. Please try again.',
    statusCode: 500,
  };

  public static readonly PROCESS_GROUP_CREATE_TXT = "Create a new Process Group";
  public static readonly NO_PROCESS_POPUP_SUBTXT: string =
  'Create a few Process first so that you can view them here.';
  public static readonly NO_PROCESSES: string = 'Nothing here, yet.';

  //processess
  public static readonly PROCESSESS = 'Processes';
  public static readonly CREATE_NEW_PROCESS = 'Create a new Process';
  public static readonly SEARCH_PROCESS = 'Search process';
  public static readonly EDIT_PROCESS = 'Edit Process';
  public static readonly PUBLISHED ='PUBLiSHED'
  public static readonly PROCESS = 'PROCESS';
  public static readonly DISPLAY_NAME = 'DISPLAY NAME';
  public static readonly ASSEMBLY = 'ASSEMBLY';
  public static readonly STATUS = 'STATUS';
  public static readonly FAILURE_FATAL = 'FAILURE FATAL';
  public static readonly ENABLED = 'ENABLED';
  public static readonly DELETE_PROCESS = 'Delete Process';  
  public static readonly DELETE_PROCESS_TXT =
  'This action will permanently remove the Process. Are you sure you want to proceed?';
  public static readonly UNPUBLISH_PROCESS = 'Unpublish Process';  
  public static readonly UNPUBLISH_PROCESS_TXT =
  'This action will unpublish the Process. Are you sure you want to proceed?';
  public static readonly PUBLISH_PROCESS = 'Publish Process';  
  public static readonly PUBLISH_PROCESS_TXT =
  'This action will publish the Process. Are you sure you want to proceed?';
  public static readonly NO_PROCESSES_SUBTXT: string =
    'Click on the button above to add a Process.';
  public static readonly NO_PROCESS_FILTER_SELECTED_SUBTXT: string =
    'Please select an Environment to see related Processes.';

  //Arguments
  public static readonly ARGUMENT = 'Arguments';
  public static readonly CREATE_NEW_ARGUMENT = 'Create a new Argument';
  public static readonly SEARCH_ARGUMENT = 'Search Argument';
  public static readonly LINK_ARGUMENTS = 'Link Arguments';
  public static readonly ADD_ARGUMENT = 'Create a new Argument';
  public static readonly EDIT_ARGUMENT = 'Edit Argument';
  public static readonly DELETE_ARGUMENT = 'Delete Argument';  
  public static readonly DELETE_ARGUMENT_TXT =
  'This action will permanently remove the Argument. Are you sure you want to proceed?';
  public static readonly UNLINK_ARGUMENT = 'Unlink Argument';  
  public static readonly UNLINK_ARGUMENT_TXT =
  'This action will permanently unlink this Argument. Are you sure you want to proceed?';
  public static readonly NO_ARGUMENTS: string = 'Nothing here, yet.';
  public static readonly NO_ARGUMENTS_SUBTXT: string =
    'Click on the button above to add an Argument.';
  public static readonly NO_ARGUMENT_FILTER_SELECTED_SUBTXT: string =
    'Please select an Environment to see related Arguments.';
  public static readonly NO_ARGUMENTS_POPUP_SUBTXT: string =
  'Create a few Arguments first so that you can view them here.';

  public static readonly ARGUMENTS_TAB_ERROR = {
    error: 'Failure',
    message: 'Some error occured while performing the request. Please try again.',
    statusCode: 500,
  };

  public static readonly PROCESS_TAB_ERROR = {
    error: 'Failure',
    message: 'Some error occured while performing the request. Please try again.',
    statusCode: 500,
  };

  // Schedule Process Group
  public static readonly DELETE_SCHEDULE_PROCESS_GROUP = 'Delete Scheduled Process Group';  
  public static readonly DELETE_SCHEDULE_PROCESS_GROUP_TXT =
  'This action will permanently remove the scheduled process group. Are you sure you want to proceed?';
  public static readonly NO_SCHEDULE_PROCESS_GROUPS: string = 'Nothing here, yet.';
  public static readonly NO_SCHEDULE_PROCESS_GROUPS_SUBTXT : string =
    'Please click on Process Groups tab to create a schedule.';
  public static readonly ENABLE_SCHEDULE = 'Enable Schedule';  
  public static readonly ENABLE_SCHEDULE_TXT ='This action will enable the schedule. Are you sure you want to proceed?';
  public static readonly DISABLE_SCHEDULE = 'Disable Schedule';  
  public static readonly DISABLE_SCHEDULE_TXT ='This action will disable the schedule. Are you sure you want to proceed?';
  public static readonly SCHEDULE_TAB_ERROR = {
    error: 'Failure',
    message: 'Some error occured while performing the request. Please try again.',
    statusCode: 500,
  };

  public static readonly NO_SCHEDULE_PROCESS_GROUPS_FILTER_SELECTED_SUBTXT = "Please select Client/Environment to see related Schedules."

}
