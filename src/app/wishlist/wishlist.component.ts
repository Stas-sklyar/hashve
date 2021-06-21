import { Component, Input } from "@angular/core";
import { environment } from "../../environments/environment";
import { ActivatedRoute } from "@angular/router";
import { AppService } from "../app.service";
import { Item } from "../business/model/item.model";
import {Store} from '../business/model/store.model';
import {RateService} from '../shared/service/rate.service';
import {Package} from '../business/model/package.model';
import {ItemSize} from '../business/Enum/ItemSize';
import {Router} from '@angular/router';
import { City } from "../business/model/city.model";
import {ItemStatisticalPrices} from '../business/model/analytics/ItemStatisticalPrices';
import {MetaService} from '@ngx-meta/core';

@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.component.html",
  styleUrls: ["./wishlist.component.scss"]
})

export class WishListComponent {
  data: any;
  showSlider = false;
  data2: any;
  items: Item[];
  currentCity: City;
  WISH_LIST: any[] = [];
  stores: Store[];
  curLang: string = "heb";
  host = environment.apihost;
  pic: string = environment.apihost + "/assets/items/";
  mostSaled: Array<Item>;
  recommended: Array<Item>;
  public itemPrices: ItemStatisticalPrices;

  constructor(private route: ActivatedRoute, private rateService: RateService, private appService: AppService, private router: Router, private _meta: MetaService) {
    this.appService.onRenderBackgroundImage.next(false);
    this.data = this.route.snapshot.data.payload;
    this.items = this.data[0].items.map(item => new Item(item));
    this.stores = this.data[0].stores.map(item => new Store(item));
    const wList = this.appService.getFullWishList();
    this._meta.setTitle('המוצרים שאהבתי')
    this.appService.onSelcetedCityChanged.subscribe(city => {
      this.currentCity = city;
    })
    wList.forEach(wishElement => {
      this.WISH_LIST.push(
        this.items.find(item => item._id === wishElement.id)
      );
    });
  }

  ngOnInit() {
  }
  ngOnDestroy(){
    /*this.itemReviewList.unsubscribe();*/
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
  redirectToCitySearch(){
    if(!this.appService.selectedCity){
      this.appService.onCitySearchOpen.next(true);
    }else{
      const link: string = `/פרחים_${this.appService.selectedCity.name.heb.replace(/\s/g, "_")}`;
      this.appService.navigateByLink(link);
    }
  }

}
