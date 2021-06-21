import { ConfigService } from "./../shared/service/config.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppService } from "../app.service";
import { TranslateService } from "@ngx-translate/core";
import { MetaService } from "@ngx-meta/core";
import { Article } from "../business/model/article.model";
import { fadeInFadeOutAnimation } from "../shared/animations/hashve.animations";

@Component({
  selector: "app-home",
  templateUrl: "./shop-list-page.component.html",
  styleUrls: ["./shop-list-page.component.scss"],
  animations: [fadeInFadeOutAnimation],
})
export class ShopListPageComponent implements OnInit {
  data: any;
  stores: any;
  showSlider = false;
  curLang: string = "heb";
  article: Article;
  regions: any;
  showArticle: boolean = true;
  public deliveryState: string = "expanded";
  h1: string = "החנויות הפופולריות";
  banners: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private translateSrv: TranslateService,
    private readonly _meta: MetaService,
    private configService: ConfigService
  ) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });
  }

  ngOnInit() {
    this.data = this.route.snapshot.data.payload;
    this.configService.getActiveBannerCitySearchPage().subscribe((data) => {
      this.banners = data;
    });
    if (this.data.article) {
      this._meta.setTag(
        "description",
        this.data.article.seo.description[this.curLang]
      );
      this._meta.setTitle(this.data.article.seo.title[this.curLang]);
      this.article = new Article(this.data.article);
      this.h1 = this.data.article.seo.h1[this.curLang];
    }
    this.stores = this.data.storeList;
    this.appService.onRenderBackgroundImage.next(false);
    this.regions = this.data.regions;
  }

  toggleArticle() {
    this.deliveryState =
      this.deliveryState === "collapsed" ? "expanded" : "collapsed";
    this.showArticle = !this.showArticle;
  }
}
