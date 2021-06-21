import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticleDetailService implements Resolve<any>{

  constructor(private http: HttpClient) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const linkDetailArticle: string = route.params.linkDetailArticle.replace(/_/g, ' ');

    let prom1 = this.http.get(environment.apihost + environment.articleDetail + linkDetailArticle).toPromise();
    let prom2 = this.http.get(environment.apihost + environment.articleLast).toPromise();

    return Promise.all([prom1,prom2]).then(data => {
      let res={};
      res['article'] = data[0]['data'];
      res['lastarticles'] = data[1];
      return res;
    });
  }
}
