import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductOfferService implements Resolve<any> {

  constructor(private http: HttpClient) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const packOffer: string = route.params.id;
    if(packOffer) {
      let events = this.http.get(environment.apihost + environment.eventEndpoint);
      return forkJoin([events, this.http.get(environment.apihost + environment.getOfferEndPoint + `/${packOffer}`)]);
    }
  }
}
