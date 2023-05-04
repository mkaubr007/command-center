import { Component, OnInit, Injector } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { cloneDeep, difference } from 'lodash';
import { Popup } from '../../../../../shared/models/popup/popup.model';
import { MessageConstant } from '../../../../../core/constants/message.constant';
import { TeamService } from '../../../team.service';
import { SharedService } from '../../../../../shared/shared.service';
import { EnvironmentService } from '../../../../../shared/enums/environ-services.enum';
import {
  IService,
  IClient,
  IEnvironments,
  IServiceResponse,
  IcheckInTimeInterval,
} from '../../../../../shared/models/client-service-rep/client-service-rep';
import { ITab } from '../../../../../shared/interface/tab.interface';
import { Service } from '../../../../../shared/models/service/service.model';
import { LocalStorageConstants } from '../../../../../core/constants/local-storage.constants';
import { ServiceHealth } from '../../../../../shared/enums/service-health.enum';
import { SocketService } from '../../../../shared-home/services/socket/socket.service';

@Component({
  selector: 'app-add-and-update-environment-service',
  templateUrl: './add-and-update-environment-service.component.html',
  styleUrls: ['./add-and-update-environment-service.component.scss'],
})
export class AddAndUpdateEnvironmentServiceComponent implements OnInit {
  public dialogRef = null;
  public data: Popup;
  public messageConstantRef = MessageConstant;
  public addNewEnumRef = EnvironmentService;
  public toggleValue: boolean;
  public addUpdateEnvForm: FormGroup;
  public serviceForm: FormGroup;
  public showTabs = false;
  public services: IService[];
  public tabsName: ITab[] = [
    { label: EnvironmentService.ENVIRONMENT },
    { label: EnvironmentService.SERVICE },
  ];
  public selectedTab = 0;
  public isEnvExist = false;
  public isServiceExist = false;
  public client: IClient;
  public isLoading = false;
  private newServiceSelcted: boolean;
  public envToUpdate: IEnvironments;
  private previouslySelectedServices: string[] = [];
  public selectedServices: IService[] = [];
  private selectedEnvironment: number[] = [];
  public timeUnits = ['Days', 'Hours', 'Minutes'];
  public isUnitRequired = false;

  constructor(
    private _injector: Injector,
    private _fb: FormBuilder,
    private _teamService: TeamService,
    private _socketService: SocketService,
    private _sharedService: SharedService
  ) {
    this.dialogRef = this._injector.get(MatDialogRef, null);
    this.data = this._injector.get(MAT_DIALOG_DATA, null);
  }

  ngOnInit(): void {
    this.client = cloneDeep(this.data['client']);
    this.envToUpdate = cloneDeep(this.data['environment']);
    this.services = this.data['services'];
    this.initAddUpdateEnvForm();
    this.initServiceForm();
    if(this.envToUpdate) {
      this.isEnvExist = true;
      this.getSelectedServices();
    }
  }

  private getSelectedServices(): void {
    this.envToUpdate.services.forEach(service => {
      const selectedService = this.services.find(serv => serv._id === service.id);
      if(selectedService) {
        this.selectedServices.push(selectedService);
        this.previouslySelectedServices.push(selectedService.name);
      }
    });
    if(this.selectedServices.length) {
      this.onServiceSelection(this.selectedServices);
    }
  }

  private initAddUpdateEnvForm(): void {
    this.addUpdateEnvForm = this._fb.group({
      name: [this.envToUpdate ? this.envToUpdate.name : null, [Validators.required]],
      isPrioritized: [this.envToUpdate ? this.envToUpdate.isPrioritized : false],
      status: [MessageConstant.ACTIVE],
      services: this._fb.array([]),
    });
    if(this.envToUpdate) this.addUpdateEnvForm.get('name').disable();
  }

  private initServiceForm(): void {
    this.serviceForm = this._fb.group({
      name: [null, [Validators.required]],
      createdBy: [null],
      description: [null],
      type: [null],
      checkInTimeInterval: this.getCheckInTimeForm(),
    });
  }

  private getCheckInTimeForm(): FormGroup {
    return this._fb.group({
      time: [null],
      unit: [null],
    });
  }

  public onCloseEnvPopup(event?: boolean): void {
    if (event) {
      this.isLoading = true;
      this.checkForNewService();
    } else {
      this.dialogRef.close(false);
    }
  }

  public isTabVisible(): void {
    this.showTabs = !this.showTabs;
    this.selectedTab = 1;
  }

  public getSelectedTab(event: number): void {
    this.showTabs = (event !== 0);
    this.selectedTab = event;
  }


  public onServiceSelection(event: IService[]): void {
    this.selectedServices = event;
    (this.addUpdateEnvForm.get('services') as FormArray).clear();
    if (event.length) {
      event.forEach(({ _id = '', name, checkInTimeInterval }) => {
        (this.addUpdateEnvForm.get('services') as FormArray).push(
          new FormControl({
            id: _id,
            name,
            checkInTimeInterval,
            status:
              checkInTimeInterval && checkInTimeInterval.time
                ? ServiceHealth.WAITING
                : ServiceHealth.NOT_SET,
          })
        );

        this.newServiceSelcted = !_id;
      });
    }
  }

  private checkForNewService(): void {
    if (this.serviceForm.valid && !this.isServiceExist) {
      this.addService().subscribe(({ data }) => {
        this.mapEnvAndService(data);
        this.updateClient();
      });
    } else {
      if(this.envToUpdate) {
        this.updateEnvironment();
        this.updateClient();
      } else {
        this.addEnvironment(this.addUpdateEnvForm.value);
      }
    }
  }

  private updateEnvironment(): void {
    let envToUpdate: IEnvironments = this.addUpdateEnvForm.value;
    envToUpdate.name = this.envToUpdate.name;
    const envIndex = this.client.environments.findIndex(env => env._id === this.envToUpdate._id);
    if(envIndex !== -1) {
      this.client.environments[envIndex] = envToUpdate;
      this.client.environments[envIndex]._id = this.envToUpdate._id;
    }
  }

  private addEnvironment(environment: IEnvironments): void {
    if (!environment.isPrioritized) {
      environment.isPrioritized = false;
    }
    let activatedClientEnv = {
      clients: "",
      environments: [environment.name],
      services: environment.services.map(service => service.name)
    };
    this._teamService.addEnvironment(environment, this.client._id).subscribe(
      (response) => {
        this._socketService.emitActivatedClient(activatedClientEnv);
        this._sharedService.openSuccessSnackBar(response);
        this.isLoading = false;
        this.dialogRef.close(true);
      },
      (error) => {
        this.isLoading = false;
        this._sharedService.openErrorSnackBar(error);
      }
    );
  }

  private mapEnvAndService(service: IService): void {
    if (this.addUpdateEnvForm.valid && !this.isEnvExist) {
      const envObject = this.addUpdateEnvForm.value;
      const lastIndex = this.client.environments.length - 1;
      if (this.newServiceSelcted) {
        const i = envObject.services.length - 1;
        if (!this.selectedEnvironment.includes(lastIndex)) {
          envObject.services[i] = this.mapClientService(service);
        } else {
          envObject.services.splice(i, 1);
        }
      }
      this.client.environments[lastIndex] = envObject;
    }
    if (this.selectedEnvironment.length) {
      this.selectedEnvironment.forEach((index) => {
        if(this.envToUpdate && (this.envToUpdate.name === this.client.environments[index].name)) {
          this.updateEnvironment();
        }
        this.client.environments[index].services.push(
          this.mapClientService(service)
        );
      });
    }
  }

  private updateClient(): void {
    this._teamService.updateClient(this.client._id, this.client).subscribe(
      (result) => {
        this.isLoading = false;
        if(this.envToUpdate) {
          this.addOrRemoveService();
        }
        this.dialogRef.close(true);
        this._sharedService.openSuccessSnackBar(result);
      },
      (error) => {
        this.isLoading = false;
        this._sharedService.openErrorSnackBar(error);
      }
    );
  }

  private addOrRemoveService(): void {
    if(this.previouslySelectedServices.length > this.envToUpdate.services.length) {
      const serviceToRemove = difference(this.previouslySelectedServices, this.envToUpdate.services.map(service => service.name));
      this.removeServiceViaSocket(serviceToRemove);
    } else {
      const serviceToAdd = difference(this.envToUpdate.services.map(service => service.name), this.previouslySelectedServices);
      this.addServiceViaSocket(serviceToAdd); 
    }
  }

  private removeServiceViaSocket(services: string[]): void {
    let service = {
      clients: "",
      environments: [],
      services
    };
    this._socketService.emitDeactivatedClient(service);
  }

  private addServiceViaSocket(services: string[]): void {
    let service = {
      clients: "",
      environments: [],
      services
    };
    this._socketService.emitActivatedClient(service);
  }



  public onCloseServicePopup(event?: boolean): void {
    if (event) {
      this.isLoading = true;
      this.checkForNewEnvironment();
    } else {
      this.dialogRef.close(false);
    }
  }

  private newServiceObject(): Service {
    const service: IService = {
      name: this.serviceForm.value.name as string,
      createdBy: {
        id: localStorage.getItem(LocalStorageConstants.USER_ID),
        name: `${localStorage.getItem(
          LocalStorageConstants.FIRST_NAME
        )} ${localStorage.getItem(LocalStorageConstants.LAST_NAME)}`,
      },
      createdDate: new Date(),
      checkInTimeInterval: this.getcheckInTimeInterval(
        this.serviceForm.value.checkInTimeInterval
      ),
    };
    return service;
  }

  private getcheckInTimeInterval({
    time,
    unit,
  }: IcheckInTimeInterval): IcheckInTimeInterval {
    if (time && unit) {
      switch (unit) {
        case 'Minutes':
          return { time: +time, unit };
        case 'Hours':
          return { time: 60 * +time, unit };
        case 'Days':
          return { time: 24 * 60 * +time, unit };
      }
    }
  }

  private checkForNewEnvironment(): void {
    this.addService().subscribe(
      (response) => {
        if (this.addUpdateEnvForm.valid || this.selectedEnvironment.length) {
          this.mapEnvAndService(response.data);
          this.updateClient();
        } else {
          this.isLoading = false;
          this.dialogRef.close(true);
          this._sharedService.openSuccessSnackBar(response);
        }
      },
      (error) => {
        this.isLoading = false;
        this._sharedService.openErrorSnackBar(error);
      }
    );
  }

  private addService(): Observable<IServiceResponse> {
    const service: Service = this.newServiceObject();
    return this._teamService.createService(service);
  }

  private mapClientService(service: IService): IService {
    const serviceObj = {
      id: service._id,
      name: service.name,
      checkInTimeInterval: {
        time: service.checkInTimeInterval
          ? service.checkInTimeInterval.time
          : null,
        unit: service.checkInTimeInterval
          ? service.checkInTimeInterval.unit
          : '',
      },
      status:
        service.checkInTimeInterval && service.checkInTimeInterval.time
          ? ServiceHealth.WAITING
          : ServiceHealth.NOT_SET,
    };
    return serviceObj;
  }

  public onEnvironmentInput(event: string): void {
    const isExist = this.client.environments.find(
      (env) => env._id && env.name.toLowerCase() === event.trim().toLowerCase()
    );
    const lastIndex = this.client.environments.length - 1;
    if (isExist) {
      this.isEnvExist = true;
      if (!this.client.environments[lastIndex]._id) {
        this.client.environments.splice(lastIndex, 1);
      }
    } else {
      this.isEnvExist = false;
      const envObject = {
        name: event.trim(),
        isPrioritized: this.addUpdateEnvForm.get('isPrioritized').value,
        services: [],
        status: MessageConstant.ACTIVE
      };
      if (
        event &&
        this.client.environments.length &&
        !this.client.environments[lastIndex]._id
      ) {
        this.client.environments[lastIndex] = envObject;
      } else if (event) {
        this.client.environments.push(envObject);
      } else if (!this.client.environments[lastIndex]._id) {
        this.client.environments.splice(lastIndex, 1);
      }
    }
  }

  public onServiceInput(event: string): void {
    const isExist = this.services.find(
      (service) => service._id && service.name.toLowerCase() === event.trim().toLowerCase()
    );
    const lastIndex = this.services.length - 1;
    if (this.newServiceSelcted) {
      (this.addUpdateEnvForm.get('services') as FormArray).removeAt(
        this.addUpdateEnvForm.get('services').value.length - 1
      );
      this.newServiceSelcted = false;
    }
    if (isExist) {
      this.isServiceExist = true;
      if (!this.services[lastIndex]._id) {
        this.services.splice(lastIndex, 1);
      }
    } else {
      this.isServiceExist = false;
      const serviceObj = {
        name: event.trim(),
      };
      if (event && this.services.length && !this.services[lastIndex]._id) {
        this.services[lastIndex] = serviceObj;
      } else if (event) {
        this.services.push(serviceObj);
      } else if (!this.services[lastIndex]._id) {
        this.services.splice(lastIndex, 1);
      }
    }
  }

  public onSelectEnvironment(event: boolean, index: number): void {
    if (event) {
      this.selectedEnvironment.push(index);
    } else {
      this.selectedEnvironment.splice(
        this.selectedEnvironment.findIndex((i) => i === index),
        1
      );
    }
  }

  public onCheckInTimeInput(event: string): void {
    if (event) {
      this.isUnitRequired = true;
    } else {
      this.isUnitRequired = false;
    }
  }
}
