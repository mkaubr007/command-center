import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Popup } from '../../../../shared/models/popup/popup.model';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss'],
})
export class ConfirmPopupComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Popup
  ) {}

  ngOnInit(): void {}

  closePopup() {
    this.dialogRef.close('login');
  }
}
