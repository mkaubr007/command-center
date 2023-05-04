import { Component } from '@angular/core';
import { ErrorService } from '../errors-tab/error.service';
@Component({
  selector: 'app-error-filter-display',
  templateUrl: './error-filter-display.component.html',
  styleUrls: ['./error-filter-display.component.scss'],
})
export class ErrorFilterDisplayComponent {
  public isTooltipVisible = false;

  constructor(public errorService: ErrorService) {}

  public filterDeSelection(
    index: number,
    key: string,
    value: string,
    filterKey: string = null
  ): void {
    this.errorService.filterSelection[key].splice(index, 1);
    filterKey = filterKey ? filterKey : key;
    const filterDataIndex = this.errorService.filterListData[
      filterKey
    ].findIndex((x: { name: string }) => x.name == value);
    if (this.errorService.filterListData[filterKey][filterDataIndex]) {
      this.errorService.filterListData[filterKey][
        filterDataIndex
      ].selected = false;
    }
    this.errorService.getErrorsByFilter.next(true);
  }

  public showTooltip(): void {
    this.isTooltipVisible = !this.isTooltipVisible;
  }

  public stopPropagation(event?: MouseEvent): void {
    event.stopPropagation();
  }
}
