import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { NgxJsonLdModule } from "@ngx-lite/json-ld";
import { MatDatepickerModule } from "@angular/material";
import { MatInputModule } from "@angular/material";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
// libs
import { CookieService, CookieModule } from "@gorniv/ngx-universal";
import { TransferHttpCacheModule } from "@nguniversal/common";
// shared
import { TranslatesService } from "./shared/translates";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "./shared/shared.module";
// component
import { UniversalStorage } from "./shared/storage/universal.storage";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { CitySearchComponent } from "./city-search/city-search.component";
import { CategoryPageComponent } from "./category-page/category-page.component";
import { ProductItemComponent } from "./product-item/product-item.component";
import { PaymentComponent } from "./payment/payment.component";
import { TranzilaResultComponent } from "./tranzila-result/tranzila-result.component";
import { RegionPageComponent } from "./region-page/region-page.component";
import { RatingPageComponent } from "./rating-page/rating-page.component";
import { ShopListPageComponent } from "./shop-list-page/shop-list-page.component";
import { ShopPageComponent } from "./shop-page/shop-page.component";
import { OrderHistoryComponent } from "./order-history/order-history.component";
import { StoreModule } from "@ngrx/store";
import { reducers, metaReducers } from "./reducers";
import { ShopCategoryPageComponent } from "./shop-category-page/shop-category-page.component";
import { ArticlesPageComponent } from "./articles-page/articles-page.component";
import { ArticleDetailComponent } from "./article-detail/article-detail.component";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../environments/environment";
import { StoreInCityPageComponent } from "./store-in-city-page/store-in-city-page.component";
import { VirtualScrollModule } from "angular2-virtual-scroll";
import { DeferLoadModule } from "@trademe/ng-defer-load";
import { SupportComponent } from "./support/support.component";
import { AddNewStoreComponent } from "./add-new-store/addNewStore.component";
import { WishListComponent } from "./wishlist/wishlist.component";
import { BetterPriceComponent } from "./better-price/better-price.component";
import { ItemWishComponent } from "./shared/hashve.components/item-component/item-component.component";
import { ItemBetterPriceComponent } from "./shared/hashve.components/item-better-price/item-better-price.component";
import { BusketComponent } from "./Busket/busket.component";
import { PackageFullComponent } from "./shared/hashve.components/package-full/package-full.component";
import { CategoryItemsComponent } from "./category-items/category-items.component";
import { ItemPageComponent } from "./item-page/item-page.component";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { ErrorComponent } from "./404/404.component";
import { CalendarModule } from "primeng/calendar";
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { FormAddressComponent } from './user-profile/form-address/form-address.component';
import { ErrorInterceptor, TokenInterceptor } from './shared/service/token.interceptor';

export function initLanguage(translateService: TranslatesService): Function {
  return (): Promise<any> => translateService.initLanguage();
}

@NgModule({
  declarations: [	
    AppComponent,
    HomeComponent,
    CategoryPageComponent,
    CitySearchComponent,
    ProductItemComponent,
    PaymentComponent,
    TranzilaResultComponent,
    RegionPageComponent,
    RatingPageComponent,
    ShopListPageComponent,
    ShopPageComponent,
    OrderHistoryComponent,
    ShopPageComponent,
    ShopCategoryPageComponent,
    ArticlesPageComponent,
    ArticleDetailComponent,
    StoreInCityPageComponent,
    SupportComponent,
    AddNewStoreComponent,
    WishListComponent,
    BetterPriceComponent,
    ItemWishComponent,
    ItemBetterPriceComponent,
    BusketComponent,
    PackageFullComponent,
    CategoryItemsComponent,
    ItemPageComponent,
    UserProfileComponent,
    UserOrdersComponent,
    FormAddressComponent,
	ErrorComponent
   ],
  imports: [
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    MatDatepickerModule,
    CalendarModule,
    MatInputModule,
    MatMomentDateModule,
    LoadingBarHttpClientModule,
    VirtualScrollModule,
    DeferLoadModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TransferHttpCacheModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule,
    CookieModule.forRoot(),
    SharedModule.forRoot(),
    NgxJsonLdModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  providers: [
    CookieService,
    UniversalStorage,
    {
      provide: APP_INITIALIZER,
      useFactory: initLanguage,
      multi: true,
      deps: [TranslatesService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
