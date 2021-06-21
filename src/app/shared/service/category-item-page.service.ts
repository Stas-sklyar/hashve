import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {forkJoin, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CategoryService} from './category.service';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {map, share} from 'rxjs/operators';
import {isPlatformServer} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CategoryItemPageService implements Resolve<any> {
  private categoryData = {};
  private observable = {};

  constructor(private http: HttpClient, private categoryService: CategoryService, private transferState: TransferState, @Inject(PLATFORM_ID) private platformId) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const categoryName = route.params.categoryName;
    let url: string = `${environment.apihost}${environment.items}/${encodeURIComponent(categoryName)}`;
    const KEY = makeStateKey<any>('category-' + encodeURIComponent(categoryName));
    if (this.transferState.hasKey(KEY)) {
      this.categoryData[categoryName] = this.transferState.get(KEY, null);
      this.transferState.remove(KEY);
    }
    if (this.categoryData[categoryName]) {
      return forkJoin([of(this.categoryData[categoryName]), this.categoryService.getCategoriesWithoutLogin()]);
    } else if (this.observable[categoryName]) {
      return forkJoin([this.observable[categoryName], this.categoryService.getCategoriesWithoutLogin()]);
    } else {
      this.observable[categoryName] = this.http.get(url, {
        observe: 'response'
      }).pipe(map(response => {
        this.observable[categoryName] = null;
        if (response.status === 400) {
          return 'Request Filed';
        } else if (response.status === 200) {
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(KEY, (response.body as any));
          }
          this.categoryData[categoryName] = (response.body as any);
          return this.categoryData[categoryName];
        }
      }), share());
      return forkJoin([this.observable[categoryName], this.categoryService.getCategoriesWithoutLogin()]);
    }
  }
}
