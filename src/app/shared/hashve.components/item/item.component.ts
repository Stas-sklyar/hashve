import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../../environments/environment';
import {Store} from '../../../business/model/store.model';
import {AppRouterState} from '../../../business/model/AppRouterState';
import {ApplicationState} from '../../../business/Enum/ApplicationState';
import {AppService} from '../../../app.service';
import {Item} from '../../../business/model/item.model';
import {isPlatformServer} from '@angular/common';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnInit, AfterViewInit {
  curLang: string = 'heb';
  curItem: Item;
  pic: string = '';
  _ratingEnable: boolean = false;
  stoerPrice: boolean = false;
  minPrice: number;
  maxPrice: number;
  salePrice: number;
  price: number;
  serverFlag: boolean = false;
  @Input() store: Store = null;
  @Input() linkToItemPage: boolean = false;

  @Input()
  set item(value) {
    this.curItem = value;
    console.log(this.curItem);
    this.pic = environment.apihost + '/assets/items/' + this.curItem.picture;
  }

  @Input()
  set ratingEnable(v: boolean) {
    this._ratingEnable = v;
  }

  constructor(private translateSrv: TranslateService, private appService: AppService, @Inject(PLATFORM_ID) private platformId, private cdr: ChangeDetectorRef) {
    this.curLang = translateSrv.currentLang;
    this.serverFlag = isPlatformServer(this.platformId);
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
    this.linkToItemPage = this.appService.selectedCity?false:true;
  }

  ngOnInit() {
    this.appService.onSelcetedCityChanged.subscribe(city => {
      this.ngAfterViewInit();
    });
  }

  ngAfterViewInit(): void {
    this.salePrice = this.curItem.price > 0 ? this.curItem.price : 0;
    if (this.store) {
      this.stoerPrice = true;
      this.price = this.store.getPriceById(this.curItem._id) + this.store.getDeliveryPrice(this.appService.selectedCity._id);
      this.salePrice = this.curItem.price > 0 ? this.curItem.price + this.store.getDeliveryPrice(this.appService.selectedCity._id) : 0;
      this.minPrice = this.price;
      this.maxPrice = 0;
    } else {
      if(this.curItem.minPrice && this.curItem.maxPrice){
        if(this.salePrice > 0){
          this.minPrice = this.curItem.minPrice;
          this.maxPrice = 0;
          this.price = 0;
        }else{
          this.minPrice = this.curItem.minPrice;
          this.maxPrice = this.curItem.maxPrice;
          this.price = 0;
        }
      }else{
        this.price = 0;
      }
    }
    if (!this.cdr['destroyed']) {
      this.cdr.detectChanges();
    }
    /*this.cdr.detectChanges();*/
  }

  onProductSelected(){
    if(this.store){
      this.appService.createStoreOfferWithCity(this.curItem, this.store, this.appService.selectedCity);
    }else{
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
