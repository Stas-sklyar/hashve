import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../app.service";
import { AppRouterState } from "../business/model/AppRouterState";
import { ApplicationState } from "../business/Enum/ApplicationState";
import { isPlatformServer } from "@angular/common";
import { MetaService } from "@ngx-meta/core";
import { ITranslate } from "../business/interfaces/ITranslate";
import { Seo } from "../business/model/seo";
import { TranslateService } from "@ngx-translate/core";
import { Category } from "../business/model/category.model";

@Component({
  selector: "app-home",
  templateUrl: "./category-page.component.html",
  styleUrls: ["./category-page.component.scss"],
})
export class CategoryPageComponent implements OnInit, AfterViewInit {
  data: any;
  categories: any;
  showSlider = false;
  link: boolean = false;
  curLang: string = "heb";
  seo: Seo = new Seo();
  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private readonly _meta: MetaService,
    private translateSrv: TranslateService,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });
    this.seo.h1 = {
      heb: "רשימת קטגוריות לבחירה",
      en: "Choice from Category List",
    };
    this.seo.description = {
      heb:
        "רשימת קטגוריות לבחירת מוצרים מקולקציות מרהיבות מקטלוג השווה שהכינו מעצבי פרחים ומתנות מובילים בישראל",
      en: "",
    };
    this.seo.title = {
      heb:
        "כל הקטגוריות:  מצאו מוצר אידיאלי מרשימת קטגוריות לבחירתכם | השווה - השוואת מחירים",
      en:
        "All Categories: Find An Ideal Product From A Category List Of Your Choice | Hashve - Compare prices",
    };

    this._meta.setTag("description", this.seo.description[this.curLang]);
    this._meta.setTitle(this.seo.title[this.curLang]);
  }

  ngAfterViewInit(): void {
    if (!this.appService.selectedCity) {
      this.appService.onCitySearchOpenWihoutShadow.next(true);
    }
  }

  ngOnInit() {
    this.data = this.route.snapshot.data.payload.filter(
      (item: Category) => !(item.subcategory && item.subcategory.length > 0)
    );
    this.categories = this.data;
    if (!isPlatformServer(this.platformId)) {
      this.appService.onRenderBackgroundImage.next(false);
    }
  }
}
