import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { makeStateKey, TransferState } from "@angular/platform-browser";
import { map, share } from "rxjs/operators";
import { isPlatformServer } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class ShopListService implements Resolve<any> {
  regionCache: any = {};
  observable: any = {};

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const region = route.params.region;
    const KEY = makeStateKey<any>("region-" + region ? region : "tmp");
    if (this.transferState.hasKey(KEY)) {
      this.regionCache[KEY] = this.transferState.get(KEY, null);
      this.transferState.remove(KEY);
    }
    if (region) {
      if (this.regionCache && this.regionCache[KEY]) {
        return of(this.regionCache[KEY]);
      } else if (this.observable && this.observable[KEY]) {
        return this.observable[KEY];
      } else {
        this.observable[KEY] = this.http
          .get(
            environment.apihost +
              environment.shopList +
              `?region=${encodeURIComponent(region)}`,
            {
              observe: "response",
            }
          )
          .pipe(
            map((response) => {
              this.observable = {};
              if (response.status === 400) {
                return "Request filed";
              } else if (response.status === 200) {
                if (isPlatformServer(this.platformId)) {
                  this.transferState.set(KEY, response.body as any);
                }
                this.regionCache[KEY] = response.body;
                return this.regionCache[KEY];
              }
            }),
            share()
          );

        return this.observable[KEY];
      }
    } else {
      if (this.regionCache && this.regionCache[KEY]) {
        return of(this.regionCache[KEY]);
      } else if (this.observable && this.observable[KEY]) {
        return this.observable[KEY];
      } else {
        this.observable[KEY] = this.http
          .get(environment.apihost + environment.shopList, {
            observe: "response",
          })
          .pipe(
            map((response) => {
              this.observable = {};
              if (response.status === 400) {
                return "Request filed";
              } else if (response.status === 200) {
                if (isPlatformServer(this.platformId)) {
                  this.transferState.set(KEY, response.body as any);
                }
                this.regionCache[KEY] = response.body;
                return this.regionCache[KEY];
              }
            }),
            share()
          );

        return this.observable[KEY];
      }
    }
  }
}
