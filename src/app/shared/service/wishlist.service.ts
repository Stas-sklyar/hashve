import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable, forkJoin } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CityService } from "./city.service";
import {AppService} from '../../app.service';
import { City } from "../../business/model/city.model";

@Injectable({
  providedIn: "root"
})
export class WishListService implements Resolve<any> {
  constructor(private http: HttpClient, private cityService: CityService, private appService: AppService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> | Promise<any> | any {
    let cityName = route.params.cityName;
    const wishes = this.http.get(environment.apihost + environment.wishList + `/${cityName}` );
    this.cityService.getCitiesWithoutLogin().subscribe((data) => {
      cityName = cityName.replace(/_/g, ' ');
      const city = data.data.find(item => item.name.heb === cityName);
      this.appService.onSelcetedCityChanged.next(city);
    });
    return forkJoin([wishes]);
  }
}
