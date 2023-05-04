import { Component, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeletePopup } from '../../../../shared/models/popup/delet-popup.model';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent {
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
