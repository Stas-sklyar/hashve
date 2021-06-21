import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CategoryService } from "./category.service";

@Injectable({
  providedIn: "root",
})
export class ShopPageService implements Resolve<any> {
  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const storelink: string = route.params.link;
    const id: string = route.params.id;
    let url1, url2, url3;
    if (storelink) {
      [url1, url2] = [
        environment.apihost + environment.shopItem + `/${storelink}`,
        environment.apihost + environment.homeEndpoint,
      ];
    }

    if (id) {
      [url1, url2] = [
        environment.apihost + environment.shopById + `/${id}`,
        environment.apihost + environment.homeEndpoint,
      ];
    }

    let prom1 = this.http.get(url1).toPromise();
    let prom2 = this.http.get(url2).toPromise();
    let prom3 = this.categoryService.getCategoriesWithoutLogin().toPromise();
    return Promise.all([prom1, prom2, prom3]).then((data) => {
      let res = {};
      res["storelink"] = storelink;
      res["store"] = data[0]["data"][0];
      res["home"] = data[1];
      res["categories"] = data[2];
      return res;
    });
  }
}
