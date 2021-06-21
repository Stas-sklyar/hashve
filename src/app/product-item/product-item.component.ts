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
import { ProductOffer } from "../business/model/product.offer.model";
import { CityService } from "../shared/service/city.service";
import { isPlatformBrowser } from "@angular/common";
import { IItem } from "../business/interfaces/IItem";
import { ItemStoreOffer } from "../business/model/item.store.offer";

@Component({
  selector: "app-product-item",
  templateUrl: "./product-item.component.html",
  styleUrls: ["./product-item.component.scss"],
})
export class ProductItemComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;
  pageSubscr: any;
  openCityList = false;
  openCityList2 = false;
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
  curLang: string;
  store: Store;
  pack: Package;
  offerCount: number = 0;
  itemRates: Rate[] = [];
  city: City;
  listCity: City[] = [];
  deliveryCities: City[] = [];
  offerID: string;
  productOffer: ProductOffer;
  additionalItems: Item[] = [];
  package: Package;
  itemSize: boolean[] = [false, false, false];
  additionalItemDict = {};
  state = {
    minutes: 0,
    seconds: 0,
  };
  timer: any;
  showSlider = false;
  callBack: boolean = false;
  startAnimate = false;
  tmpAdditionalItems: Item[] = [];
  banners = [];
  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId,
    private toastr: ToastrService,
    private deviceService: DeviceDetectorService,
    protected appService: AppService,
    private cityService: CityService,
    private translateSrv: TranslateService,
    private configService: ConfigService,
    private router: Router
  ) {
    this.appService.onRenderBackgroundImage.next(false);
    this.route.queryParams.subscribe((params) => {
      this.callBack = params["callBack"];
    });
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
    this.startAnimate = true;
    setTimeout(() => {
      this.startAnimate = false;
      this.pack.baseItem.improvePriceRequest = true;
      this.pack.baseItem.improvePrice = new Date();
      this.checkTimer();
      this.appService.addToImprovePriceList(this.pack.baseItem);
      this.toastr.success("הצעה חדשה התווספה לדף שיפור מחיר.", "שיפור מחיר");
    }, 15000);
  }

  onSizeChanged(index): void {
    for (let i = 0; i < this.itemSize.length; i++) {
      this.itemSize[i] = i === index ? true : false;
    }
    switch (index) {
      case 0:
        this.pack.size = ItemSize.normal;
        (this.productOffer.package as Package).size = ItemSize.normal;
        console.log(this.productOffer.package);
        break;
      case 1:
        this.pack.size = ItemSize.large;
        (this.productOffer.package as Package).size = ItemSize.large;
        console.log(this.productOffer.package);
        break;
      case 2:
        this.pack.size = ItemSize.extralarge;
        (this.productOffer.package as Package).size = ItemSize.extralarge;
        console.log(this.productOffer.package);
        break;
    }
  }

  onAdditionalItemsChanged(id, i) {
    if (this.additionalItemDict[id]) {
      delete this.additionalItemDict[id];
    } else {
      this.additionalItemDict[id] = true;
    }
    this.pack.addItems = Object.keys(this.additionalItemDict);
  }

  nextToPayment(): void {
    this.appService
      .updatePackageOfOffer(this.pack, this.offerID)
      .subscribe((data) => {
        this.router.navigateByUrl(`payment/` + data.data._id);
      });
  }

  setOfferCount($event) {
    this.offerCount = $event;
  }

  addToWishList() {
    if (this.appService.addWishList(this.pack.baseItem)) {
      this.toastr.success('המוצר התווסף לרשימה "אהבתי"', "אהבתי");
    } else {
      this.toastr.success('המוצר נמחק מרשימה "אהבתי"', "אהבתי");
    }
  }

  isWished(): boolean {
    return this.appService.getWishList(this.pack.baseItem);
  }

  addToCard() {
    this.appService
      .updatePackageOfOffer(this.pack, this.offerID)
      .subscribe((data) => {
        this.appService.addToCard(this.offerID);
        this.toastr.success("המוצר התווסף לסל הקניה.", "סל קניות");
      });
  }

  ngOnInit() {
    this.pageSubscr = this.route.params.subscribe((params) => {
      this.productOffer = new ProductOffer(
        this.route.snapshot.data.payload[1].data.offer
      );
      this.productOffer.store = new Store(
        this.route.snapshot.data.payload[1].data.offer.store
      );
      this.store = new Store(this.productOffer.store);
      this.offerID = this.productOffer._id;
      this.itemRates = [...this.route.snapshot.data.payload[1].data.itemRates];
      this.tmpAdditionalItems = this.route.snapshot.data.payload[1].data.addItems;
      this.additionalItems =
        this.route.snapshot.data.payload[1].data.addItems.length > 0
          ? this.route.snapshot.data.payload[1].data.addItems.filter((item) =>
              this.store.items.find((obj) => {
                return obj.item === item._id && (obj as ItemStoreOffer).inStock;
              })
                ? true
                : false
            )
          : [];
      this.productOffer.package = new Package(
        this.route.snapshot.data.payload[1].data.offer.package
      );
      this.pack = this.productOffer.package;
      if (this.pack.size === ItemSize.normal) {
        this.itemSize[0] = true;
      } else if (this.pack.size === ItemSize.large) {
        this.itemSize[1] = true;
      } else if (this.pack.size === ItemSize.extralarge) {
        this.itemSize[2] = true;
      }
      this.city = this.productOffer.city;
      this.deliveryCities = this.route.snapshot.data.payload[1].data.deliveryDest;
      this.listCity = this.deliveryCities.filter(
        (item) => item._id !== this.city._id
      );
      this.appService.onSelcetedCityChanged.next(this.city);

      let item: OfferResult = new OfferResult();
      item.id = this.offerID;
      item.city = this.city;
      item.pic = this.pack.baseItem.picture;
      item.name = this.pack.tmp ? this.pack.name : this.pack.baseItem.name;
      item.price = this.store.getPackagePrice(this.pack);
      item.deliveryPrice = this.store.getDeliveryPrice(this.city._id);
      this.appService.addToWatchedList(item);

      if (!this.pack.price) {
        this.pack.baseItem = this.appService.getImprovePrice(
          this.pack.baseItem
        );
        // (this.productOffer.package as Package).baseItem = this.appService.getImprovePrice((this.productOffer.package as Package).baseItem);
        this.checkTimer();
      }
      this.pack.addItems.forEach((id) => {
        this.additionalItemDict[id] = true;
      });
      // console.log(this.store);
      // console.log(this.pack.baseItem._id);
      // console.log(this.store.inStock(this.pack.baseItem._id));
      console.log(this.pack);
    });
  }

  ngOnDestroy(): void {
    this.pageSubscr.unsubscribe();
  }

  changeStore(store) {
    this.appService
      .updateOfferStore(this.offerID, store._id)
      .subscribe((data) => {
        console.log("call to store", store.callToStore);
        this.store = store;
        const addItm =
          this.tmpAdditionalItems.length > 0
            ? this.tmpAdditionalItems.filter((item) =>
                this.store.items.find((obj) => {
                  return (
                    obj.item === item._id && (obj as ItemStoreOffer).inStock
                  );
                })
                  ? true
                  : false
              )
            : [];

        this.additionalItems = addItm;

        this.productOffer.store = store;

        this.cityService.getCitiesWithoutLogin().subscribe((data) => {
          this.deliveryCities = data.data.filter((item) => {
            let res = this.store.delivery.filter(
              (elem) => elem.city === item._id
            );
            return res.length > 0;
          });
          this.listCity = this.deliveryCities.filter(
            (item) => item._id !== this.city._id
          );
        });
      });
  }

  changeCity(tmpCity) {
    this.city = tmpCity;
    this.appService.onSelcetedCityChanged.next(this.city);
    this.listCity = this.deliveryCities.filter(
      (item) => item._id !== this.city._id
    );
    this.productOffer.city = this.city;
    this.appService
      .updateOfferCity(this.offerID, this.city._id)
      .subscribe((data) => {
        console.log(data);
      });
  }

  showReview(to) {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        window.document
          .getElementById(to)
          .scrollIntoView({ behavior: "smooth" });
      }, 20);
    }
  }
}
