import { Component, OnInit } from "@angular/core";
import { fadeInFadeOutAnimation } from "../../animations/hashve.animations";
import { TranslateService } from "@ngx-translate/core";
import { CityService } from "../../service/city.service";
import { AppService } from "../../../app.service";
import { CategoryService } from "../../service/category.service";
import { Router } from "@angular/router";
import { City } from "../../../business/model/city.model";
import { ApplicationState } from "../../../business/Enum/ApplicationState";

@Component({
  selector: "app-delivery-panel",
  templateUrl: "./delivery-panel.component.html",
  styleUrls: ["./delivery-panel.component.scss"],
  animations: [fadeInFadeOutAnimation],
})
export class DeliveryPanelComponent implements OnInit {
  public deliveryState: string = "collapsed";
  public curLang: string;
  public cityList: Array<City> = [];
  public cityFilteredList: Array<City> = [];
  public ddlStatus: string = "none";
  public selectedCity: City;
  public selectedStreet: string;
  public selectedNumber: number;
  public findedCity: City = null;
  public tmpCity: City;
  public tmp: City = null;
  public showShadow: boolean = false;
  public showHelp: boolean = false;
  public cityHistoryList = this.appService.getStoreSearchHistory();

  constructor(
    private translateSrv: TranslateService,
    protected cityService: CityService,
    protected appService: AppService,
    protected categoryService: CategoryService,
    private route: Router
  ) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });
    this.cityService.getCitiesWithoutLogin().subscribe((data: any) => {
      this.cityList = data.data;
      this.cityList.sort((a, b) => {
        if (a.inPopular || b.inPopular) {
          if (a.inPopular && !b.inPopular) {
            return -1;
          } else if (!a.inPopular && b.inPopular) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (a.name[this.curLang] > b.name[this.curLang]) {
            return 1;
          } else if (a.name[this.curLang] < b.name[this.curLang]) {
            return -1;
          } else {
            return 0;
          }
        }
      });
      this.cityFilteredList = this.cityList;
    });
    this.appService.onCitySearchOpen.subscribe((data) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.showShadow = true;
      this.showHelp = true;
      this.deliveryState = "expanded";
    });
    this.appService.onCitySearchOpenWihoutShadow.subscribe((data) => {
      this.showHelp = true;
      this.deliveryState = "expanded";
    });
  }

  ngOnInit() {
    if (this.appService.selectedCity) {
      this.findedCity = this.findedCity;
    }
    this.appService.onSelcetedCityChanged.subscribe((data) => {
      this.findedCity = data;
    });
  }

  closeDiv(city) {
    this.cityHistoryList = this.appService.removeFromStoreSearchHistory(city);
  }

  setSearchCity(city) {
    this.selectedCity = this.cityFilteredList.find(
      (item) => item._id === city._id
    );
    this.tmp = this.selectedCity;
  }

  changeStateOfDeliveryForm() {
    this.deliveryState =
      this.deliveryState === "collapsed" ? "expanded" : "collapsed";
    if (this.deliveryState === "expanded") {
      this.selectedCity = this.findedCity;
    }
  }

  showCityList($event) {
    if ($event.type === "focus") {
      setTimeout(() => {
        this.ddlStatus = "block";
      }, 500);
    } else {
      setTimeout(() => {
        this.ddlStatus = "none";
      }, 500);
    }
  }

  selectCity(city) {
    this.selectedCity = city;
    this.tmp = city;
  }

  setCity($event): void {
    this.selectedCity = this.tmp
      ? this.tmp
      : this.cityFilteredList.length === 1
      ? this.cityFilteredList[0]
      : null;
    this.tmp = null;
    this.appService.addStoreSearchHistory({
      _id: this.selectedCity._id,
      name: this.selectedCity.name,
    });
    if (this.selectedCity) {
      this.findedCity = this.selectedCity;
      this.appService.onSelcetedCityChanged.next(this.findedCity);
      this.changeStateOfDeliveryForm();
      if (
        this.appService.routerState &&
        !this.appService.routerState.isEmpty()
      ) {
        this.showShadow = false;
        this.showHelp = false;
        switch (this.appService.routerState.state) {
          case ApplicationState.Category:
            const link: string = `/פרחים_${this.appService.selectedCity.name.heb.replace(
              /\s/g,
              "_"
            )}/${this.appService.routerState.element.name.heb.replace(
              /\s/g,
              "_"
            )}`;
            this.appService.routerState.resetState();
            this.showShadow = false;
            this.showHelp = false;
            this.route.navigateByUrl(link);
            break;
          case ApplicationState.ImprovePrice:
            this.appService.routerState.resetState();
            this.showShadow = false;
            this.showHelp = false;
            this.route.navigateByUrl(
              `/שיפור-מחיר/${this.appService.selectedCity.name.heb.replace(
                /\s/g,
                "_"
              )}`
            );
            break;
          case ApplicationState.HomePageItem:
            this.appService.createOffer();
            this.showShadow = false;
            this.showHelp = false;
            this.appService.routerState.resetState();
            break;
          case ApplicationState.ItemPage:
            this.showShadow = false;
            this.showHelp = false;
            let item = this.appService.routerState.element;
            this.appService.routerState.resetState();
            this.appService.createCityOffer(item, this.appService.selectedCity);
            /*this.route.navigateByUrl(`/item/${this.appService.routerState.element.name.heb.replace(/\s/g, '_')}/${this.appService.selectedCity.name.heb.replace(/\s/g, '_')}`);*/
            break;
          case ApplicationState.WishList:
            this.showShadow = false;
            this.showHelp = false;
            this.appService.routerState.resetState();
            this.route.navigateByUrl(
              "/wishlist/" +
                this.appService.selectedCity.name[this.curLang].replace(
                  /\s/g,
                  "_"
                )
            );
            break;
        }
      } else {
        this.route.navigateByUrl(
          `פרחים_${this.findedCity.name.heb.replace(/\s/g, "_")}`
        );
        this.showShadow = false;
      }
    }
  }

  filterCities($event) {
    const value = $event.target.value;
    const toCompare = value.toLowerCase();
    this.cityFilteredList = [];

    this.cityFilteredList = this.cityList.filter((item) => {
      return this.checkInside(item, toCompare);
    });

    if (this.cityFilteredList.length === 1) {
      this.tmpCity = this.cityFilteredList[0];
    }
  }

  stopPropagation(event): void {
    event.stopPropagation();
  }

  isEmpty(str): boolean {
    let val: boolean =
      str === undefined || str.trim(" ").length === 0 ? true : false;
    return val;
  }

  private checkInside(item: any, term: string) {
    for (let property in item) {
      if (item[property] === null || item[property] == undefined) {
        continue;
      }
      if (typeof item[property] === "object") {
        if (this.checkInside(item[property], term)) {
          return true;
        }
      } else if (item[property].toString().toLowerCase().includes(term)) {
        return true;
      }
    }
    return false;
  }
}
