import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstants } from 'src/app/core/constants/route.constants';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  public redirectToHomePage(): void {
    this.router.navigate([RouteConstants.LOGIN]);
  }
}
