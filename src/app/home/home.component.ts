import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  PLATFORM_ID,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppService } from "../app.service";
import { Article } from "../business/model/article.model";
import { TranslateService } from "@ngx-translate/core";
import { fadeInFadeOutAnimation } from "../shared/animations/hashve.animations";
import { ItemStatisticalPrices } from "../business/model/analytics/ItemStatisticalPrices";
import { Item } from "../business/model/item.model";
import { City } from "../business/model/city.model";
import { environment } from "../../environments/environment";
import { AppRouterState } from "../business/model/AppRouterState";
import { ApplicationState } from "../business/Enum/ApplicationState";
import { Category } from "../business/model/category.model";
import { MetaService } from "@ngx-meta/core";
import { Store } from "../business/model/store.model";
import { isPlatformServer } from "@angular/common";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  animations: [fadeInFadeOutAnimation],
})
export class HomeComponent implements OnInit, AfterViewInit {
  data: any;
  dailyDeal: Array<Item>;
  saleDeal: Array<Item>;
  recommended: Array<Item>;
  mostSaled: Array<Item>;
  popularStores: Store[];
  curPack: any;
  popularCity: Array<City> = [];
  reviewCity: Array<City> = [];
  tabActive: boolean = true;
  cities: Array<City> = [];
  host: string = environment.apihost;
  categories: any;
  footerCategories: any;
  reviews: any = [];
  packCount: number;
  dealCount: number;
  article: Article;
  homePageArticles: Article[];
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
  curLang: string = "heb";
  showArticle: boolean = true;
  showSlider = true;
  isItemRedirect: boolean = false;
  curCity: City;
  public deliveryState: string = "expanded";
  slider: any;
  banners: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private translateSrv: TranslateService,
    @Inject(PLATFORM_ID) private platformId,
    private readonly _meta: MetaService
  ) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });
    this.isItemRedirect = !this.appService.selectedCity ? true : false;
    this.curCity = this.appService.selectedCity;
  }

  ngAfterViewInit(): void {
    if (!this.curCity) {
      this.appService.onCitySearchOpenWihoutShadow.next(true);
    }
  }

  ngOnInit() {
    this.data = this.route.snapshot.data.payload[0];
    this.cities = this.route.snapshot.data.payload[1].data.map(
      (city) => new City(city)
    );

    this.slider = this.route.snapshot.data.payload[3];
    this.slider.slides = this.slider.slides.filter((item) => item.active);

    this.banners = this.route.snapshot.data.payload[4];

    this.reviewCity = this.cities.filter((item) => item.inReview);
    this.popularCity = this.cities.filter((item) => item.inPopular);
    this.dailyDeal = this.data.DalyList.map((item) => new Item(item));
    this.saleDeal = this.data.SaleList.map((item) => new Item(item));
    this.popularStores = this.data.bestStores;
    this.curPack = this.data.packages[
      Math.floor(Math.random() * this.data.packages.length)
    ];
    this.categories = this.route.snapshot.data.payload[2];
    this.footerCategories = this.categories.filter((item) => item.toFooterMenu);
    this.categories = this.categories.filter((item) => item.renderOnHomePage);
    this.packCount = this.data.packages.length;
    this.dealCount = this.data.DalyList.length;
    this.article = this.data.article ? new Article(this.data.article) : null;
    this._meta.setTag(
      "description",
      this.article.seo.description[this.curLang]
    );
    this._meta.setTitle(this.article.seo.title[this.curLang]);
    this.homePageArticles = this.data.homePageArticles
      ? this.data.homePageArticles.map((item) => new Article(item))
      : null;
    if (!isPlatformServer(this.platformId)) {
      this.appService.onRenderBackgroundImage.next(true);
    }
  }

  toggleArticle() {
    this.deliveryState =
      this.deliveryState === "collapsed" ? "expanded" : "collapsed";
    this.showArticle = !this.showArticle;
  }

  redirectByCategory(name) {
    const category = new Category({ _id: "", name: { heb: name } });
    if (!this.appService.selectedCity) {
      this.appService.routerState = new AppRouterState({
        state: ApplicationState.Category,
        element: category,
      });
      this.appService.onCitySearchOpen.next(true);
    } else {
      const link: string = `/פרחים_${this.appService.selectedCity.name.heb.replace(
        /\s/g,
        "_"
      )}/${category.name.heb.replace(/\s/g, "_")}`;
      this.appService.navigateByLink(link);
    }
  }

  changeTab() {
    this.tabActive = !this.tabActive;
  }
}
