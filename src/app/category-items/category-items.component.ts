import {
  Component,
  Inject,
  AfterViewInit,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { Item } from "../business/model/item.model";
import { ActivatedRoute } from "@angular/router";
import { Category } from "../business/model/category.model";
import { MetaService } from "@ngx-meta/core";
import { fadeInFadeOutAnimation } from "../shared/animations/hashve.animations";
import { isPlatformServer } from "@angular/common";
import { AppService } from "../app.service";
import { ConfigService } from "../shared/service/config.service";

@Component({
  selector: "app-category-items",
  templateUrl: "./category-items.component.html",
  styleUrls: ["./category-items.component.css"],
  animations: [fadeInFadeOutAnimation],
})
export class CategoryItemsComponent implements OnInit, AfterViewInit {
  items: Item[] = [];
  categoryID: string = "";
  categoryName: string = "";
  categories: Category[] = [];
  category: Category;
  showText: boolean = true;
  deliveryState: string = "expanded";
  curLang: string = "heb";
  slider: any;
  constructor(
    private route: ActivatedRoute,
    private readonly _meta: MetaService,
    private configService: ConfigService,
    @Inject(PLATFORM_ID) private platformId,
    private appService: AppService
  ) {
    if (!isPlatformServer(this.platformId)) {
      this.appService.onRenderBackgroundImage.next(true);
    }
    this.configService.getActiveSlider().subscribe((data) => {
      this.slider = data;
      this.slider.slides = this.slider.slides.filter((item) => item.active);
    });
    this.items = this.route.snapshot.data.payload[0].data.map(
      (item) => new Item(item)
    );
    this.category = this.route.snapshot.data.payload[0].category;
    if (this.category) {
      this._meta.setTitle(this.category.seo.title[this.curLang]);
      this._meta.setTag(
        "description",
        this.category.seo.description[this.curLang]
      );
    }
    this.categories = this.route.snapshot.data.payload[1];
    this.route.params.subscribe((data) => {
      this.categoryName = data.categoryName.replace(/_/g, " ");
      this.category = this.route.snapshot.data.payload[0].category;
      if (this.category) {
        this.categoryID = this.category._id;
        if (this.category) {
          this._meta.setTitle(this.category.seo.title[this.curLang]);
          this._meta.setTag(
            "description",
            this.category.seo.description[this.curLang]
          );
        }
      } else {
        console.log("there is no route");
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (!this.appService.selectedCity) {
      this.appService.onCitySearchOpenWihoutShadow.next(true);
    }
  }

  toggleText() {
    this.showText = !this.showText;
    this.deliveryState =
      this.deliveryState === "collapsed" ? "expanded" : "collapsed";
  }
}
