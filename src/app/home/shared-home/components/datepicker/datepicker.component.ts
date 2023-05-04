import {Component,EventEmitter,Input,OnInit, Output,ViewChild} from '@angular/core';
import { Moment } from 'moment';
import {DaterangepickerDirective,LocaleConfig} from 'ngx-daterangepicker-material';
import { MessageConstant } from '../../../../core/constants/message.constant';
import { Daterange } from '../../../../shared/models/date/daterange.model';
const moment = require('moment').default || require('moment');

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent implements OnInit {
  moment = moment;
  calendarLocale: LocaleConfig;
  ranges = {};
  @Input() selectedRange: Daterange;
  minDate: Moment;
  maxDate: Moment;
  public isDatePickerOpen: boolean;
  @ViewChild(DaterangepickerDirective, { static: true })
  picker: DaterangepickerDirective;
  @Output() updateDateRange: EventEmitter<Daterange> = new EventEmitter<
    Daterange
  >();
  messageConstant: MessageConstant

  constructor() { }

  ngOnInit(): void {
    this.calendarLocale = {
      customRangeLabel: MessageConstant.CUSTOM_RANGE_LABEL,
      applyLabel: MessageConstant.APPLY_BUTTON,
      clearLabel: MessageConstant.CLEAR_BUTTON,
      format: 'MM/DD/YYYY hh:mm A',
      daysOfWeek: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      firstDay: 1,
    };

    this.ranges = {
      Yesterday: [
        moment().subtract(1, 'days').startOf('day'),
        moment().subtract(1, 'days').endOf('day'),
      ],
      Today: [moment().startOf('day'), moment().endOf('day')],
      'This week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
      'This month': [moment().startOf('month'), moment().endOf('month')],
    };
    this.maxDate = moment().clone().add(10, 'years');
    this.selectedRange=null;
  }

  open(): void {
    this.picker.open();
  }

  dateRangeChange(): void {
    this.updateDateRange.emit(this.selectedRange);
  }
}
