import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SnackBarComponent } from '../home/shared-home/components/snack-bar/snack-bar.component';
import { IErrorResponse } from './models/error/error.interface';
import { ApiResponse } from './models/util/api-response';

@Injectable()
export class SharedService {
  @BlockUI() blockUI: NgBlockUI;

  constructor(private snackBar: MatSnackBar) {}

  public openErrorSnackBar(errorObj: IErrorResponse): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: errorObj,
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  public openSuccessSnackBar(successObj: ApiResponse<any>): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: successObj,
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  public startBlockUI(): void {
    this.blockUI.start();
  }

  public stopBlockUI(): void {
    setTimeout(() => {
      this.blockUI.stop();
    });
  }

  public sucessToaster(message: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: { message, class: 'toaster' },
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'toaster-snackbar',
    });
  }
}
