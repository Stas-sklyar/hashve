import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable, forkJoin } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ArticleType } from "../../business/Enum/ArticleType";

@Injectable({
  providedIn: "root"
})
export class AddNewStoreService implements Resolve<any> {
  constructor(private http: HttpClient) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {

    const addNewStore = this.http.get(
      environment.apihost + environment.articleSupport + ArticleType.addNewStore
    );

    return forkJoin([addNewStore]);
  }
}
