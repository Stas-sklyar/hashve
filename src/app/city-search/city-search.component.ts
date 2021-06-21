import { ConfigService } from "./../shared/service/config.service";
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from "@angular/core";
import { AppService } from "../app.service";
import { ActivatedRoute } from "@angular/router";
import { Store } from "../business/model/store.model";
import { Item } from "../business/model/item.model";
import { City } from "../business/model/city.model";
import { Category } from "../business/model/category.model";
import { TranslateService } from "@ngx-translate/core";
import {
  fadeInAnimation,
  listAnimation,
} from "../shared/animations/hashve.animations";
import { environment } from "../../environments/environment";
import { CategoryService } from "../shared/service/category.service";
import { MetaService } from "@ngx-meta/core";
import { SortingBy } from "../business/Enum/SortingBy";
import { Package } from "../business/model/package.model";
import { ItemSize } from "../business/Enum/ItemSize";
import { DeviceDetectorService } from "ngx-device-detector";
import { isPlatformBrowser } from "@angular/common";

interface IFilter {
  categoryFilter: Category;
  filter: string;
}

@Component({
  selector: "app-city-search",
  templateUrl: "./city-search.component.html",
  styleUrls: ["./city-search.component.scss"],
  animations: [listAnimation, fadeInAnimation],
})
export class CitySearchComponent implements OnInit, OnDestroy {
  curLang: string;
  link: string = "";
  defaultFilterCategory: Category = new Category({
    name: {
      heb: " כל המוצרים",
      en: " All bouquets",
    },
    _id: "123456",
  });
  filterResult: IFilter;
  categoryName: string = "";
  // sortBy: string = '';
  showMap = false;
  cat: Category;
  sorting: SortingBy = SortingBy.na;
  host: string = environment.apihost;
  stores: Array<Store> = [];
  items: Array<Item> = [];
  filteredItems: Array<Item> = [];
  additionalItems: Array<Item> = [];
  city: City;
  categories: Array<Category> = [];
  showSlider = false;
  pageSubscr: any;
  showArticle: boolean = true;
  isMobile: boolean = false;
  sortLable = {
    na: { en: "na", heb: "אין" },
    count: { en: "Orders Number", heb: "מס‘ הזמנות" },
    rate: { en: "Rating", heb: "דירוג (מגבוהה לנמוך )" },
    price: { en: "Price", heb: "מחיר (מנמוך לגבוהה)" },
  };
  sortDDLClosed = true;
  menuFixed: string = "";
  banners = [];
  @HostListener("window:scroll", ["$event"]) onWindowScroll(e) {
    if (isPlatformBrowser(this.platformId)) {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      this.menuFixed = scrollTop > 100 ? "full-height" : "";
    }
  }

  constructor(
    private route: ActivatedRoute,
    protected appService: AppService,
    protected categoryService: CategoryService,
    private readonly _meta: MetaService,
    private translateSrv: TranslateService,
    @Inject(PLATFORM_ID) private platformId,
    private deviceService: DeviceDetectorService,
    private configService: ConfigService
  ) {
    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.appService.onRenderBackgroundImage.next(false);

    this.configService.getActiveBannerCitySearchPage().subscribe((data) => {
      this.banners = data;
    });

    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });

    this.filterResult = {
      categoryFilter: new Category(this.defaultFilterCategory),
      filter: "",
    };

    this.categoryService.getCategoriesWithoutLogin().subscribe((data) => {
      let headers: Array<Category> = data.filter(
        (item: Category) => item.subcategory && item.subcategory.length > 0
      );
      headers.forEach((item, index) => {
        item.subcategory.forEach((i, ind) => {
          const cat = data.find((el) => el._id === i);
          if (cat) {
            headers[index].subcategory[ind] = cat;
          }
        });
      });
      this.categories = headers;

      if (this.categoryName !== "") {
        const cat = this.findCategoryByName();
        if (cat) {
          this.filterItems(cat);
        }
      } else {
        this.filterRecomended();
      }
      this.sortBy(SortingBy.numberOfOrders);
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.showMap = params["showMap"];
    });
    this.pageSubscr = this.route.params.subscribe((params) => {
      this.items = [];
      this.additionalItems = [];
      this.categoryName = params.category.replace(/_/g, " ");
      if (params.category === "") {
        this.filterResult = {
          categoryFilter: new Category(this.defaultFilterCategory),
          filter: "",
        };
      }
      this.stores = this.route.snapshot.data.payload.stores.map((item) => {
        return new Store(item);
      });
      this.route.snapshot.data.payload.items.forEach((item) => {
        if (item.additional) {
          this.additionalItems.push(new Item(item));
        } else {
          this.items.push(new Item(item));
        }
      });
      this.filteredItems = this.items;

      this.city = new City(
        this.route.snapshot.data.payload.city !== undefined
          ? this.route.snapshot.data.payload.city[0]
          : this.appService.selectedCity
      );
      this.link = `/פרחים_${this.city.name.heb.replace(/\s/g, "_")}`;
      if (this.categoryName) {
        this.translateSrv
          .get(["seo.citySearch.h1", "seo.citySearch.description"], {
            city: this.city.name[this.curLang],
            category: this.categoryName,
          })
          .subscribe((data) => {
            this._meta.setTitle(data["seo.citySearch.h1"]);
            this._meta.setTag(
              "description",
              data["seo.citySearch.description"]
            );
          });
      } else {
        this._meta.setTitle(this.city.seo.title[this.curLang]);
        this._meta.setTag(
          "description",
          this.city.seo.description[this.curLang]
        );
      }

      if (this.categoryName !== "" && this.categories.length > 0) {
        const cat = this.findCategoryByName();
        if (cat) {
          this.filterItems(cat);
        }
      } else {
        this.filterRecomended();
      }
      this.sortBy(SortingBy.numberOfOrders);
      this.appService.onSelcetedCityChanged.next(this.city);
    });
  }

  findCategoryByName(): Category {
    let category: Category;
    out: for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].name[this.curLang] === this.categoryName) {
        category = this.categories[i];
        break out;
      }
      for (let j = 0; j < this.categories[i].subcategory.length; j++) {
        if (
          (this.categories[i].subcategory[j] as Category).name[
            this.curLang
          ].trim() === this.categoryName.trim()
        ) {
          category = this.categories[i].subcategory[j] as Category;
          break out;
        }
      }
    }
    return category;
  }

  filterItems(category) {
    if (category.subcategory && category.subcategory.length > 0) {
      this.filteredItems = [];
      let tmp = this.items.filter((element) => {
        let flag = false;
        category.subcategory.forEach((item) => {
          if (element.category.indexOf(item._id) > -1) {
            flag = true;
          }
        });
        return flag;
      });
      tmp.map((i) => {
        this.filteredItems.push(i);
      });
    } else {
      if (this.defaultFilterCategory._id === category._id) {
        this.filteredItems = [];
        this.items.map((i) => {
          this.filteredItems.push(i);
        });
      } else {
        this.filteredItems = [];
        let tmp = this.items.filter((element) => {
          return element.category.indexOf(category._id) > -1;
        });
        tmp.map((i) => {
          this.filteredItems.push(i);
        });
      }
    }
    this.filterResult.categoryFilter = category;
  }

  filterRecomended() {
    this.filteredItems = [];
    let tmp = this.items.filter((element) => {
      return element.recommended;
    });
    tmp.map((i) => {
      this.filteredItems.push(i);
    });
  }

  ngOnDestroy(): void {
    this.pageSubscr.unsubscribe();
  }

  toggleArticle() {
    this.showArticle = !this.showArticle;
  }

  filterStores(stores): Store[] {
    return stores.filter((item) => item.city === this.city._id);
  }

  sortBy(sorting, event = null): void {
    let tmp = JSON.parse(JSON.stringify(this.filteredItems)).map(
      (item) => new Item(item)
    );
    this.filteredItems = this.sortItems(sorting, tmp);
    if (event) {
      this.sortDDLClosed = true;
    }
  }

  sortItems(sorting, items): Item[] {
    this.sorting = sorting;
    switch (sorting) {
      case SortingBy.numberOfOrders:
        items.sort((a, b) => {
          if (a.reviewsCount > b.reviewsCount) {
            return -1;
          }
          if (a.reviewsCount < b.reviewsCount) {
            return 1;
          }
          return 0;
        });
        break;
      case SortingBy.rating:
        items.sort((a, b) => {
          if (a.rating > b.rating) {
            return -1;
          }
          if (a.rating < b.rating) {
            return 1;
          }
          return 0;
        });
        break;
      case SortingBy.price:
        items.sort((a, b) => {
          if (a.minPrice < b.minPrice) {
            return -1;
          }
          if (a.minPrice > b.minPrice) {
            return 1;
          }
          return 0;
        });
        break;
    }
    return items;
  }

  uglify(text: string): string {
    return text.replace(/\s/g, "_");
  }

  selectCity() {
    this.appService.onCitySearchOpen.next(true);
  }

  byItem(event) {
    this.appService.createCurrentCityStoreItemOffer(event.store, event.item);
  }

  trackByFn(index, item) {
    return item._id;
    // or if you have no unique identifier:
    // return index;
  }
}
