import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from './base/service.base';
import {ICity} from '../../business/interfaces/ICity';
import {environment} from '../../../environments/environment';
import {City} from '../../business/model/city.model';
import {from, Observable, of} from 'rxjs';
import {map, share} from 'rxjs/operators';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {isPlatformServer} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CityService extends BaseService<ICity> {
  cityCache: any;
  observable: any;
  constructor(private http: HttpClient, private transferState: TransferState, @Inject(PLATFORM_ID) private platformId) {
    super(http, environment.apihost, environment.cityEndpoint);
  }

  getCitiesWithoutLogin(): Observable<any>{
    const KEY = makeStateKey<any>('all-cities');
    if(this.transferState.hasKey(KEY)){
      this.cityCache = this.transferState.get(KEY, null);
      this.transferState.remove(KEY);
    }
    if(this.cityCache){
      return of(this.cityCache);
    }else if(this.observable){
      return this.observable;
    }else{
      this.observable = this.http.get(environment.apihost + environment.cityWithoutLogin, {
        observe: 'response'
      }).pipe(map(response => {
        this.observable = null;
        if(response.status === 400){
          return 'Request filed';
        }else if(response.status === 200){
          if(isPlatformServer(this.platformId)){
            this.transferState.set(KEY, (response.body as any));
          }
          this.cityCache = response.body;
          return this.cityCache;
        }
      }), share());

      return this.observable;
    }
  }
}
