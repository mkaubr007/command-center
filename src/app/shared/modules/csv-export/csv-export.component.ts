
import {  Component, Input } from '@angular/core';
import { CsvExportService } from './csv-export.service';

@Component({
  selector: 'app-csv-export',
  templateUrl: './csv-export.component.html',
})
export class CsvExportComponent{
  @Input() query: any;
  @Input() url = '/error-details/export';
  @Input() fileName = 'COMMAND_CENTER_ERRORS';

  public btnDisable = false;

  constructor(private csvExportService: CsvExportService) { }

  public export(): void {
    this.btnDisable = true;
    const extractSub$ = this.csvExportService.exportCsv(JSON.stringify(this.query), this.url, this.fileName).subscribe(
      extract => {
        this.btnDisable = false;
        extractSub$.unsubscribe();
      },
      err => {
        this.btnDisable = false;
        extractSub$.unsubscribe();
      }
    );
  }
}
