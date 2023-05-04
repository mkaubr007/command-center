import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProcessTab } from '../../shared/enums/process-tab.enum';
import { ProcessUrlTab } from '../../shared/enums/teams-tab.enum';
import { ITab } from '../../shared/interface/tab.interface';

@Component({
  selector: 'app-process-schedular',
  templateUrl: './process-schedular.component.html',
  styleUrls: ['./process-schedular.component.scss']
})
export class ProcessSchedularComponent implements OnInit {

  public activeTab: ProcessUrlTab;
  public activeTabIndex: number = 0;
  public tabRef = ProcessUrlTab;
  
  public tabsName: ITab[] = [
    { key: ProcessUrlTab.PROCESS_GROUP, label: ProcessTab.PROCESS_GROUP_TAB },
    { key: ProcessUrlTab.PROCESS, label: ProcessTab.PROCESSES_TAB },
    { key: ProcessUrlTab.ARGUMENT, label: ProcessTab.ARGUMENT_TAB },
  ];

  constructor(private _route: ActivatedRoute){

  }

  ngOnInit() {
    this._route.queryParamMap.subscribe((params) => {
      this.activeTab = <ProcessUrlTab>params.get('_tab');
      this.activeTabIndex = Object.values(ProcessUrlTab).indexOf(this.activeTab);
    });
  }

  public onTabChange(index: number): void {

  }

}
