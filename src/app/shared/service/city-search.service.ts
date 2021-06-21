import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {isPlatformServer} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CitySearchService implements Resolve<any> {
  dataCity: any = {};
  data: any;
  constructor(private http: HttpClient, private transferState: TransferState, @Inject(PLATFORM_ID) private platformId) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const city: string = route.params.city;
    const key = city.replace(/\s/g, '-');
    if(city){
      const CITY_KEY = makeStateKey<any>('city-search-' + city);
      console.log('CITY_KEY = ', CITY_KEY);
      console.log('hasKey(CITY_KEY) = ', this.transferState.hasKey(CITY_KEY));
      if(this.transferState.hasKey(CITY_KEY)){
        this.dataCity[city] = this.transferState.get<any>(CITY_KEY, null);
        this.transferState.remove(CITY_KEY);
      }
      if(!this.dataCity[city]){
        return this.http.get(environment.apihost + environment.citySearchEndpoint + `/${encodeURIComponent(city)}`).toPromise().then(data => {
          if(isPlatformServer(this.platformId)){
            console.log("putting data in key ", CITY_KEY)
            // console.log("putting data is = ", data)
            this.transferState.set(CITY_KEY, data);
          }
          this.dataCity[city] = data;
          return data;
        });
      }else{
        return of(this.dataCity[city]);
      }
    }else{
      const CITY_KEY = makeStateKey<any>('city-search');
      console.log('CITY_KEY = ', CITY_KEY);
      console.log('hasKey(CITY_KEY) = ', this.transferState.hasKey(CITY_KEY));
      console.log('CITY_KEY data = ', this.transferState.get<any>(CITY_KEY, null));
      if(this.transferState.hasKey(CITY_KEY)){
        this.data = this.transferState.get<any>(CITY_KEY, null);
        this.transferState.remove(CITY_KEY);
      }
      if(!this.data){
        return this.http.get(environment.apihost + environment.citySearchEndpoint).toPromise().then(data => {
          if(isPlatformServer(this.platformId)){
            this.transferState.set(CITY_KEY, data);
          }
          this.data = data;
          return data;
        });
      }else{
        return of(this.data);
      }
    }
  }
}
