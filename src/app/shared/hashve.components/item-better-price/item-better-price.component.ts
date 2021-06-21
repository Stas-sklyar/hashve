import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../../environments/environment';
import {Item} from '../../../business/model/item.model';
import {fadeInFadeOutAnimation} from '../../animations/hashve.animations';
import {Store} from '../../../business/model/store.model';
import {ItemStoreOffer} from '../../../business/model/item.store.offer';
import {AppService} from '../../../app.service';
import {City} from '../../../business/model/city.model';
import {Package} from '../../../business/model/package.model';
import {ItemSize} from '../../../business/Enum/ItemSize';
import {timer} from 'rxjs';
import {Rate} from '../../../business/model/rate.model';
import {RateService} from '../../service/rate.service';
import {ToastrService} from 'ngx-toastr';


class OfferStore {
  public store: Store;
  public offer: ItemStoreOffer;
}

@Component({
  selector: 'app-item-better-price',
  templateUrl: './item-better-price.component.html',
  styleUrls: ['./item-better-price.component.scss'],
  animations: [
    fadeInFadeOutAnimation
  ]
})
export class ItemBetterPriceComponent implements OnInit, OnDestroy {
  tabChanged: number = 0;
  offerStore: OfferStore[] = [];
  host = environment.apihost;
  minPrice: Number = 0;
  minPriceWithDiscount: number = 0;
  curItem: Item;
  _additionalItems: Item[];
  cityStores: Store[];
  pic: string;
  additionalOffers: string = 'collapsed';
  storeAdditionalOffers: any[] = [];
  currentCity: City;
  timer: any;
  itemReviewList: Rate[] = [];
  state = {
    minutes: 0,
    seconds: 0
  };

  @Input()
  set item(value) {
    this.curItem = value;
    this.curItem = this.appService.getImprovePrice(this.curItem);
    this.checkTimer();
    this.pic = environment.apihost + '/assets/items/' + this.curItem.picture;
  }

  @Input() showOffers: boolean = true;

  @Input()
  set additionalItems(value) {
    this._additionalItems = value;
  }

  @Input()
  set store(value) {
    this.cityStores = value.map(store => new Store(store));
    this.cityStores = this.cityStores.filter((city) => {
      const tmp = city.items.find((item) => {
        return item.item === this.curItem._id;
      });
      if (tmp) {
        return true;
      }
      return false;
    });
    this.sortStores();
    this.curItem.minPrice = this.minPriceWithDiscount;
    this.calculateMinPrices();
    this.cityStores.forEach((s) => {
      this.storeAdditionalOffers[s._id] = 'collapsed';
    });
  }

  curLang: string;

  constructor(private translateSrv: TranslateService, private toastr: ToastrService, private rateService: RateService, private appService: AppService, private router: Router) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
    this.appService.onSelcetedCityChanged.subscribe(city => {
      this.currentCity = city;
    });
    this.currentCity = this.appService.getSelectedCity();
  }

  private checkTimer() {
    if (this.curItem.isPriceImproveValid()) {
      this.timer = timer(1000, 1000);
      this.timer.subscribe(val => {
        this.state.minutes = this.curItem.getMinutes();
        this.state.seconds = this.curItem.getSeconds();
      });
    }else{
      this.appService.removeFromImprovePriceList(this.curItem);
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    /*this.itemReviewList.unsubscribe();*/
  }

  onAddOfersClicked(tabId = null) {
    if(this.additionalOffers === 'collapsed' && this.itemReviewList.length === 0){
      this.rateService.getRates(0, this.curItem._id, this.itemReviewList.length, 5).subscribe((data: Rate[]) => {
        this.itemReviewList = data;
      });
    }
    this.additionalOffers = this.additionalOffers === 'collapsed' ? 'expanded' : 'collapsed';
    if(this.tabChanged === 0) this.tabChanged = 1;
    if (tabId) {
      this.onTabChange(tabId);
    }
  }

  onTabChange(tab) {
    this.tabChanged = tab;
  }

  changeAdditionalDealsState(id) {
    this.storeAdditionalOffers[id] = this.storeAdditionalOffers[id] === 'collapsed' ? 'expanded' : 'collapsed';
  }

  saveOfferAndRedirectToProduct(offer, _store: string = null) {
    let newOffer: any = {};
    newOffer.package = new Package({});
    newOffer.package.baseItem = offer._id;
    newOffer.package.size = ItemSize.normal;
    newOffer.store = _store;
    newOffer.city = this.currentCity._id;
    this.appService.saveOffer(newOffer).subscribe((data) => {
      this.router.navigateByUrl(`product/` + data.data._id);
    });
  }

  saveOfferAndRedirectToPayment(offer, _store: string = null) {
    let newOffer: any = {};
    newOffer.package = new Package({});
    newOffer.package.baseItem = offer._id;
    newOffer.package.size = ItemSize.normal;
    newOffer.store = _store;
    newOffer.city = this.currentCity._id;
    this.appService.saveOffer(newOffer).subscribe((data) => {
      this.router.navigateByUrl(`payment/` + data.data._id);
    });
  }

  startImprovingPrice() {
    this.curItem.improvePriceRequest = true;
    this.curItem.improvePrice = new Date();
    this.checkTimer();
    this.appService.addToImprovePriceList(this.curItem);
    this.toastr.success("הצעה חדשה התווספה לדף שיפור מחיר.", "שיפור מחיר")
    this.sortStores();
    this.calculateMinPrices();
  }

  sortStores(): void {
    this.cityStores.sort((a, b) => {
      let itemA = a.getPrice(this.curItem) + a.getDeliveryPrice(this.currentCity._id);
      let itemB = b.getPrice(this.curItem) + b.getDeliveryPrice(this.currentCity._id);
      return itemA > itemB ? 1 : -1;
    });
    this.minPriceWithDiscount = this.cityStores[0].getPrice(this.curItem) + this.cityStores[0].getDeliveryPrice(this.currentCity._id);
  }

  calculateMinPrices(): void {
    //this.offerStore.length > 0 ? this.offerStore[0].offer.price + this.offerStore[0].store.getDeliveryPrice(this.currentCity._id) : 0;
    //debugger;
    this.minPrice = 0;
    this.offerStore = [];
    this.cityStores.forEach((item, index) => {
      const offer = item.items.find((offers) => {
        return offers.item === this.curItem._id;
      });
      if (index === 0)
        this.minPrice = offer.price + item.getDeliveryPrice(this.currentCity._id);
      this.minPrice = offer.price + item.getDeliveryPrice(this.currentCity._id) < this.minPrice ? offer.price + item.getDeliveryPrice(this.currentCity._id) : this.minPrice;
      this.offerStore.push({store: item, offer: offer});
    });
  }

  addToWishList(){
    if(this.appService.addWishList(this.curItem)){
      this.toastr.success('המוצר התווסף לרשימה "אהבתי"', 'אהבתי');
    }else{
      this.toastr.success('המוצר נמחק מרשימה "אהבתי"', 'אהבתי');
    }
  }

  isWished(): boolean{
    return this.appService.getWishList(this.curItem);
  }

  removeItemFromBetterPrice(){
    this.appService.removeFromImprovePriceList(this.curItem);
  }



  runEvent($event){
    //debugger;
    // console.log($event);
    this.curItem.show = true
  }
}
