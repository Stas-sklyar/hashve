import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryPageService implements Resolve<any> {

  constructor(private http: HttpClient, private arouter: ActivatedRoute) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const id: string = route.params.id;
    if (id.toLowerCase() === 'true' || id.toLowerCase() === 'false') {
      return id.toLowerCase();
    } else {
      const url = environment.apihost + environment.orderEndpoint + (id ? `/history/${id}` : '/history');
      return this.http.get(url);
    }
  }
}
