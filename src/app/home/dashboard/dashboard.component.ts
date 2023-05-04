import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { Location } from "@angular/common";
import { Walkthrough } from '../../shared/models/walkthrough/walkthrough.model';
import { RouteConstants  } from '../../core/constants/route.constants';
import { CssConstant } from '../../core/constants/css.constant';
import { WalkthroughSix } from '../../shared/enums/walkthrough.enum';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../home.service';
import { SharedService } from '../../shared/shared.service';
import { AuthConstants } from '../../auth/test.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  public walkthroughdata: Walkthrough;
  public isWalkthroughVisible: boolean;
  public isSkipped = false;

  @ViewChild('mainContainer') mainContainer: ElementRef;
  @ViewChild('appWalkthrough') appWalkthrough: ElementRef;

  constructor(
    private _renderer: Renderer2,
    private _cd: ChangeDetectorRef,
    private _authService: AuthService,
    private _router: Router,
    private _homeService: HomeService,
    private _sharedService: SharedService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    const fragment: string = this.route.snapshot.fragment;
    if(fragment === AuthConstants.ACCESS_DENIED_FRAGMENT) {
      this._sharedService.openErrorSnackBar(AuthConstants.INVALID_ROUTE_ERROR);
      this.location.replaceState(RouteConstants.REROUTE_NO_ACCESS);
    }
  }

  ngOnInit(): void {
    this.isSkipped = this._homeService.isWalkthroughSkipped;
    this.setWalkthroughData();
  }

  ngAfterViewInit(): void {
    this._cd.detectChanges();
  }
  public setWalkthroughData(): void {
    if (
      this._authService.isFirstLogin &&
      this._router.url.includes(RouteConstants.DASHBOARD)
    ) {
      this.isWalkthroughVisible = true;
      this.walkthroughdata = WalkthroughSix;
    }
  }

  public closeWalkthroughWhenClickedOutside(): void {
    this._renderer.listen(CssConstant.WINDOW, CssConstant.CLICK, (e: Event) => {
      if (
        e.target !== this.mainContainer?.nativeElement &&
        e.target !== this.appWalkthrough?.nativeElement
      ) {
        this.isWalkthroughVisible = false;
        this._cd.detectChanges();
      }
    });
  }

  public toggleWalkthrough(event: boolean): void {
    this._homeService.isWalkthroughSkipped = !event;
  }
}
