import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-empty-screen',
  templateUrl: './empty-screen.component.html',
  styleUrls: ['./empty-screen.component.scss']
})
export class EmptyScreenComponent implements OnInit {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() emptyImg: string;

  constructor() {}

  ngOnInit(): void {}
}
