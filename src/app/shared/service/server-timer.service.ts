import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ServerTimerService {

  constructor(private http: HttpClient) {
    this.loadTime();
  }

  get currentDate(): Date { return this._currentDate; }
  private _currentDate = new Date();
  timeOver = false;
  private tikTakInterval: any;

  private getServerTime(): Observable<Date> {
    return this.http.get(environment.apihost + environment.eventEndpoint + '/ping').pipe(map(data => (data as any).data));
    return of(new Date()); // call server time
  }

  loadTime(): void {
    this.getServerTime().subscribe((date: Date) => {
      this._currentDate = new Date(date);
      this.tikTak();
    }, err => {
      this._currentDate = new Date();
      this.tikTak();
    });
  }

  tikTak(): void {
    this.tikTakInterval = setInterval(() => {
      this._currentDate.setSeconds(this._currentDate.getSeconds() + 1);
    }, 1000);
  }
}
