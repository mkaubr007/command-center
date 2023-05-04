import { Injectable } from '@angular/core';
import { CustomHttpService } from '../../core/services/http.service';
import { IJiraUser } from '../models/jira/jira.interface';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable()
export class JiraService {

    public project: any;
    public jiraUsers: IJiraUser[];
    public fieldsToAvoid = ['attachment', 'description', 'summary', 'issuetype', 'project', 'issuelinks', 'fixVersions', 'assignee'];

    constructor(private http: CustomHttpService) { }

    public getIssueTypes(): Observable<any> {
        return this.http.get(`/jira/issue-types`).pipe(
            map(data => data.body)
        );
    }

    public getJiraUsers(): Observable<any> {
        return this.http.get(`/jira/users`).pipe(
            map(data => data.body)
        );
    }

    public createJiraTicket(jiraDetail: any): Observable<any> {
      return this.http.post<any>(`/jira`, jiraDetail);
    }

    public checkJiraPermission(permission: string): Observable<any> {
      return this.http.get<any>(`/jira/check-permission?permission=${permission}`).pipe(
        map(data => data.body));
    }
}
