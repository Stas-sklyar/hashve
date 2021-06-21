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

@Component({
  selector: "app-better-price",
  templateUrl: "./better-price.component.html",
  styleUrls: ["./better-price.component.scss"]
})

export class BetterPriceComponent {
  data: any;
  showSlider = false;
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

  constructor(private route: ActivatedRoute, private rateService: RateService, private appService: AppService, private router: Router) {
    this.appService.onRenderBackgroundImage.next(false);
    this.data = this.route.snapshot.data.payload;
    this.items = this.data[0].items.map(item => new Item(item));
    this.stores = this.data[0].stores.map(item => new Store(item));
    const wList = this.appService.getFullImprovePrice();
    this.appService.onImprovePriceChanged.subscribe(data => {
      const tmp = this.appService.getFullImprovePrice();
      this.WISH_LIST = [];
      tmp.forEach(wishElement => {
        this.WISH_LIST.push(
          this.items.find(item => item._id === wishElement.id)
        );
      });
    });
    this.appService.onSelcetedCityChanged.subscribe(city => {
      this.currentCity = city;
    })
    wList.forEach(wishElement => {
      this.WISH_LIST.push(
        this.items.find(item => item._id === wishElement.id)
      );
    });
  }

  toProductInCity(item){
    this.appService.createCityOffer(item, this.currentCity);
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    /*this.itemReviewList.unsubscribe();*/
  }
}
