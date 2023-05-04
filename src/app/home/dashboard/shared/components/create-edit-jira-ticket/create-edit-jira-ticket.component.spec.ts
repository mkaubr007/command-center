import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { of, throwError } from 'rxjs';
import { CustomHttpService } from '../../../../../core/services/http.service';
import { JiraService } from '../../../../../shared/services/jira.service';
import { SharedService } from '../../../../../shared/shared.service';
import { SharedHomeModule } from '../../../../shared-home/shared-home.module';
import { MaterialModule } from './../../../../../material/material.module';
import { JiraTestConstants } from "./create-edit-jira-ticket-test.constants";
import { CreateEditJiraTicketComponent } from './create-edit-jira-ticket.component';

describe('CreateEditJiraTicketComponent', () => {
  let component: CreateEditJiraTicketComponent;
  let fixture: ComponentFixture<CreateEditJiraTicketComponent>;

  const dialogMock = { close: (value = '') => { } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        MatSelectModule,
        NgSelectModule,
        CommonModule,
        BrowserAnimationsModule,
        SharedHomeModule,
        HttpClientModule,
        RouterTestingModule,
      ],
      providers : [
        { provide: MatDialogRef, useValue: dialogMock },
        SharedService,
        JiraService,
        CustomHttpService,
      ],
      declarations: [ CreateEditJiraTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditJiraTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init page', () => {
    const setIssueTypesSpy = jest.spyOn(component, "setIssueTypes");
    const initFormSpy = jest.spyOn(component, "initCreateEditJiraTicketForm");
    component["_jiraService"].project = JiraTestConstants.getIssueTypesResult.projects[0];
    component["_jiraService"].jiraUsers = JiraTestConstants.getJiraUsersResult;

    component.popupData = JiraTestConstants.initFormData;
    component.ngOnInit();

    expect(setIssueTypesSpy).toHaveBeenCalledWith(JiraTestConstants.getIssueTypesResult.projects[0]);
    expect(component.assigneeData).toEqual(JiraTestConstants.getJiraUsersResult);
    expect(initFormSpy).toHaveBeenCalledWith(JiraTestConstants.initFormData);
  });

  it('should get jiraData', async() => {
    const getIssueTypeSpy = jest
      .spyOn(component["_jiraService"], 'getIssueTypes')
      .mockImplementation(() => { return of(JiraTestConstants.getIssueTypeResponse) });

    const getUserSpy = jest
      .spyOn(component["_jiraService"], 'getJiraUsers')
      .mockImplementation(() => { return of(JiraTestConstants.getJiraUserResponse) });

    component["getJiraData"]();

    expect(getIssueTypeSpy).toHaveBeenCalled();
    expect(getUserSpy).toHaveBeenCalled();
  });

  it('should result in error while fetching jira data', async() =>{
    jest.spyOn(component["_jiraService"], 'getIssueTypes')
      .mockImplementation(() => throwError(JiraTestConstants.getIssueTypeErrorResponse));

    const openSnackBarSpy = jest
      .spyOn(component['_sharedService'], 'openErrorSnackBar')
      .mockImplementation();

    await component["getJiraData"]();

    expect(openSnackBarSpy).toHaveBeenCalledWith(JiraTestConstants.getIssueTypeErrorResponse);
  });

  it('should change field value', () => {
    component.initCreateEditJiraTicketForm();
    const value = 'test';
    const field = 'summary';
    component.onCustomFieldChange(value, field);

    expect(component.createJiraForm.value[field]).toBe(value);
  });

  it('should assign issueType', () => {
    const initCreateEditFormSpy = jest.spyOn(component, 'initCreateEditJiraTicketForm');

    component.popupData = JiraTestConstants.initFormData;
    const issuetype = JiraTestConstants.getIssueTypesResult.projects[0].issuetypes[0];
    component.onIssueTypeSelect(issuetype);

    expect(initCreateEditFormSpy).toHaveBeenCalledWith(JiraTestConstants.initFormData);
    expect(component.createJiraForm.value.issuetype).toEqual({id: issuetype.id});
    expect(component.currentIssueType).toEqual(issuetype);
  });

  it('should add dynamic field', () => {
    const alterfieldDataSpy = jest.spyOn(component, "alterfieldData");
    const field = JiraTestConstants.issueTypeField;

    component.initCreateEditJiraTicketForm();
    component.addDynamicField(field);

    expect(component.createJiraForm.value[field.key]).toBe("");
    expect(alterfieldDataSpy).toHaveBeenCalledWith(field);
  });

  it('should alter field data', () => {
    component.alterfieldData(JiraTestConstants.issueTypeField);
    expect(component.dynamicFields[0].schema.custom).toBe("select");
  });

  it('should set jira issue types', () => {
    component.setIssueTypes(JiraTestConstants.getIssueTypesResult.projects[0]);
    const issueTypes = ["New Process"];

    expect(component.project).toEqual(JiraTestConstants.getIssueTypesResult.projects[0])
    expect(component.issueTypes).toEqual(issueTypes);
  });

  it('should create jira ticket', () => {
    const alterfieldDataSpy = jest.spyOn(component["_jiraService"], 'createJiraTicket')
    .mockImplementation(() => of(JiraTestConstants.jiraSuccessResponse));
    const dialogRefSpy = jest.spyOn(component["dialogRef"], 'close');
    const successSnackBarSpy = jest.spyOn(component["_sharedService"], 'openSuccessSnackBar');

    component.popupData = JiraTestConstants.initFormData;
    component.initCreateEditJiraTicketForm(component.popupData);
    component.setIssueTypes(JiraTestConstants.getIssueTypesResult.projects[0]);

    component.createJiraForm.get('issuetype').setValue({
      id: component.project.issuetypes[0].id
    });
    component.createJiraForm.get('summary').setValue('test');
    component.createJiraForm.get('description').setValue('test detail');

    component.closePopup(true);

    expect(alterfieldDataSpy).toHaveBeenCalledWith(JiraTestConstants.createTicketData);
    expect(dialogRefSpy).toHaveBeenCalled();
    expect(successSnackBarSpy).toHaveBeenCalled();
  });

  it('should not create jira ticket', () => {
    const alterfieldDataSpy = jest.spyOn(component["_jiraService"], 'createJiraTicket')
    .mockImplementation(() => throwError('data is not valid'));
    const dialogRefSpy = jest.spyOn(component["dialogRef"], 'close');
    const errorSnackBarSpy = jest.spyOn(component["_sharedService"], 'openErrorSnackBar');

    component.popupData = JiraTestConstants.initFormData;
    component.initCreateEditJiraTicketForm(component.popupData);
    component.setIssueTypes(JiraTestConstants.getIssueTypesResult.projects[0]);

    component.createJiraForm.get('issuetype').setValue({
      id: component.project.issuetypes[0].id
    });
    component.createJiraForm.get('summary').setValue('test');
    component.createJiraForm.get('description').setValue('test detail');

    component.closePopup(true);

    expect(alterfieldDataSpy).toHaveBeenCalledWith(JiraTestConstants.createTicketData);
    expect(dialogRefSpy).toHaveBeenCalled();
    expect(errorSnackBarSpy).toHaveBeenCalled();
  });
});
