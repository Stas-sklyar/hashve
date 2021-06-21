import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CityService } from "../../service/city.service";
import { CategoryService } from "../../service/category.service";
import { AppService } from "../../../app.service";
import { fadeInFadeOutAnimation } from "../../../shared/animations/hashve.animations";
import { Category } from "../../../business/model/category.model";
import { Store } from "../../../business/model/store.model";
import { Router } from "@angular/router";
import { ApplicationState } from "../../../business/Enum/ApplicationState";
import { AppRouterState } from "../../../business/model/AppRouterState";
import { City } from "../../../business/model/city.model";
import { ICustomer } from "../../../business/interfaces/ICustomer";
import { Customer } from "../../../business/model/customer.model";
import { CustomerModuleservice } from "../../service/Resolvers/customer-module.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  animations: [fadeInFadeOutAnimation],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Input() slider = null;
  public curLang: string;
  public mobileMenu: string = "collapsed";
  public closeMenu: boolean = true;
  public categories: Category[] = [];
  public topMenu: Category[] = [];
  public showWH: boolean = false;
  public showRate: boolean = false;
  public cityChangedSubscription;
  public inCity: boolean;
  public city: City;
  private styleTag: HTMLStyleElement;
  deliveryCities: City[] = [];
  @Input() showSlider: boolean = true;
  @Input() banner = [];
  @Input() itemName: boolean = true;
  @Input() showMobileMenu: boolean = true;
  @Input() showDeliveryPanel: boolean = true;
  @Input() store: Store = null;
  Islogged: boolean = false;
  customer: ICustomer

  constructor(
    private translateSrv: TranslateService,
    protected cityService: CityService,
    protected appService: AppService,
    protected categoryService: CategoryService,
    private route: Router,
    private _CustomerModuleservice: CustomerModuleservice,
    private cdr: ChangeDetectorRef
  ) {
    this.curLang = translateSrv.currentLang;
    this.inCity = this.appService.selectedCity ? true : false;
    this.city = this.appService.selectedCity;
    this.appService.onSelcetedCityChanged.subscribe((data) => {
      this.city = data;
    });
    translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });
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
      this.topMenu = data.filter((item) => item.toTopMenu === true);
    });

    this.appService.onSideMenuToggle.subscribe((data) => {
      this.onMenuClicked();
    });
  }

  config1: any = {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  };
  config2: any = {
    slidesPerView: "auto",
    freeMode: true,
    mousewheel: true,
  };

  ngOnInit() {
    this.customer = new Customer({});
    this._CustomerModuleservice.checkUserLogged().then(result => {
      if (result) {
        this.Islogged = true;
        this.customer = this._CustomerModuleservice.customer
      }
    })
  }

  onMenuClicked() {
    this.mobileMenu =
      this.mobileMenu === "collapsed" ? "expanded" : "collapsed";
    setTimeout(() => {
      this.closeMenu = !this.closeMenu;
      if (this.closeMenu === false) {
        this.styleTag = this.buildStyleElement();
        document.body.appendChild(this.styleTag);
      } else {
        document.body.removeChild(this.styleTag);
      }
    }, 300);
  }

  categoryMenuNavigate(item) {
    if (!this.appService.selectedCity) {
      this.appService.routerState = new AppRouterState({
        state: ApplicationState.Category,
        element: item,
      });
      this.appService.onCitySearchOpen.next(true);
    } else {
      const link: string = `/פרחים_${this.appService.selectedCity.name.heb.replace(
        /\s/g,
        "_"
      )}/${item.name.heb.replace(/\s/g, "_")}`;
      this.route.navigateByUrl(link);
    }
  }

  onRegistrationFormOpen(type) {
    if (type === 'auth') {
      this.appService.onAuthFormOpen.next(true);
    } else {
      this.appService.onRegistrationFormOpen.next(true);
    }
  }

  openWishList() {
    this.appService.routerState = new AppRouterState({
      state: ApplicationState.WishList,
      element: "",
    });
    this.onMenuClicked();
    this.appService.onCitySearchOpen.next(true);
  }

  scroll(to: any) {
    setTimeout(() => {
      window.document.getElementById(to).scrollIntoView({ behavior: "smooth" });
    }, 20);
  }

  navigate(store) {
    window.location.href = `https://www.waze.com/ul?q=${store.address.heb}&navigate=yes`;
  }

  private buildStyleElement(): HTMLStyleElement {
    var style = document.createElement("style");
    style.type = "text/css";
    style.setAttribute("data-debug", "Injected by popup city search map.");
    style.textContent = `
            body {
                overflow: hidden !important ;
            }
        `;
    return style;
  }

  navigateToImprovePrice() {
    this.onMenuClicked();
    if (this.appService.selectedCity) {
      const link = `/שיפור-מחיר/${this.appService.selectedCity.name.heb.replace(
        /\s/g,
        "_"
      )}`;
      this.appService.navigateByLink(link);
    } else {
      this.appService.routerState = new AppRouterState({
        state: ApplicationState.ImprovePrice,
      });
      this.appService.onCitySearchOpen.next(true);
    }
  }

  ngAfterViewInit(): void {
    if (this.store) {
      this.cityService.getCitiesWithoutLogin().subscribe((data) => {
        let deliveryArray: string[] = <string[]>(
          this.store.delivery.map((item) => item.city)
        );
        this.deliveryCities = data.data
          .filter((item) => deliveryArray.indexOf(item._id) > -1)
          .map((item) => new City(item));
      });
      this.cdr.detectChanges();
    } else {
      this.cdr.detectChanges();
    }
  }
  redirectToProfile() {
    this.appService.navigateByLink('user/profile');
  }
  redirectToOrders() {
    this.appService.navigateByLink('user/order-list');
  }
  changeDelivery(delcity) {
    this.appService.onSelcetedCityChanged.next(delcity);
  }
}
