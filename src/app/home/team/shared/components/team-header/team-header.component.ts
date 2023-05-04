import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {TeamService} from "../../../team.service";

export interface Title {
  name: string;
  count: number;
}

@Component({
  selector: 'app-team-header',
  templateUrl: './team-header.component.html',
  styleUrls: ['./team-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamHeaderComponent implements OnInit {
  @Input() title: any;
  @Input() count: number;
  @Input() placeholder: string;
  @Input() btnTitle: string;
  @Output() isBtnClicked = new EventEmitter();
  @Output() cleared = new EventEmitter();
  public searchValue = '';

  constructor(public dialog: MatDialog, private _teamService: TeamService) {}
  ngOnInit(): void {}

  public onClick(): void {
    this.isBtnClicked.emit(true);
  }
  public getSearchInputValue(): void {
    if(this.searchValue) {
      this._teamService.inputValue.next(this.searchValue);
    }
  }
  public onClear($event){
   this.searchValue = '';
   this.cleared.emit($event);
  }

  public onChange(event: string): void {
    if (!event) {
      this.cleared.emit(event);
    }
  }
}
