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

@Injectable({
  providedIn: "root"
})
export class BusketService implements Resolve<any> {
  constructor(private http: HttpClient, private cityService: CityService, private appService: AppService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> | Promise<any> | any {
    const wishes = this.http.get(environment.apihost + environment.items );
    const q = this.http.post(environment.apihost + environment.busket, this.appService.getFullCard());

    return forkJoin([wishes, q]);
  }
}
