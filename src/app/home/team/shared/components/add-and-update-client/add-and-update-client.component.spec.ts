import { cloneDeep } from 'lodash';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { AddAndUpdateClientComponent } from './add-and-update-client.component';
import { MaterialModule } from '../../../../../material/material.module';
import { SelectBoxComponent } from '../../../../shared-home/components/select-box/select-box.component';
import { InputFieldComponent } from '../../../../shared-home/components/input-field/input-field.component';
import { UploadImageComponent } from '../../../../shared-home/components/upload-image/upload-image.component';
import { TeamService } from '../../../team.service';
import { SharedService } from '../../../../../shared/shared.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import Utils from 'src/app/home/shared-home/utils/utils';
import { Observable, of, throwError } from 'rxjs';
import { IClientServiceRep, IClientServiceResponse } from 'src/app/shared/models/client-service-rep/client-service-rep';
import { UpdateClientConstants } from './update.test.constants';
import { HttpClientModule } from '@angular/common/http';
import { CustomHttpService } from 'src/app/core/services/http.service';
import { LocalStorageConstants  } from 'src/app/core/constants/local-storage.constants';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiResponse } from '../../../../../shared/models/util/api-response';
import { MockSocketService } from '../../../../shared-home/services/socket/socket-service.mock';
import { SocketService } from '../../../../shared-home/services/socket/socket.service';
class TeamServiceMock extends TeamService {
  searchTeamMembers(): Observable<IClientServiceRep[]> {
    return of(UpdateClientConstants.SEARCH_TEAM_MEMBERS);
  }
  createClient(): Observable<ApiResponse<IClientServiceResponse>> {
    return of(UpdateClientConstants.CREATE_CLIENT_RESPONSE as ApiResponse<any>);
  }
}

describe('AddAndUpdateClientComponent', () => {
  let component: AddAndUpdateClientComponent;
  let fixture: ComponentFixture<AddAndUpdateClientComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  let localStorage: LocalStorageService;

  const initAddUpdateClientForm = () => {
    return {
      name: [null, [Validators.required, Utils.emptySpaceValidator()]],
      serviceRepresentative: formBuilder.group({ id: [], name: [] }),
      email: [null],
    }
  }

  const dialogMock = { close: (value = '') => { } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterTestingModule,
        FormsModule,
      ],
      declarations: [
        AddAndUpdateClientComponent,
        SelectBoxComponent,
        InputFieldComponent,
        UploadImageComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        LocalStorageService,
        { provide: TeamService, useClass: TeamServiceMock },
        CustomHttpService,
        SharedService,
        { provide: SocketService, useClass: MockSocketService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAndUpdateClientComponent);
    component = fixture.debugElement.componentInstance;
    localStorage = TestBed.get(LocalStorageService);
    const data: any = {
      client: cloneDeep(UpdateClientConstants.CLIENT_RESPONSE_DATA)
    };
    component.data = data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init page', () => {
    let formGroup = formBuilder.group(initAddUpdateClientForm());
    formGroup.get('serviceRepresentative').patchValue(UpdateClientConstants.CLIENT_RESPONSE_DATA.serviceRepresentative);
    formGroup.get('name').disable();

    jest.spyOn(component, 'setClientRep');
    component.ngOnInit();

    expect(component.addNewClientForm.value).toEqual(formGroup.value);
    expect(component.setClientRep).toHaveBeenCalled();
  });

  it('should select CSR from dropdown', () => {
    component.ngOnInit();

    component.onCSRSelection(UpdateClientConstants.SEARCH_TEAM_MEMBERS[0]._id);

    expect(component.addNewClientForm.value.serviceRepresentative.id).toEqual(UpdateClientConstants.SEARCH_TEAM_MEMBERS[0]._id);
    expect(component.addNewClientForm.value.serviceRepresentative.name).toEqual(UpdateClientConstants.SEARCH_TEAM_MEMBERS_NAME);
  });

  it('should get client members', () => {
    component.setClientRep();

    expect(component.clientRep[0].name).toEqual(UpdateClientConstants.SEARCH_TEAM_MEMBERS_NAME);
    expect(component.clientRep[0]._id).toBe(UpdateClientConstants.SEARCH_TEAM_MEMBERS[0]._id);
  });

  it('should return error for get client members', () => {
    jest
    .spyOn(component['_teamService'], 'searchTeamMembers')
    .mockImplementation(() => throwError(UpdateClientConstants.CREATE_CLIENT_ERROR_RESPONSE));

    const openSnackBarSpy = jest
      .spyOn(component['_sharedService'], 'openErrorSnackBar')
      .mockImplementation();

    component.setClientRep();
    expect(openSnackBarSpy).toHaveBeenCalledWith(UpdateClientConstants.CREATE_CLIENT_ERROR_RESPONSE);
  });

  it('should create client rep with success', () => {
    const name = "test";
    component.addNewClientForm.patchValue(UpdateClientConstants.ADD_CLIENT_DATA);
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, 1);
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.FIRST_NAME, name);
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.LAST_NAME, name);

    const openSuccessSnackBar = jest
    .spyOn(component['_sharedService'], 'openSuccessSnackBar')
    .mockImplementation(() => of(UpdateClientConstants.CLIENT_RESPONSE_DATA));

    component.createClient();

    expect(openSuccessSnackBar).toHaveBeenCalledWith(UpdateClientConstants.CREATE_CLIENT_RESPONSE);
  });

  it('should result in error while creating client', () => {
    component.addNewClientForm.patchValue(UpdateClientConstants.ADD_CLIENT_DATA);

    jest
    .spyOn(component['_teamService'], 'createClient')
    .mockImplementation(() => throwError(UpdateClientConstants.CREATE_CLIENT_ERROR_RESPONSE));

    const openSnackBarSpy = jest
      .spyOn(component['_sharedService'], 'openErrorSnackBar')
      .mockImplementation();

    component.createClient();
    expect(openSnackBarSpy).toHaveBeenCalledWith(UpdateClientConstants.CREATE_CLIENT_ERROR_RESPONSE);
  });

  it('modal close', () => {
    let spy = jest.spyOn(component['dialogRef'], 'close');
    jest.spyOn(component, 'createClient');
    component['client'] = null;

    component.addNewClientForm.patchValue(UpdateClientConstants.ADD_CLIENT_DATA);
    component.closePopup(true);

    expect(spy).toHaveBeenCalledWith(true);
    expect(component.createClient).toHaveBeenCalled();

    component.closePopup(false);
    expect(spy).toHaveBeenCalled();
  });
});
