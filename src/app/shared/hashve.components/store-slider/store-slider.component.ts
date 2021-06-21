import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ItemStatisticalPrices } from '../../../business/model/analytics/ItemStatisticalPrices';
import * as _ from 'lodash';
import { Item } from '../../../business/model/item.model';
import { AppService } from '../../../app.service';
import { Router } from '@angular/router';
import { AppRouterState } from '../../../business/model/AppRouterState';
import { ApplicationState } from '../../../business/Enum/ApplicationState';
import { Store } from '../../../business/model/store.model';
import { isPlatformServer } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-store-slider',
  templateUrl: './store-slider.component.html',
  styleUrls: ['./store-slider.component.scss']
})
export class StoreSliderComponent implements OnInit {
  curItem: any;
  pic: string = '';
  pict: any;
  minPrice: number;
  serverFlag: boolean = false;
  isItemRedirect: boolean = false;
  curLang: string = 'heb';
  deliveryPrice = 0;
  _store: Store;
  @Input() itemPrices: ItemStatisticalPrices;
  // @Input() store: Store;
  @Input() set store(value: Store) {
    this._store = value;
    this.pict = this._store.pic;
    this.deliveryPrice = this._store.getDeliveryPrice(this.appService.getSelectedCity()._id);
  }

  @Input()
  set item(value) {
    this.curItem = new Item(value);
    this.pic = environment.apihost + '/assets/items/' + this.curItem.picture;
    this.minPrice = this.curItem.minPrice;
    this.isItemRedirect = !this.store && !this.appService.selectedCity ? true : false;
  }

  constructor(private appService: AppService,
              private router: Router,
              private translateSrv: TranslateService,
              @Inject(PLATFORM_ID) private platformId
            ) {

    this.appService.onSelcetedCityChanged.subscribe(data => {
      if(this._store){
        this.deliveryPrice = this._store.getDeliveryPrice(this.appService.getSelectedCity()._id);
      }
    });
    this.serverFlag = isPlatformServer(this.platformId);
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
  }

  ngOnInit() {
  }

  redirect() {
    if (this._store) {
      this.appService.createStoreOfferWithCity(this.curItem, this._store, this.appService.selectedCity);
    } else {
      if (!this.appService.selectedCity) {
        this.appService.routerState = new AppRouterState({ state: ApplicationState.HomePageItem, element: this.curItem._id });
        this.appService.onCitySearchOpen.next(true);
      } else {
        this.appService.routerState = new AppRouterState({ state: ApplicationState.HomePageItem, element: this.curItem._id });
        this.appService.createOffer();
      }
    }
  }

}
