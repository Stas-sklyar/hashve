import {BaseService} from './base/service.base';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Category} from '../../business/model/category.model';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {isPlatformServer} from '@angular/common';
import {Observable, of} from 'rxjs';
import {map, share} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService<Category> {

  private categories: Category[];
  private observable: any;

  constructor(private http: HttpClient, private transferState: TransferState, @Inject(PLATFORM_ID) private platformId) {
    super(http, environment.apihost, environment.categoryEndpoint);
  }

  getCategoriesWithoutLogin(): Observable<Array<Category>> {
    const KEY = makeStateKey<any>('all-category');
    if(this.transferState.hasKey(KEY)){
      this.categories = this.transferState.get(KEY, null);
      this.transferState.remove(KEY);
    }
    if(this.categories){
      return of(this.categories);
    }else if(this.observable){
      return this.observable;
    }else{
      this.observable = this.http.get(environment.apihost + environment.categoryWithoutLogin, {
        observe: 'response'
      }).pipe(map(response => {
        this.observable = null;
        if(response.status === 400){
          return 'Request Filed';
        }else if(response.status === 200){
          if(isPlatformServer(this.platformId)){
            this.transferState.set(KEY, (response.body as any).data);
          }
          this.categories = (response.body as any).data;
          return this.categories;
        }
      }), share());
      return this.observable;
    }
  }
}
