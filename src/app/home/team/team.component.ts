import {AfterViewInit, ChangeDetectorRef, Component,ElementRef, OnInit,Renderer2, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {WalkthroughFirst,WalkthroughFive, WalkthroughFour, WalkthroughSecond,WalkthroughThird} from 'src/app/shared/enums/walkthrough.enum';
import { AuthService } from '../../auth/auth.service';
import { CssConstant } from '../../core/constants/css.constant';
import { TeamsUrlTab } from '../../shared/enums/teams-tab.enum';
import {
  SetWalkthroughVisible, Walkthrough
} from '../../shared/models/walkthrough/walkthrough.model';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit, AfterViewInit {
  public activeTab: TeamsUrlTab;
  public teamsTabRef = TeamsUrlTab;
  public walkthroughdata: Walkthrough;
  public isWalkthroughVisible: boolean;
  public isSkipped = false;
  public isMemberAdded: boolean;

  @ViewChild('mainContainer') mainContainer: ElementRef;
  @ViewChild('appWalkthrough') appWalkthrough: ElementRef;

  constructor(
    private _cd: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _renderer: Renderer2,
    private _homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.isSkipped = this._homeService.isWalkthroughSkipped;
    this.checkUrl();
    this.closeWalkthroughWhenClickedOutside();
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

  public getTotalLength(listLength: number): void {
    if (this._authService.isFirstLogin && !listLength) {
      this.isWalkthroughVisible = true;
      this.createWalkthrough(this.activeTab);
    }
  }

  private checkUrl(): void {
    this._route.queryParamMap.subscribe((params) => {
      this.activeTab = <TeamsUrlTab>params.get('_tab');
    });
  }

  ngAfterViewInit(): void {
    this._cd.detectChanges();
  }

  public getWalkthroughData(event: SetWalkthroughVisible): void {
    this.isSkipped = this._homeService.isWalkthroughSkipped;
    if (this._authService.isFirstLogin && !event?.isMemberAdded) {
      this.isWalkthroughVisible = true;
      if (event?.stepper === 2) {
        this.walkthroughdata = WalkthroughSecond;
      } else if (event?.stepper === 4) {
        this.walkthroughdata = WalkthroughFour;
      } else if (event?.stepper === 5) {
        this.walkthroughdata = WalkthroughFive;
      }
    }
  }

  public toggleWalkthrough(event: boolean): void {
    this._homeService.isWalkthroughSkipped = this.isSkipped = !event;
  }

  public createWalkthrough(activeTab: TeamsUrlTab): void {
    switch (activeTab) {
      case TeamsUrlTab.CLIENT:
        this.walkthroughdata = WalkthroughThird;
        break;

      case TeamsUrlTab.TEAMS:
        this.walkthroughdata = WalkthroughFirst;
        break;

      case TeamsUrlTab.ROLES:
        this.isWalkthroughVisible = false;
        break;
    }
  }
}
