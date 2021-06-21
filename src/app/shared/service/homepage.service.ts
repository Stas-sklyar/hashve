import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { forkJoin, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CityService } from "./city.service";
import { ConfigService } from "./config.service";
import { CategoryService } from "./category.service";

@Injectable({
  providedIn: "root",
})
export class HomepageService implements Resolve<any> {
  constructor(
    private http: HttpClient,
    private cityService: CityService,
    private categoryService: CategoryService,
    private configService: ConfigService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    let homepage = this.http.get(
      environment.apihost + environment.homeEndpoint
    );
    let city = this.cityService.getCitiesWithoutLogin();
    let category = this.categoryService.getCategoriesWithoutLogin();
    let config = this.configService.getActiveSlider();
    let banners = this.configService.getActiveBannerHomepage();

    return forkJoin(homepage, city, category, config, banners);
  }
}
