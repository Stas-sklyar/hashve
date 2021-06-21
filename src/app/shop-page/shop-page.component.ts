import {
  Component,
  OnInit,
  HostListener,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppService } from "../app.service";
import { Store } from "../business/model/store.model";
import { TranslateService } from "@ngx-translate/core";
import { ItemStatisticalPrices } from "../business/model/analytics/ItemStatisticalPrices";
import { isPlatformBrowser } from "@angular/common";
import {
  showCallButton,
  showStoreBar,
} from "../shared/animations/hashve.animations";
import { Item } from "../business/model/item.model";
import { CategoryService } from "../shared/service/category.service";
import { Category } from "../business/model/category.model";
import { MetaService } from "@ngx-meta/core";
import { City } from "../business/model/city.model";
import { ConfigService } from "../shared/service/config.service";

/*class deliveryCities {
  city: City;
  price: number;
  constructor
}*/

@Component({
  selector: "app-shop-page",
  templateUrl: "./shop-page.component.html",
  styleUrls: ["./shop-page.component.scss"],
  animations: [showStoreBar, showCallButton],
})
export class ShopPageComponent implements OnInit {
  curLang = "heb";
  data: any;
  dailyDeal: any;
  saleDeal: any;
  recommended: Array<Item>;
  curPack: any;
  categories: Category[] = [];
  categoriesInList: Category[] = [];
  packCount: number;
  dealCount: number;
  store: Store;
  storelink: string;
  reviews: any;
  isShopPage = true;
  public itemPrices: ItemStatisticalPrices;
  productDayConfig: any = {
    loop: true,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };
  configMenu: any = {
    slidesPerView: "auto",
    freeMode: true,
    mousewheel: true,
  };
  showSlider = true;
  showMobileMenu = false;
  menuHidden = "notShowed";
  city: City;
  closePopup = false;
  slider: any;

  scrollTo(to: string) {
    document.getElementById(to).scrollIntoView({ behavior: "smooth" });
  }

  @HostListener("window:scroll", ["$event"]) onWindowScroll(e) {
    if (isPlatformBrowser(this.platformId)) {
      const positionSensor = document.getElementById("position-fixedshop");
      if (positionSensor) {
        const fixedMenu = document.getElementById("shop-scroll");
        let sensorTopPos = positionSensor.getBoundingClientRect().top;
        this.menuHidden = "notShowed";
        // let startIndentTop = window.pageYOffset;

        sensorTopPos = positionSensor.getBoundingClientRect().top;
        if (sensorTopPos <= 0) {
          if (this.menuHidden === "notShowed") {
            this.menuHidden = "showed";
          }
        } else if (sensorTopPos > 0) {
          if (this.menuHidden === "showed") {
            this.menuHidden = "notShowed";
          }
        }
      }
    }
  }

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private appService: AppService,
    private translateSrv: TranslateService,
    private configService: ConfigService,
    // tslint:disable-next-line: variable-name
    private readonly _meta: MetaService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });
  }

  onClosePopup() {
    this.closePopup = false;
  }

  ngOnInit() {
    this.appService.onSelcetedCityChanged.subscribe((c) => {
      this.city = c;
    });
    this.data = this.route.snapshot.data.payload;
    this.configService.getActiveSlider().subscribe((data) => {
      this.slider = data;
      this.slider.slides = this.slider.slides.filter((item) => item.active);
    });
    if (
      !(
        this.data &&
        this.data.store &&
        this.data.store.payments &&
        this.data.store.payments.length
      )
    ) {
      this.closePopup = true;
    }
    this.store = new Store(this.data.store);
    console.log(this.store);
    this.dailyDeal = this.data.home.DalyList.map(
      (item) => new Item(item)
    ).filter((item) => this.store.inStock(item._id));
    this.saleDeal = this.data.home.SaleList.map(
      (item) => new Item(item)
    ).filter((item) => this.store.inStock(item._id));
    this.curPack = this.data.home.packages[
      Math.floor(Math.random() * this.data.home.packages.length)
    ];
    this.categories = this.data.categories; // .map(item => new Category(item));
    this.categories.forEach((item) => {
      if (item.renderOnHomePage) {
        this.categoriesInList.push(item);
      }
    });

    this.packCount = this.data.home.packages.length;
    this.dealCount = this.data.home.DalyList.length;

    if (!this.appService.getSelectedCity()) {
      this.appService.onSelcetedCityChanged.next(this.store.city);
    }
    this.setSeo();
    this.itemPrices = this.data.home.prices as ItemStatisticalPrices;
    this.reviews = this.store.rate.slice(-3);
    this.storelink =
      this.store.ind + "-" + this.store.name.heb.replace(/\s/g, "-");
    this.categories = [
      { name: { heb: "כל המוצרים" }, _id: "all" },
      ...this.data.categories,
    ];
    this.appService.onRenderBackgroundImage.next(true);
  }

  private setSeo() {
    this._meta.setTitle(this.store.seo.title[this.curLang]);
    this._meta.setTag("description", this.store.seo.description[this.curLang]);
  }

  public onMenuClicked() {
    this.appService.onSideMenuToggle.next(true);
  }
}
