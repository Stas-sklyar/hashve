import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment, UrlSegmentGroup, Route, UrlMatchResult } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CitySearchComponent } from './city-search/city-search.component';
import { HomepageService } from './shared/service/homepage.service';
import { ProductOfferService } from './shared/service/product.offer.service';
import { CitySearchService } from './shared/service/city-search.service';
import { CategoryPageComponent } from './category-page/category-page.component';
import { CategoryPageService } from './shared/service/categorypage.service';
import { ProductItemComponent } from './product-item/product-item.component';
import { PaymentComponent } from './payment/payment.component';
import { RegionPageComponent } from './region-page/region-page.component';
import { RegionPageService } from './shared/service/regionpage.service';
import { RatingPageComponent } from './rating-page/rating-page.component';
import { RateService } from './shared/service/rate.service';
import { ShopListPageComponent } from './shop-list-page/shop-list-page.component';
import { ShopListService } from './shared/service/shop-list-service.service';
import { ShopPageComponent } from './shop-page/shop-page.component';
import { ShopPageService } from './shared/service/shop-page.service';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderHistoryPageService } from './shared/service/order-history-page.service';
import { ShopCategoryPageComponent } from './shop-category-page/shop-category-page.component';
import { ShopCategoryPageService } from './shared/service/shop-category-page.service';
import { ArticlesPageComponent } from './articles-page/articles-page.component';
import { ArticlesPageService } from './shared/service/articles-page.service';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleDetailService } from './shared/service/article-detail.service';
import { StoreInCityPageComponent } from './store-in-city-page/store-in-city-page.component';
import { StoreInCityPageService } from './shared/service/store-in-city-page-service';
import { SupportComponent } from './support/support.component';
import { SupportPageService } from './shared/service/support.page.service';
import { AddNewStoreComponent } from './add-new-store/addNewStore.component';
import { AddNewStoreService } from './shared/service/addNewStore.service';
import { WishListComponent } from './wishlist/wishlist.component';
import { WishListService } from './shared/service/wishlist.service';
import { BetterPriceComponent } from './better-price/better-price.component';
import { BetterPriceService } from './shared/service/better-price.service';
import { BusketComponent } from './Busket/busket.component';
import { BusketService } from './shared/service/busket.service';
import { CategoryItemsComponent } from './category-items/category-items.component';
import { CategoryItemPageService } from './shared/service/category-item-page.service';
import { ItemPageComponent } from './item-page/item-page.component';
import { ItemResolver } from './shared/service/Resolvers/item.resolver';
import { TranzilaResultComponent } from './tranzila-result/tranzila-result.component';
import { ErrorComponent } from './404/404.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CustomerService } from './shared/service/customer-service.service';
import { CustomerModuleservice } from './shared/service/Resolvers/customer-module.service';
import { UserOrdersComponent } from './user-orders/user-orders.component';


export function htmlFiles(url: UrlSegment[], segmentGroup: UrlSegmentGroup, route: Route) {
  let city: any = '';
  let tmp: string[] = [];
  if (url.length > 0 && url[0].path.startsWith('פרחים_')) {
    tmp = url[0].path.split('_');
    tmp.splice(0, 1);
    city = tmp.join(' ');
  } else {
    return null;
  }
  const result: UrlMatchResult = {
    consumed: url,
    posParams: {
      city: new UrlSegment(city, {}),
      category: new UrlSegment(url.length === 2 ? url[1].path : '', {})
    }
  };

  return result;
}

export function storeInRegion(url: UrlSegment[], segmentGroup: UrlSegmentGroup, route: Route) {
  let region: string = '';
  let tmp: string[] = [];
  if (url.length > 0 && url[0].path.startsWith('משלוחי_פרחים_')) {
    tmp = url[0].path.split('_');
    tmp.splice(0, 2);
    region = tmp.join(' ');
    region = region.substring(1, region.length);
  } else {
    return null;
  }
  const result: UrlMatchResult = {
    consumed: url,
    posParams: {
      region: new UrlSegment(region, {})
    }
  };

  return result;
}

export function storeInCity(url: UrlSegment[], segmentGroup: UrlSegmentGroup, route: Route) {
  let city: string = '';
  let tmp: string[] = [];
  if (url.length > 0 && url[0].path.startsWith('חנויות_פרחים_') && !url[0].path.startsWith('חנויות_פרחים_באזור_')) {
    tmp = url[0].path.split('_');
    tmp.splice(0, 2);
    city = tmp.join(' ');
  } else {
    return null;
  }
  const result: UrlMatchResult = {
    consumed: url,
    posParams: {
      city: new UrlSegment(city, {}),
    }
  };

  return result;
}

export function storeRoute(url: UrlSegment[], segmentGroup: UrlSegmentGroup, route: Route) {
  let city: string = '';
  let tmp: string[] = [];
  if (url.length === 1) {
    let segments = url[0].path.split('-');
    let id = Number(segments[0]);
    if (!isNaN(id)) {
      const result: UrlMatchResult = {
        consumed: url,
        posParams: {
          id: new UrlSegment(String(id), {}),
        }
      };
      return result;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export function storeCategoryRoute(url: UrlSegment[], segmentGroup: UrlSegmentGroup, route: Route) {
  let city: string = '';
  let tmp: string[] = [];
  if (url.length === 2) {
    let segments = url[0].path.split('-');
    let id = Number(segments[0]);
    if (!isNaN(id)) {
      const result: UrlMatchResult = {
        consumed: url,
        posParams: {
          id: new UrlSegment(String(id), {}),
          categoryName: new UrlSegment(url[1].path, {}),
        }
      };
      return result;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

const routes: Routes = [
  { path: '', component: HomeComponent, resolve: { payload: HomepageService }, data: { depth: 1 } },
  { path: 'category', component: CategoryPageComponent, resolve: { payload: CategoryPageService }, data: { depth: 2 } },
  { path: 'category/:categoryName', component: CategoryItemsComponent, resolve: { payload: CategoryItemPageService }, data: { depth: 3 } },
  { path: 'item/:itemName', component: ItemPageComponent, resolve: { payload: ItemResolver }, data: { depth: 4 } },
  {path: 'user/profile', component: UserProfileComponent, resolve: {payload: CustomerModuleservice}, data: {depth: 2}},
  {path: 'user/order-list', component: UserOrdersComponent, resolve: {payload: CustomerModuleservice}, data: {depth: 2}},

  { path: 'משלוחי_פרחים_בישראל', component: RegionPageComponent, resolve: { payload: RegionPageService }, data: { depth: 2 } },
  { path: 'אודות_השווה', component: SupportComponent, resolve: { payload: SupportPageService }, data: { depth: 2, page: 'about-us' } },
  { path: 'צור_קשר', component: SupportComponent, resolve: { payload: SupportPageService }, data: { depth: 2, page: 'contact' } },
  { path: 'תמיכה', component: SupportComponent, resolve: { payload: SupportPageService }, data: { depth: 2, page: 'faq' } },
  { path: 'תקנון_האתר', component: SupportComponent, resolve: { payload: SupportPageService }, data: { depth: 2, page: 'terms' } },
  { path: 'חנויות_פרחים', component: ShopListPageComponent, resolve: { payload: ShopListService }, data: { depth: 2 } },
  { path: 'הוספת_חנות_חדשה', component: AddNewStoreComponent, resolve: { payload: AddNewStoreService }, data: { depth: 2 } },

  { matcher: htmlFiles, component: CitySearchComponent, resolve: { payload: CitySearchService }, data: { depth: 2 } },
  { matcher: storeInRegion, component: ShopListPageComponent, resolve: { payload: ShopListService }, data: { depth: 2 } },

  { path: 'wishlist/:cityName', component: WishListComponent, resolve: { payload: WishListService }, data: { depth: 2 } },
  { path: 'cart', component: BusketComponent, resolve: { payload: BusketService }, data: { depth: 2 } },
  { path: 'מועדפים/:cityName', component: WishListComponent, resolve: { payload: WishListService }, data: { depth: 2 } },
  { path: 'שיפור-מחיר/:cityName', component: BetterPriceComponent, resolve: { payload: BetterPriceService }, data: { depth: 2 } },

  { matcher: storeInCity, component: StoreInCityPageComponent, resolve: { payload: StoreInCityPageService }, data: { depth: 2 } },

  { path: 'product/:id', component: ProductItemComponent, resolve: { payload: ProductOfferService }, data: { depth: 3 } },
  { path: 'payment/:id', component: PaymentComponent, resolve: { payload: ProductOfferService }, data: { depth: 4 } },

  { path: 'payment-result/:id', component: TranzilaResultComponent, resolve: { payload: OrderHistoryPageService }, data: { depth: 4 } },
  { path: 'order-history/:id', component: OrderHistoryComponent, resolve: { payload: OrderHistoryPageService }, data: { depth: 5 } },

  { path: 'your-feedback/:id', component: RatingPageComponent, resolve: { payload: RateService }, data: { depth: 2 } },

  { matcher: storeRoute, component: ShopPageComponent, resolve: { payload: ShopPageService }, data: { depth: 3 } },
  { matcher: storeCategoryRoute, component: ShopCategoryPageComponent, resolve: { payload: ShopCategoryPageService }, data: { depth: 3 } },

  /*{path: 'store/:link/:categoryName', component: ShopCategoryPageComponent, resolve: {payload: ShopCategoryPageService}, data: {depth: 3}},*/

  { path: 'articles', component: ArticlesPageComponent, resolve: { payload: ArticlesPageService }, data: { depth: 2 } },
  { path: 'articles/:linkDetailArticle', component: ArticleDetailComponent, resolve: { payload: ArticleDetailService }, data: { depth: 2 } },

  { path: '**', component: ErrorComponent, data: { depth: 2 } },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
