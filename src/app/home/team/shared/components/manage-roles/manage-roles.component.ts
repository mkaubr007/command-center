import { Component, OnInit } from '@angular/core';
import { MessageConstant } from '../../../../../core/constants/message.constant';

@Component({
  selector: 'app-manage-roles',
  templateUrl: './manage-roles.component.html',
  styleUrls: ['./manage-roles.component.scss'],
})
export class ManageRolesComponent implements OnInit {
  public messageConstants = MessageConstant;
  public totalLength = 0;

  constructor() {}

  ngOnInit(): void {}

  openPopup(event: boolean) {
  }
}
