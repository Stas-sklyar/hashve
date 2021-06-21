import {
  AfterViewInit,
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostListener,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppService } from "../app.service";
import { Store } from "../business/model/store.model";
import { Item } from "../business/model/item.model";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";
import { ShopCategoryPageService } from "../shared/service/shop-category-page.service";
import { isPlatformBrowser } from "@angular/common";
import {
  showCallButton,
  showStoreBar,
} from "../shared/animations/hashve.animations";
import { Category } from "../business/model/category.model";
import { ConfigService } from "../shared/service/config.service";
import { MetaService } from "@ngx-meta/core";

@Component({
  selector: "app-shop-category-page",
  templateUrl: "./shop-category-page.component.html",
  styleUrls: ["./shop-category-page.component.scss"],
  animations: [showStoreBar, showCallButton],
})
export class ShopCategoryPageComponent implements OnInit {
  curLang: string = "heb";
  data: any;
  category: Category;
  saleDeal: any;
  curPack: any;
  categories: any;
  packCount: number;
  dealCount: number;
  store: any;
  storelink: string;
  reviews: any;
  activeCategoryId: string = "";
  tmpItems: Array<Item> = [];
  items: Array<Item> = [];
  showSlider = true;
  menuHidden: string = "notShowed";
  configMenu: any = {
    slidesPerView: "auto",
    freeMode: true,
    mousewheel: true,
  };
  isShopPage: false;
  slider: any = [];
  scrollTo(to: string) {
    document.getElementById(to).scrollIntoView({ behavior: "smooth" });
  }

  @HostListener("window:scroll", ["$event"]) onWindowScroll(e) {
    if (isPlatformBrowser(this.platformId)) {
      let positionSensor = document.getElementById("position-fixedshop");
      if (positionSensor) {
        //debugger;
        let fixedMenu = document.getElementById("shop-scroll");
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
    private readonly _meta: MetaService,
    private appService: AppService,
    private translateSrv: TranslateService,
    private configService: ConfigService,
    private shopCategoryPageService: ShopCategoryPageService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.appService.onRenderBackgroundImage.next(true);
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });
    this.configService.getActiveSlider().subscribe((data) => {
      this.slider = data;
      this.slider.slides = this.slider.slides.filter((item) => item.active);
    });
  }

  ngOnInit() {
    // debugger;
    this.data = this.route.snapshot.data.payload;
    this.categories = [
      { name: { heb: "כל המוצרים" }, _id: "all" },
      ...this.data.categories,
    ];
    this.store = new Store(this.data.store);
    if (!this.appService.getSelectedCity()) {
      this.appService.onSelcetedCityChanged.next(this.store.city);
    }
    this.reviews = this.store.rate.slice(-3);
    this.storelink =
      this.store.ind + "-" + this.store.name.heb.replace(/\s/g, "-");
    const itemIds = this.store.items
      .filter((item) => item.inStock)
      .map((item) => item.item);
    // let itemIds = _.map(this.store.items, 'item');
    this.tmpItems = _.filter(this.data.items, (o) =>
      itemIds.includes(o["_id"])
    ).map((v) => new Item(v));

    this.route.params.subscribe((params) => {
      this.filterItems(params.categoryName.replace(/_/g, " "));
    });
  }

  filterItems(categorylink) {
    let activeCategoryIndex = _.findIndex(
      this.categories,
      (o) => o.name.heb == categorylink
    );
    this.category = this.categories[activeCategoryIndex];
    this._meta.setTitle(
      `מגוון הצעות ${this.category.name[this.curLang]} | הזמינו אונליין ב${
        this.store.name[this.curLang]
      }`
    );
    this._meta.setTag(
      "description",
      `ריכזנו עבורכם מגוון הצעות מקטגוריית ${
        this.category.name[this.curLang]
      }, בחרו מוצר בקליק והזמינו משלוח אונליין אצלינו ב${
        this.store.name[this.curLang]
      }.`
    );
    if (activeCategoryIndex > -1) {
      this.activeCategoryId = this.categories[activeCategoryIndex]._id;
      this.categories.forEach((category) => {
        category.active = false;
      });

      this.categories[activeCategoryIndex]["active"] = true;

      if (this.activeCategoryId && this.activeCategoryId !== "all") {
        this.items = _.filter(this.tmpItems, (o) =>
          o.category.includes(this.activeCategoryId)
        );
      } else {
        this.items = this.tmpItems;
      }
    }
  }

  public onMenuClicked() {
    this.appService.onSideMenuToggle.next(true);
  }
}
