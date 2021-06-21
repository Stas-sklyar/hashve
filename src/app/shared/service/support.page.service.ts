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
export class SupportPageService implements Resolve<any> {
  constructor(private http: HttpClient) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {

    const terms = this.http.get(
      environment.apihost + environment.articleSupport + ArticleType.terms
    );
    const low = this.http.get(
      environment.apihost + environment.articleSupport + ArticleType.usingLow
    );
    const faq = this.http.get(
      environment.apihost + environment.articleSupport + ArticleType.faq
    );
    const last = this.http.get(environment.apihost + environment.articleLast).toPromise();
    return forkJoin([terms, low, faq, last]);
  }
}
