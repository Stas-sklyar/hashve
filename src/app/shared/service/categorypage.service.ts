import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {CategoryService} from './category.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryPageService implements Resolve<any>{

  constructor(protected categoryService: CategoryService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.categoryService.getCategoriesWithoutLogin();
  }
}
