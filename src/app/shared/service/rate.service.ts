import {BaseService} from './base/service.base';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Rate} from '../../business/model/rate.model';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RateService extends BaseService<Rate> {
  onNewData: Subject<Rate[]> = new Subject<Rate[]>();
  constructor(private http: HttpClient) {
    super(http, environment.apihost, environment.orderEndpoint);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.http.get(environment.apihost + environment.orderEndpoint + '/' + route.params.id);
  }

  getRates(type: number, id: string, offset: number, count: number): Observable<Rate[]>{
    return this.http.get<Rate[]>(environment.apihost + environment.ratePoint + `/${type}/${id}?offset=${offset}&count=${count}`);
  }
}
