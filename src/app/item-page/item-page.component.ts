import { ConfigService } from "./../shared/service/config.service";
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { environment } from "../../environments/environment";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../app.service";
import { TranslateService } from "@ngx-translate/core";
import { Store } from "../business/model/store.model";
import { Item } from "../business/model/item.model";
import { City } from "../business/model/city.model";
import { Package } from "../business/model/package.model";
import { ItemSize } from "../business/Enum/ItemSize";
import { OfferResult } from "../business/model/offerResult/offer.result.model";
import { timer } from "rxjs";
import { Rate } from "../business/model/rate.model";
import { DeviceDetectorService } from "ngx-device-detector";
import { ToastrService } from "ngx-toastr";
import { Category } from "../business/model/category.model";
import { SortingBy } from "../business/Enum/SortingBy";
import { MetaService } from "@ngx-meta/core";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";
import { AppRouterState } from "../business/model/AppRouterState";
import { ApplicationState } from "../business/Enum/ApplicationState";
import { isPlatformServer } from "@angular/common";

@Component({
  selector: "app-item-page",
  templateUrl: "./item-page.component.html",
  styleUrls: ["./item-page.component.scss"],
})
export class ItemPageComponent implements OnInit, OnDestroy {
  schema: Object;
  isMobile: boolean = false;
  pageSubscr: any;
  config = {
    slidesPerView: 9,
    spaceBetween: 9,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1530: {
        slidesPerView: 6,
      },
      767: {
        slidesPerView: 4.5,
        spaceBetween: 3,
      },
      375: {
        slidesPerView: 3.5,
        spaceBetween: 3,
      },
    },
  };
  host: string = environment.apihost;
  item: Item;
  curLang: string;
  store: Store;
  pack: Package;
  itemRates: Rate[] = [];
  city: City;
  offerID: string;
  additionalItems: Item[] = [];
  package: Package;
  itemSize: boolean[] = [false, false, false];
  state = {
    minutes: 0,
    seconds: 0,
  };
  timer: any;
  showSlider = false;
  serverFlag: boolean = false;
  showMobileSelect = false;
  banners = [];
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private readonly _meta: MetaService,
    private deviceService: DeviceDetectorService,
    protected appService: AppService,
    private translateSrv: TranslateService,
    private router: Router,
    private configService: ConfigService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.serverFlag = isPlatformServer(this.platformId);
    if (!isPlatformServer(this.platformId)) {
      this.appService.onRenderBackgroundImage.next(false);
    }
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });
    this.configService.getActiveBannerProductPage().subscribe((data) => {
      this.banners = data;
    });
  }

  makeid(length) {
    var result = "";
    var characters = "0123456789";
    //"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  ngOnInit() {
    this.pageSubscr = this.route.params.subscribe((params) => {
      // this.store = new Item(this.route.snapshot.data.payload.item);
      this.item = new Item(this.route.snapshot.data.payload.item);
      this.pack = new Package({
        baseItem: this.route.snapshot.data.payload.item,
        size: ItemSize.normal,
      });
      this._meta.setTitle(this.pack.baseItem.seo.title[this.curLang]);
      this._meta.setTag(
        "description",
        this.pack.baseItem.seo.description[this.curLang]
      );
      if (this.pack.size === ItemSize.normal) {
        this.itemSize[0] = true;
      } else if (this.pack.size === ItemSize.large) {
        this.itemSize[1] = true;
      } else if (this.pack.size === ItemSize.extralarge) {
        this.itemSize[2] = true;
      }
      this.schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: this.pack.baseItem.name[this.curLang],
        image: [this.host + "/assets/items/" + this.pack.baseItem.picture],
        description: this.pack.baseItem.seo.description[this.curLang],
        availability: "in_stock",
        mpn: this.pack.baseItem.name.en.replace(/\s/g, "").toUpperCase(),
        size: "S,M,L",
        sku: this.pack.baseItem.code,
        /*"mpn": "925872",*/
        brand: {
          "@type": "Thing",
          name: "Hashve",
        },
        review: {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: this.pack.baseItem.rating,
            bestRating: 5,
          },
          author: {
            "@type": "Organization",
            name: "Hashve",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: this.pack.baseItem.rating,
          reviewCount: this.pack.baseItem.reviewsCount,
        },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "ILS",
          highPrice: this.pack.baseItem.maxPrice,
          lowPrice: this.pack.baseItem.minPrice,
          offerCount: 8,
        },
      };
    });
  }

  checkTimer() {
    if (this.pack.baseItem.isPriceImproveValid() && !this.pack.price) {
      this.timer = timer(1000, 1000);
      this.timer.subscribe((val) => {
        this.state.minutes = this.pack.baseItem.getMinutes();
        this.state.seconds = this.pack.baseItem.getSeconds();
      });
    } else {
      this.appService.removeFromImprovePriceList(this.pack.baseItem);
    }
  }

  startImprovingPrice() {
    this.pack.baseItem.improvePriceRequest = true;
    this.pack.baseItem.improvePrice = new Date();
    this.checkTimer();
    this.appService.addToImprovePriceList(this.pack.baseItem);
    this.toastr.success("הצעה חדשה התווספה לדף שיפור מחיר.", "שיפור מחיר");
  }

  onSizeChanged(index): void {
    for (let i = 0; i < this.itemSize.length; i++) {
      this.itemSize[i] = i === index ? true : false;
    }
    switch (index) {
      case 0:
        this.pack.size = ItemSize.normal;
        break;
      case 1:
        this.pack.size = ItemSize.large;
        break;
      case 2:
        this.pack.size = ItemSize.extralarge;
        break;
    }
  }

  addToWishList() {
    if (!isPlatformServer(this.platformId)) {
      if (this.appService.addWishList(this.pack.baseItem)) {
        this.toastr.success('המוצר התווסף לרשימה "אהבתי"', "אהבתי");
      } else {
        this.toastr.success('המוצר נמחק מרשימה "אהבתי"', "אהבתי");
      }
    }
  }

  isWished(): boolean {
    if (!isPlatformServer(this.platformId)) {
      return this.appService.getWishList(this.pack.baseItem);
    }
  }

  addToCard() {
    this.appService
      .updatePackageOfOffer(this.pack, this.offerID)
      .subscribe((data) => {
        this.appService.addToCard(this.offerID);
        this.toastr.success("ITem added to the card", "Card");
      });
  }

  ngOnDestroy(): void {
    this.pageSubscr.unsubscribe();
  }

  selectCity() {
    this.showMobileSelect = true;
    if (this.appService.selectedCity === null) {
      this.appService.routerState = new AppRouterState({
        state: ApplicationState.ItemPage,
        element: this.pack.baseItem,
      });
      this.appService.onCitySearchOpen.next(true);
    } else {
      this.appService.routerState = new AppRouterState({
        state: ApplicationState.ItemPage,
        element: this.pack.baseItem,
      });
      this.appService.onCitySearchOpen.next(true);
    }
  }

  showReview(to) {
    if (!isPlatformServer(this.platformId)) {
      setTimeout(() => {
        window.document
          .getElementById(to)
          .scrollIntoView({ behavior: "smooth" });
      }, 20);
    }
  }
}
