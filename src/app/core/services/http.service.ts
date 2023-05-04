import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LocalStorageConstants } from '../constants/local-storage.constants';
import { RouteConstants } from '../constants/route.constants';
import { StatusCodeConstant } from '../constants/status-code.constant';

const HOST_URL = environment.backendBasedUrl;
@Injectable()
export class CustomHttpService {
  constructor(private http: HttpClient, private router: Router) { }

  get<T>(
    url: any,
    options?: object,
    skipAuthorization?: boolean,
    thirdPartyUrl?: string
  ): Observable<HttpResponse<Object>> {
    this.beforeRequest();
    let paramsData: HttpParams;
    let requestHeader: any;
    let responseType: 'json';

    if (options && options['responseType']) {
      responseType = options['responseType'];
      delete options['responseType'];
    }
    paramsData = options ? this.createParamData(options) : null;

    return this.http
      .get<HttpResponse<Object>>(
        thirdPartyUrl ? thirdPartyUrl : HOST_URL + url,
        {
          headers: requestHeader,
          params: paramsData,
          observe: 'response',
          responseType
        }
      )
      .pipe(
        tap((response) => {
          const token = response.headers.get(LocalStorageConstants.TOKEN);
          if (token) {
            localStorage.setItem(LocalStorageConstants.TOKEN, token);
          }
        }),
        retry(1),
        catchError((error) => this.errorHandler(error))
      );
  }

  post<T>(
    url: any,
    data?: any,
    isMultipart?: boolean,
    options?: any,
    skipAuthorization?: boolean,
    thirdPartyUrl?: string
  ): Observable<T> {
    this.beforeRequest();
    let requestHeader: any;
    return this.http
      .post<T>(thirdPartyUrl ? thirdPartyUrl : HOST_URL + url, data, {
        headers: requestHeader,
      })
      .pipe(
        tap((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  put<T>(
    url: any,
    data: any,
    thirdPartyUrl?: string,
    isMultipart?: boolean,
    params = new HttpParams()
  ): Observable<T> {
    this.beforeRequest();
    let requestHeader: any;

    return this.http
      .put<T>(thirdPartyUrl ? thirdPartyUrl : HOST_URL + url, data, {
        headers: requestHeader,
        params
      })
      .pipe(
        tap((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  patch<T>(
    url: any,
    data: any,
    isMultipart?: boolean,
    thirdPartyUrl?: string
  ): Observable<T> {
    this.beforeRequest();
    let requestHeader: any;

    return this.http
      .patch<T>(thirdPartyUrl ? thirdPartyUrl : HOST_URL + url, data, {
        headers: requestHeader,
      })
      .pipe(
        tap((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  delete<T>(url: any, options?: any): Observable<T> {
    this.beforeRequest();
    let requestHeader: any;
    return this.http
      .delete<T>(HOST_URL + url, {
        headers: requestHeader,
      })
      .pipe(
        tap((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }

  errorHandler(error: { error: any; status: any }) {
    const errorObj = error.error;

    /*Make single template for all the error*/
    switch (error.status) {
      case StatusCodeConstant.NOT_FOUND:
        this.router.navigate([`error/${StatusCodeConstant.NOT_FOUND}`], {
          skipLocationChange: true,
          replaceUrl: true,
        });
        break;
      case StatusCodeConstant.FORBIDDEN:
        this.router.navigate([`error/${StatusCodeConstant.FORBIDDEN}`], {
          skipLocationChange: true,
          replaceUrl: true,
        });
        break;
      case StatusCodeConstant.UNAUTHORIZED_ACCESS:
        this.unAuthorizedErrorHandler();
        break;
      case StatusCodeConstant.INTERNAL_ERROR:
        this.router.navigate([`error/${StatusCodeConstant.INTERNAL_ERROR}`], {
          skipLocationChange: true,
          replaceUrl: true,
        });
        break;
      case StatusCodeConstant.ERROR_IN_DATA:
        // this.router.navigate([`error/${StatusCodeConstant.ERROR_IN_DATA}`], {
        //   skipLocationChange: true,
        //   replaceUrl: true,
        // });
        break;
    }
    return throwError(errorObj);
  }

  beforeRequest() {
    if (!navigator.onLine) {
      alert('No internet connection');
    }
  }

  createParamData(data: object) {
    let params = new HttpParams();
    Object.keys(data).forEach((key) => {
      if (typeof data[key] !== undefined && data[key]) {
        params = params.append(key, data[key]);
      }
    });
    return params;
  }

  unAuthorizedErrorHandler() {
    localStorage.clear();
    this.router.navigate([RouteConstants.LOGIN], {
      queryParams: {
        unauthorized: '1',
        message: 'Please login to access the information.',
      },
    });
  }
}
