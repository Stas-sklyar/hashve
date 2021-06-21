import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { map, share } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StoreInCityPageService implements Resolve<any> {
  cityCache: any = {};
  observable: any = {};
  constructor(private http: HttpClient, private transferState: TransferState, @Inject(PLATFORM_ID) private platformId) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const city = route.params.city;
    const KEY = makeStateKey<any>('city-' + city);
    if (this.transferState.hasKey(KEY)) {
      this.cityCache[KEY] = this.transferState.get(KEY, null);
      this.transferState.remove(KEY);
    }
    if (this.cityCache[KEY]) {
      return of(this.cityCache[KEY]);
    } else if (this.observable && this.observable[KEY]) {
      return this.observable[KEY];
    } else {
      if (!this.observable) { this.observable = {}; }
      this.observable[KEY] = this.http.get(environment.apihost + environment.shopList + `?city=${encodeURIComponent(city)}`, {
        observe: 'response'
      }).pipe(map(response => {
        this.observable = null;
        if (response.status === 400) {
          return 'Request filed';
        } else if (response.status === 200) {
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(KEY, (response.body as any));
          }
          this.cityCache[KEY] = response.body;
          return this.cityCache[KEY];
        }
      }), share());

      return this.observable[KEY];
    }
  }
}
