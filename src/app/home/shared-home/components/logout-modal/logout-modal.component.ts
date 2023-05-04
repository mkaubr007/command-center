import { Component, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeletePopup } from '../../../../shared/models/popup/delet-popup.model';

@Component({
  selector: 'app-logout-modal',
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.scss'],
})
export class LogoutModalComponent {
  public dialogRef = null;
  public data: DeletePopup;

  constructor(private _injector: Injector) {
    this.dialogRef = this._injector.get(MatDialogRef, null);
    this.data = this._injector.get(MAT_DIALOG_DATA, null);
  }
  
  public closePopup(event?: boolean): void {
    if (event) {
      this.dialogRef.close(event);
    } else {
      this.dialogRef.close();
    }
  }
}
