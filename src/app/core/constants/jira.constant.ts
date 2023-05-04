export class JiraConstants {
  public static readonly EXCLUDED_ISSUES: string[] = ['Additional Support', 'Sub-task'];
  public static readonly ETL_PROJECT_ID: number = 10408; // ETL project key
  // public static readonly ETL_PROJECT_ID: number = 10404; // Pareo Project key
  public static readonly YOUR_USER_BOUND_VALUE = 'Commandcenter-akash-test';
  public static readonly JIRA_STATE_VARIABLE = 'JIRASTATE';
  public static readonly JIRA_CREATE_PERMISSION = 'CREATE_ISSUES';
  // local
  // public static readonly JIRA_PERMISSION_URL  = 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=e1Gp0HtFdcxhc1o26EcD7XZnrLsS5SXv&scope=offline_access%20read%3Ajira-user%20manage%3Ajira-data-provider%20write%3Ajira-work%20manage%3Ajira-configuration%20manage%3Ajira-project%20read%3Ajira-work&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fdashboard&state=JIRASTATE&response_type=code&prompt=consent';
  // cc server
  public static readonly JIRA_PERMISSION_URL  = 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=e1Gp0HtFdcxhc1o26EcD7XZnrLsS5SXv&scope=offline_access%20read%3Ajira-user%20manage%3Ajira-data-provider%20write%3Ajira-work%20manage%3Ajira-configuration%20manage%3Ajira-project%20read%3Ajira-work&redirect_uri=https%3A%2F%2Fcommandcentertest.pareo.io%2Fdashboard&state=JIRASTATE&response_type=code&prompt=consent';
  // Aman local
  // public static readonly JIRA_PERMISSION_URL  = 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=PCUAXJ9TenzQH17byQkskuf7ezz0d9xK&scope=offline_access%20read%3Ajira-user%20read%3Ajira-work%20write%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20manage%3Ajira-data-provider&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fdashboard&state=$JIRASTATE&response_type=code&prompt=consent';
}
