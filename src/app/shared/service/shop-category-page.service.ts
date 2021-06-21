import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Store} from '../../business/model/store.model';
import {Category} from '../../business/model/category.model';
import {Item} from '../../business/model/item.model';
import {CategoryService} from './category.service';
/*import {StoreService} from './store.service';
import {CategoryService} from './category.service';
import {ItemService} from './item.service';*/

@Injectable({
  providedIn: 'root'
})
export class ShopCategoryPageService implements Resolve<any> {
  constructor(private http: HttpClient, private categoryService: CategoryService) { //, private storeService: StoreService, private categoryService: CategoryService, private itemService: ItemService
  }

  cacheStore: Store;
  cacheCategories: Array<Category> = [];
  cacheItems: Array<Item> = [];

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const storeLink: string = route.params.link;
    const id: string = route.params.id;
    const categoryLink: string = route.params.categoryName;
    let url1, url2, url3;
    if(storeLink){
      [url1, url2, url3] = [environment.apihost + environment.shopItem + `/${storeLink}`, environment.apihost + environment.items, environment.apihost + environment.categoryEndpoint];
    }else if(id){
      [url1, url2, url3] = [environment.apihost + environment.shopById + `/${id}`, environment.apihost + environment.items, environment.apihost + environment.categoryEndpoint];
    }

    let prom1: Promise<Store>;
    let prom2: Promise<Array<Item>>;
    let prom3: Promise<Array<Category>>;
    // console.log(url1, url2, url3);
    if (this.cacheStore !== undefined && this.cacheStore.link === storeLink) {
      prom1 = of(this.cacheStore).toPromise();
    } else {
      prom1 = <Promise<Store>>this.http.get(url1).toPromise().then(data => {
        this.cacheStore = <Store>data && data['data'].length > 0 ? data['data'][0] : data['data'];
        return this.cacheStore;
      }).catch(error => {
        // console.log(error);
      });
    }

    if (this.cacheItems !== undefined && this.cacheItems.length > 0) {
      prom2 = of(this.cacheItems).toPromise();
    } else {
      prom2 = <Promise<Array<Item>>>this.http.get(url2).toPromise().then(data => {
        this.cacheItems = <Array<Item>>data['data'];
        return this.cacheItems;
      }).catch(error => {
        // console.log(error);
      });
    }

    if (this.cacheCategories !== undefined && this.cacheCategories.length > 0) {
      prom3 = of(this.cacheCategories).toPromise();
    } else {
      prom3 = this.categoryService.getCategoriesWithoutLogin().toPromise();
    }

    return Promise.all([prom1, prom2, prom3]).then(data => {
      let res = {};
      res['storelink'] = storeLink;
      res['categorylink'] = categoryLink.replace(/_/g, ' ');
      res['store'] = data[0];
      res['items'] = data[1];
      res['categories'] = data[2];
      return res;
    }).catch(error => {
      // console.log(error, 75);
    });
  }
}
