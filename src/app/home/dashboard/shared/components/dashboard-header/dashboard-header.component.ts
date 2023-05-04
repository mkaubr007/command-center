import {
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { IErrorDetailSearchFilter } from 'src/app/shared/models/error-detail/error-detail.interface';
import { MessageConstant } from '../../../../../core/constants/message.constant';
import { Daterange } from '../../../../../shared/models/date/daterange.model';
import { ErrorService } from '../errors-tab/error.service';
import { SearchFieldComponent } from './../../../../shared-home/components/search-field/search-field.component';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
})
export class DashboardHeaderComponent implements OnInit {
  @Input() selectedTab: string;
  public searchForm: FormGroup;
  public doRefresh = true;
  public isErrorFilterVisible: boolean;
  public isfilterOpen = false;
  public currentQuery: object;
  public currentSearchObservable$: Observable<IErrorDetailSearchFilter>;
  public csvDataUrl = '/error-details/export';
  public fileName = 'COMMAND_CENTER_ERRORS';

  placeholder: string = MessageConstant.SEARCH_BY_ERROR_TYPES;
  btnTitle: string = MessageConstant.EXPORT_CSV_BUTTON_TITLE;

  @ViewChild(SearchFieldComponent)
  searchFieldComponentRef: SearchFieldComponent;

  constructor(public errorService: ErrorService) {
    this.searchForm = new FormGroup({
      searchByErrorType: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.searchForm
      .get('searchByErrorType')
      .valueChanges.pipe(debounceTime(400))
      .subscribe((searchKey) => {
        this.errorService.onSearchByErrorChange(searchKey);
      });

    this.errorService.getCurrentSearch().subscribe((filter) => {
      this.currentQuery = filter;
    });
  }

  public resetForm(): void {
    this.doRefresh = false;
    this.searchForm.reset();
    this.searchFieldComponentRef.onClear();
    this.doRefresh = true;
  }

  public updateDate(dateRange: Daterange): void {
    this.errorService.setDateRange(dateRange);
  }

  public filterClick():void{
    this.isfilterOpen = !this.isfilterOpen;
  }
}
