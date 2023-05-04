import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  constructor() { }

  public setLocalStorage(values: { [x: string]: any }): void {
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        localStorage.setItem(key, JSON.stringify(values[key]));
      }
    }
  }

  public setItemInLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public setItemInLocalStorageWithoutJSON(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  public getItemInLocalStorageWithoutJSON(key: string): string {
    return localStorage.getItem(key);
  }

  public getLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  public resetLocalStorage(): void {
    localStorage.clear();
  }

  public deleteLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }
}
