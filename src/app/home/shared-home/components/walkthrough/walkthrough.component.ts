import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LocalStorageConstants } from '../../../../core/constants/local-storage.constants';
import { RoleConstants } from '../../../../core/constants/role.constant';
import { Walkthrough } from '../../../../shared/models/walkthrough/walkthrough.model';

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.component.html',
  styleUrls: ['./walkthrough.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalkthroughComponent implements OnInit {
  @Input() walkthroughdata: Walkthrough;
  @Input() onDashboard?: boolean;
  @Output() hide = new EventEmitter();
  public isAdmin = false;
  constructor() {}

  ngOnInit(): void {
    this.isAdmin = (localStorage.getItem(LocalStorageConstants.ROLE).toLowerCase() === RoleConstants.ADMIN);
  }

  closeWalkthrough() {
    this.hide.emit(false);
  }
}
