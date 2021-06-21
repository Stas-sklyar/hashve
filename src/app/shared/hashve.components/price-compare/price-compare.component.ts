import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { AppService } from "../../../app.service";
import { TranslateService } from "@ngx-translate/core";
import { Store } from "../../../business/model/store.model";
import {
  fadeInFadeOutAnimation,
  rotateAnimation,
} from "../../animations/hashve.animations";
import { City } from "../../../business/model/city.model";
import { Package } from "../../../business/model/package.model";
import { Category } from "../../../business/model/category.model";
import { Item } from "../../../business/model/item.model";
import { SortingBy } from "../../../business/Enum/SortingBy";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-price-compare",
  templateUrl: "./price-compare.component.html",
  styleUrls: ["./price-compare.component.css"],
  animations: [fadeInFadeOutAnimation, rotateAnimation],
})
export class PriceCompareComponent implements OnInit {
  @Input()
  set item(value) {
    this.pack = value;
  }
  @Input() currentPrice: number = 0;
  @Input() set openned(val) {
    if (val === true) {
      this.additionalOffers = "expanded";
      this.animateArrow = "down";
    }
  }
  @Output() onOfferCountChanged: EventEmitter<number> = new EventEmitter();
  @Output() onStoreChanged: EventEmitter<Store> = new EventEmitter();
  curLang: string = "heb";
  stores: Store[] = [];
  animateArrow: string = "up";
  additionalOffers: string = "collapsed";
  currentCity: City;
  pack: Package;
  minPriceWithDiscount: number;
  minPrice: number;
  sizesName = {
    0: {
      en: "Normal",
      heb: "רגיל",
    },
    40: {
      en: "Large",
      heb: "גדול",
    },
    80: {
      en: "Extra",
      heb: "ענק",
    },
  };
  constructor(
    private http: HttpClient,
    private appService: AppService,
    private translateSrv: TranslateService,
    private route: ActivatedRoute
  ) {
    this.curLang = translateSrv.currentLang;
    this.currentCity = this.appService.getSelectedCity();
    this.appService.onSelcetedCityChanged.subscribe((city) => {
      this.currentCity = city;
    });
    translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });
    this.appService.onSelcetedCityChanged.subscribe((city) => {
      let cityTmp = this.appService.getSelectedCity();
      if (cityTmp) {
        this.http
          .get(
            environment.apihost +
              "/api/v1/content/price-compare?city=" +
              this.appService
                .getSelectedCity()
                .name[this.curLang].replace(/\s/g, "_")
          )
          .subscribe((data: any) => {
            this.stores = data.storeList
              .map((item) => new Store(item))
              .filter(
                (store) =>
                  store.inStock(this.pack.baseItem._id) && store.payments
              );
            this.onOfferCountChanged.emit(this.stores.length);
            this.stores = this.stores.filter((city) => {
              const tmp = city.items.find((item) => {
                return item.item === this.pack.baseItem._id;
              });
              if (tmp) {
                return true;
              }
              return false;
            });
            this.sortStores();
            this.pack.baseItem.minPrice = this.minPriceWithDiscount;
          });
      }
    });
  }

  ngOnInit() {}

  sortStores(): void {
    this.stores.sort((a, b) => {
      let itemA = a.getPackagePriceWithDelivery(
        this.pack,
        this.currentCity._id
      );
      let itemB = b.getPackagePriceWithDelivery(
        this.pack,
        this.currentCity._id
      );
      return itemA > itemB ? 1 : itemA < itemB ? -1 : this.getRandom();
    });
    this.minPriceWithDiscount = this.stores[0].getPackagePriceWithDelivery(
      this.pack,
      this.currentCity._id
    );
  }

  private getRandom(): 1 | -1 {
    return Math.floor(100 * Math.random()) > 50 ? -1 : 1;
  }

  onAddOfersClicked(tabId = null) {
    this.animateArrow = this.animateArrow === "up" ? "down" : "up";
    this.additionalOffers =
      this.additionalOffers === "collapsed" ? "expanded" : "collapsed";
  }

  changeStore(store) {
    // console.log("In compare store", store);
    this.onStoreChanged.emit(store);
  }
}
