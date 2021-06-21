import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Store } from "../../../business/model/store.model";
import { isPlatformServer } from "@angular/common";
import { City } from "../../../business/model/city.model";
import { CityService } from "../../service/city.service";
import { AppService } from "../../../app.service";
import { ZoomInComponent } from "../zoom-in/zoom-in.component";

@Component({
  selector: "app-shop-about",
  templateUrl: "./shop-about.component.html",
  styleUrls: ["./shop-about.component.scss"],
})
export class ShopAboutComponent implements OnInit {
  curLang = "heb";
  // tslint:disable-next-line: variable-name
  _store: Store;
  city: City;
  data: any;
  dayDeal: any;
  serverFlag = false;
  // imgs: string[] = [];
  deliveryCities: City[] = [];
  offset = new Date().getTimezoneOffset() / 60 - -2;
  productDayConfig: any = {
    loop: true,
    slidesPerView: 4,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  };
  @Input()
  set store(value: Store) {
    this._store = value;
    this.cityService.getCitiesWithoutLogin().subscribe((data) => {
      const deliveryArray: string[] = this._store.delivery.map(
        (item) => item.city
      ) as string[];
      this.deliveryCities = data.data
        .filter((item) => deliveryArray.indexOf(item._id) > -1)
        .map((item) => new City(item));
    });
  }

  @Output() scrollTo: EventEmitter<any> = new EventEmitter<any>();
  scroll(to: any) {
    setTimeout(() => {
      this.scrollTo.emit(to);
    }, 20);
  }

  constructor(
    private translateSrv: TranslateService,
    @Inject(PLATFORM_ID) private platformId,
    private cityService: CityService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private appService: AppService
  ) {
    this.curLang = translateSrv.currentLang;
    this.serverFlag = isPlatformServer(this.platformId);
    translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });
    this.appService.onSelcetedCityChanged.subscribe((data) => {
      this.city = data;
    });
  }

  ngOnInit() {
    // this.imgs = [...this._store.pic];
    // this._store.pic = (this._store.pic as string[]).sort(() => 0.5 - Math.random()).slice(0, 4);

    this.data = this.route.snapshot.data.payload;
    this.dayDeal = this.data.home.DalyList;
  }

  changeDelivery(delcity) {
    this.appService.onSelcetedCityChanged.next(delcity);
  }

  showZoomImage(img) {
    const dialogRef = this.dialog.open(ZoomInComponent, {
      data: { img },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
