import { Component, OnInit, Inject } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';
import { StatusCode } from '../../../../shared/enums/status-code.enum';
import {
  Success,
  IErrorResponse,
} from '../../../../shared/models/error/error.interface';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss'],
})
export class SnackBarComponent implements OnInit {
  error = StatusCode.ERROR_CODE_SERIES;
  success = StatusCode.SUCCESS_CODE_SERIES;
  constructor(
    public snackBarRef: MatSnackBarRef<SnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: IErrorResponse | Success
  ) {}

  ngOnInit(): void {}
}
