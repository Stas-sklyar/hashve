import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {map, share} from 'rxjs/operators';
import {isPlatformServer} from '@angular/common';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemResolver implements Resolve<any> {
  private itemdata = {};
  private observable = {};

  constructor(private http: HttpClient, private transferState: TransferState, @Inject(PLATFORM_ID) private platformId) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const itemName: string = route.params.itemName;
    let url: string = environment.apihost + `${environment.itemInfo}/${encodeURIComponent(itemName)}`;
    const KEY = makeStateKey<any>('item-' + encodeURIComponent(itemName));
    if (this.transferState.hasKey(KEY)) {
      this.itemdata[itemName] = this.transferState.get(KEY, null);
      this.transferState.remove(KEY);
    }
    if (this.itemdata[itemName]) {
      return of(this.itemdata[itemName]);
    } else if (this.observable[itemName]) {
      return this.observable[itemName];
    } else {
      this.observable[itemName] = this.http.get(url, {
        observe: 'response'
      }).pipe(map(response => {
        this.observable[itemName] = null;
        if (response.status === 400) {
          return 'Request Filed';
        } else if (response.status === 200) {
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(KEY, (response.body as any));
          }
          this.itemdata[itemName] = (response.body as any);
          return this.itemdata[itemName];
        }
      }), share());
      return this.observable[itemName];
    }
  }
}
