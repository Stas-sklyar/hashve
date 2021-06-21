import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {RatingModule} from 'ng-starrating';
import {MomentModule} from 'ngx-moment';
import {TransferHttpModule} from '@gorniv/ngx-universal';
import {SharedMetaModule} from './shared-meta';
import {ParamsTranslatePipe} from '../shared/translates';
import {ComponentModule} from './wrapper.swiper/swiper.module';
import {DailyDealComponent} from './hashve.components/daily-deal/daily-deal.component';
import {StoreSliderComponent} from './hashve.components/store-slider/store-slider.component';
import {ItemComponent} from './hashve.components/item/item.component';
import {TranslateModule} from '@ngx-translate/core';
import {PackageComponent} from './hashve.components/package/package.component';
import {CategoryComponent} from './hashve.components/category/category.component';
import {CategoryFolderComponent} from './hashve.components/category-folder/category-folder.component';
import {StopPropagationDirective} from './directives/stop-propagation.directive';
import {ItemSearchComponent} from '../shared/hashve.components/item-search/item-search.component';
import {AdditionalStoreOffersComponent} from './hashve.components/additional-store-offers/additional-store-offers.component';
import {CitySearchPopupComponent} from '../shared/hashve.components/city-search-popup/city-search-popup.component';
import {StorePopupComponent} from '../shared/hashve.components/store-popup/store-popup.component';
import {RegionListComponent} from './hashve.components/regionlist/regionlist.component';
import {RegionItemComponent} from './hashve.components/regionitem/regionitem.component';
import {WatchedListComponent} from './hashve.components/watched.list/watched.list.component';
import {CommentsListComponent} from '../shared/hashve.components/comments-list/comments-list.component';
import {AuthorizationComponent} from '../shared/hashve.components/authorization/authorization.component';
import {RegistrationComponent} from '../shared/hashve.components/registration/registration.component';
import {ShopItemComponent} from './hashve.components/shopitem/shopitem.component';
import {OrderViewComponent} from '../shared/hashve.components/order-view/order-view.component';
import {ShopAboutComponent} from './hashve.components/shop-about/shop-about.component';
import {CatalogMenuComponent} from './hashve.components/catalog-menu/catalog-menu.component';
import {ReviewItemComponent} from './hashve.components/review-item/review-item.component';
import {CatalogListComponent} from './hashve.components/catalog-list/catalog-list.component';
import {ShopAboutDescriptionComponent} from './hashve.components/shop-about-description/shop-about-description.component';
import {ArticleItemComponent} from './hashve.components/article-item/article-item.component';
import {NoticeComponent} from '../shared/hashve.components/notice/notice.component';
import {FooterComponent} from './layout/footer/footer.component';
import {HeaderComponent} from './layout/header/header.component';
import {CitySearchHeaderMobileComponent} from './layout/city-search-header-mobile/city-search-header-mobile.component';
import {HashveSliderComponent} from '../shared/hashve.components/hashve-slider/hashve-slider.component';
import {HashveBannerComponent} from './hashve.components/hashve-banner/hashve-banner.component';
import {DeliveryPanelComponent} from '../shared/hashve.components/delivery-panel/delivery-panel.component';
import {AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {ToastrModule} from 'ngx-toastr';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {ProductHeaderMobileComponent} from '../shared/layout/product-header-mobile/product-header-mobile.component';
import {AnalyticsItemComponent} from '../shared/hashve.components/analytics-item/analytics-item.component';
import {CardComponent} from '../shared/hashve.components/card/card.component';
import {SearchButtonComponent} from '../shared/hashve.components/search-button/search.button.component';
import {ImprovePriceComponent} from '../shared/hashve.components/improve-price/improve-price.component';
import {AccelerateSalesComponent} from '../shared/hashve.components/accelerate-sales/accelerate-sales.component';
import {ReviewSliderComponent} from '../shared/hashve.components/review-slider/review-slider.component';
import {PriceCompareComponent} from './hashve.components/price-compare/price-compare.component';
import {FilterItemsByCategoryIdPipe} from './pipes/FilterItemsByCategoryIdPipe';
import {FilterObjectsByIdArrayPipe} from './pipes/FilterObjectsByIdArrayPipe';
import {SpaceToUnderscorePipe} from './pipes/SpaceToUnderscorePipe';
import {SafePipe} from './pipes/SafePipe';
import {TakeSentencePipe} from './pipes/TakeSentencePipe';
import { PopularCitiesComponent } from '../shared/hashve.components/popular-cities/popular-cities.component';
import { OrderCallPopupComponent } from '../shared/hashve.components/order-call-popup/order-call-popup.component';
import { SizeStickerComponent } from '../shared/hashve.components/size-sticker/size-sticker.component';
import { SelectComponent } from '../shared/hashve.components/select/select.component';
// import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ZoomInComponent } from './hashve.components/zoom-in/zoom-in.component';
import { NotificationPopupComponent } from './hashve.components/notification-popup/notification-popup.component';
import { FilterAdditionalItemsPipe } from './pipes/FilterAdditionalItems';
import { CitySelectorComponent } from './hashve.components/city-selector/city-selector.component';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('716201763995-t5e7f8hohj4kkib6sjou349ligtg9ujm.apps.googleusercontent.com')
    // Bkv0nfzlKEkiiklvqdhnHEWs //Ваш секрет клиента
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('143307069683780')
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  imports: [
    ToastrModule.forRoot({
      timeOut: 10000
    }),
    MatDialogModule,
    // NgxImageZoomModule,
    TranslateModule,
    SocialLoginModule,
    MomentModule,
    CommonModule,
    ComponentModule,
    RouterModule,
    RatingModule,
    FormsModule,
    ReactiveFormsModule,
    // NgxImageZoomModule,
    DeviceDetectorModule.forRoot()
  ],
  exports: [
    ToastrModule,
    DeviceDetectorModule,
    HashveSliderComponent,
    FooterComponent,
    HeaderComponent,
    RatingModule,
    MomentModule,
    SharedMetaModule,
    TransferHttpModule,
    ComponentModule,
    DailyDealComponent,
    StoreSliderComponent,
    ItemComponent,
    PackageComponent,
    ParamsTranslatePipe,
    CategoryComponent,
    CategoryFolderComponent,
    StopPropagationDirective,
    ItemSearchComponent,
    AdditionalStoreOffersComponent,
    CitySearchPopupComponent,
    StorePopupComponent,
    RegionListComponent,
    RegionItemComponent,
    WatchedListComponent,
    CommentsListComponent,
    AuthorizationComponent,
    RegistrationComponent,
    ShopItemComponent,
    OrderViewComponent,
    ShopAboutComponent,
    CatalogMenuComponent,
    ReviewItemComponent,
    ArticleItemComponent,
    ShopAboutDescriptionComponent,
    CatalogListComponent,
    NoticeComponent,
    HashveBannerComponent,
    DeliveryPanelComponent,
    CitySearchHeaderMobileComponent,
    ProductHeaderMobileComponent,
    AnalyticsItemComponent,
    CardComponent,
    SearchButtonComponent,
    ImprovePriceComponent,
    AccelerateSalesComponent,
    ReviewSliderComponent,
    PriceCompareComponent,
    FilterItemsByCategoryIdPipe,
    SpaceToUnderscorePipe,
    FilterObjectsByIdArrayPipe,
    TakeSentencePipe,
    FilterAdditionalItemsPipe,
    SafePipe,
    PopularCitiesComponent,
    OrderCallPopupComponent,
    SizeStickerComponent,
    ZoomInComponent,
    NotificationPopupComponent,
    CitySelectorComponent
  ],
  declarations: [
    HashveSliderComponent,
    FooterComponent,
    HeaderComponent,
    DailyDealComponent,
    StoreSliderComponent,
    ItemComponent,
    PackageComponent,
    ParamsTranslatePipe,
    CategoryComponent,
    CategoryFolderComponent,
    StopPropagationDirective,
    ItemSearchComponent,
    AdditionalStoreOffersComponent,
    CitySearchPopupComponent,
    StorePopupComponent,
    RegionListComponent,
    RegionItemComponent,
    WatchedListComponent,
    CommentsListComponent,
    AuthorizationComponent,
    RegistrationComponent,
    ShopItemComponent,
    OrderViewComponent,
    ShopAboutComponent,
    CatalogMenuComponent,
    ReviewItemComponent,
    ArticleItemComponent,
    ShopAboutDescriptionComponent,
    CatalogListComponent,
    NoticeComponent,
    HashveSliderComponent,
    HashveBannerComponent,
    DeliveryPanelComponent,
    CitySearchHeaderMobileComponent,
    ProductHeaderMobileComponent,
    AnalyticsItemComponent,
    CardComponent,
    SearchButtonComponent,
    ImprovePriceComponent,
    AccelerateSalesComponent,
    ReviewSliderComponent,
    PriceCompareComponent,
    FilterItemsByCategoryIdPipe,
    SpaceToUnderscorePipe,
    FilterObjectsByIdArrayPipe,
    FilterAdditionalItemsPipe,
    TakeSentencePipe,
    SafePipe,
    PopularCitiesComponent,
    OrderCallPopupComponent,
    SizeStickerComponent,
    SelectComponent,
    ZoomInComponent,
    NotificationPopupComponent,
    CitySelectorComponent
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  entryComponents: [
    ZoomInComponent,
    NotificationPopupComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {ngModule: SharedModule};
  }
}
