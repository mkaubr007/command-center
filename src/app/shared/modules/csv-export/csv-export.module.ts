import { NgModule } from '@angular/core';
import { CsvExportService } from './csv-export.service';
import { CsvExportComponent } from './csv-export.component';

@NgModule({
  declarations: [
    CsvExportComponent,
  ],
  providers: [
    CsvExportService
  ],
  exports: [
    CsvExportComponent,
  ]
})
export class CsvExportModule {}
