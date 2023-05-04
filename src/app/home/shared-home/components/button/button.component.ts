import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements OnInit {
  @Input() btnTitle: string;
  @Output() isBtnClicked = new EventEmitter();
  @Input() disabled: boolean;
  
  constructor() {}

  ngOnInit(): void {}

  public onClick() {
    this.isBtnClicked.emit(true);
  }
}
