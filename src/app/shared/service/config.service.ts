import { BaseService } from "./base/service.base";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { makeStateKey, TransferState } from "@angular/platform-browser";
import { isPlatformServer } from "@angular/common";
import { Observable, of } from "rxjs";
import { map, share } from "rxjs/operators";

export enum SitePosition {
  HomePage,
  CitySearchPage,
  ProductPage,
}

@Injectable({
  providedIn: "root",
})
export class ConfigService extends BaseService<any> {
  private sliders: any = [];
  private banners: any = [];
  private config: any;
  private observable: any;

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId
  ) {
    super(http, environment.apihost, environment.config);
  }

  getConfig(): Observable<Array<any>> {
    const KEY = makeStateKey<any>("config");
    if (this.transferState.hasKey(KEY)) {
      this.config = this.transferState.get(KEY, null);
      this.transferState.remove(KEY);
    }
    if (this.config) {
      return of(this.config);
    } else if (this.observable) {
      return this.observable;
    } else {
      this.observable = this.list().pipe(
        map((configuration) => {
          this.observable = null;
          this.config = configuration;
          this.sliders = configuration.find((item) => item.key === "slides");
          this.banners = configuration.find((item) => item.key === "banners");
          if (this.sliders) {
            this.sliders = JSON.parse(this.sliders.value);
          }
        }),
        share()
      );
      return this.observable;
    }
  }

  getActiveSlider() {
    if (this.sliders.length === 0) {
      return this.getConfig().pipe(
        map((item) => {
          let activeSliders = this.sliders.filter((item) => item.active);
          return activeSliders.length > 0 ? activeSliders[0] : null;
        })
      );
    } else {
      let activeSliders = this.sliders.filter((item) => item.active);
      return of(activeSliders.length > 0 ? activeSliders[0] : null);
    }
  }

  getActiveBannerHomepage() {
    if (!this.banners || this.banners.length === 0) {
      return this.getConfig().pipe(
        map((item) => {
          // debugger;
          const tmp = this.banners.value ? JSON.parse(this.banners.value) : [];
          let banners = [];
          // debugger;
          tmp.forEach((element) => {
            if (element.active && element.position === SitePosition.HomePage) {
              banners.push(element);
            }
          });
          return banners;
        })
      );
    } else {
      const tmp = this.banners.value ? JSON.parse(this.banners.value) : [];
      let banners = [];
      // debugger;
      tmp.forEach((element) => {
        if (element.active && element.position === SitePosition.HomePage) {
          banners.push(element);
        }
      });
      return of(banners);
    }
  }

  getActiveBannerProductPage() {
    if (!this.banners || this.banners.length === 0) {
      return this.getConfig().pipe(
        map((item) => {
          // debugger;
          const tmp = this.banners.value ? JSON.parse(this.banners.value) : [];
          let banners = [];
          // debugger;
          tmp.forEach((element) => {
            if (
              element.active &&
              element.position === SitePosition.ProductPage
            ) {
              banners.push(element);
            }
          });
          return banners;
        })
      );
    } else {
      const tmp = this.banners.value ? JSON.parse(this.banners.value) : [];
      let banners = [];
      // debugger;
      tmp.forEach((element) => {
        if (element.active && element.position === SitePosition.ProductPage) {
          banners.push(element);
        }
      });
      return of(banners);
    }
  }

  getActiveBannerCitySearchPage() {
    if (!this.banners || this.banners.length === 0) {
      return this.getConfig().pipe(
        map((item) => {
          const tmp = this.banners.value ? JSON.parse(this.banners.value) : [];
          let banners = [];
          tmp.forEach((element) => {
            if (
              element.active &&
              element.position === SitePosition.CitySearchPage
            ) {
              banners.push(element);
            }
          });
          return banners;
        })
      );
    } else {
      const tmp = this.banners.value ? JSON.parse(this.banners.value) : [];
      let banners = [];
      tmp.forEach((element) => {
        if (
          element.active &&
          element.position === SitePosition.CitySearchPage
        ) {
          banners.push(element);
        }
      });
      return of(banners);
    }
  }
}
