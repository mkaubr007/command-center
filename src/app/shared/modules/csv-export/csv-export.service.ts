import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomHttpService } from 'src/app/core/services/http.service';

const moment = require('moment').default || require('moment');

@Injectable()
export class CsvExportService {

  constructor(private http: CustomHttpService) {
  }

  public exportCsv(filter: any, url: string, fileName: string): Observable<any> {
    return this.http.get<any>(url, {filter, responseType: 'text'}).pipe(
        map((data: any) => {
          console.log(url, fileName);
          this.fileDownload(data.body, fileName);
          return data;
        })
      );
  }

  private fileDownload(data: string, fileName: string): void {
    try {
      fileName += `_${moment(new Date()).format("YYYY/DD/MM")}.csv`;
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.setAttribute('href', url);
      a.setAttribute('download', fileName);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove(); // remove the element
    } catch(err) {
      console.log(err);
    }
  }
}

