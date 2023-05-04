import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-jiralogin',
  templateUrl: './jiralogin.component.html'
})
export class JiraLoginComponent implements OnInit {
  public jiraIssue;
  createdJiraIssue: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(({ code, state }) => {
      if (code) {
        this._authService.loginUserWithJira({ code, state })
          .subscribe(data => {
            console.log(data);
          });
      }
    });
  }

  getIssues() {
    this._authService.getIssue(`NPP-7386`)
      .subscribe(data => {
        this.jiraIssue = data;
        console.log(data);
      });
  }

  createIssues() {
    this._authService.createIssues({})
      .subscribe(data => {
        this.createdJiraIssue = data;
        console.log(data);
      });
  }


}
