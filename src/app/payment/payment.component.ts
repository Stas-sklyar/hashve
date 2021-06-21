import {
  Component,
  OnInit,
  Inject,
  HostListener,
  PLATFORM_ID,
} from "@angular/core";
import { ActivatedRoute, Router, UrlSerializer } from "@angular/router";
import { AppService } from "../app.service";
import { TranslateService } from "@ngx-translate/core";
import { Store } from "../business/model/store.model";
import { Package } from "../business/model/package.model";
import { ItemSize } from "../business/Enum/ItemSize";
import { City } from "../business/model/city.model";
import { Item } from "../business/model/item.model";
import { environment } from "../../environments/environment";
import { DeliveryType } from "../business/Enum/DeliveryType";
import { PaymentType } from "../business/Enum/PaymentType";
import { DiscountType } from "../business/Enum/DiscountType";
import { DestinationType } from "../business/Enum/DestinationType";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Order } from "../business/model/Order/Order";
import { timer } from "rxjs";
import { MetaService } from "@ngx-meta/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { isPlatformBrowser } from "@angular/common";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import * as _moment from "moment";
import { CalendarEvent } from "../business/model/calendar.event.model";
import event = google.maps.event;
import { ServerTimerService } from "../shared/service/server-timer.service";
import { NotificationPopupComponent } from "../shared/hashve.components/notification-popup/notification-popup.component";
import { MatDialog } from "@angular/material";

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: "LL",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MM-DD-YYYY",
    dateA11yLabel: "DD-MM-YYYY",
    monthYearA11yLabel: "MM-DD-YYYY",
  },
};

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PaymentComponent implements OnInit {
  transDate: any = {};
  orderForm: FormGroup;
  _ItemSize = ItemSize;
  step: number = 1;
  order: Order = new Order();
  sizesName = {
    normal: {
      en: "Normal",
      heb: "רגיל",
    },
    large: {
      en: "Large",
      heb: "גדול",
    },
    extraLarge: {
      en: "Extra",
      heb: "ענק",
    },
  };
  sizeArray = {
    0: {
      heb: "רגיל",
      en: "M",
    },
    40: {
      heb: "גדול",
      en: "L",
    },
    80: {
      heb: "ענק",
      en: "XL",
    },
  };

  timeOfDeliveryAndPickup = {
    defaultPickup: {
      heb: "עדכנו שעת מסירה",
      en: "",
    },
    defaultDelivery: {
      heb: "תיאום זמן משלוח",
      //heb: 'עדכנו שעת מסירה',
      en: "",
    },
    morning: {
      heb: "לתאם מסירה בתיאום טלפוני",
      //heb: '13:00 - 9:00',
      en: "13:00 - 9:00",
    },
    evening: {
      heb: "המשלוח יגיע במהלך היום",
      // heb: '20:00 - 13:00',
      en: "20:00 - 13:00",
    },
    everyTime: {
      // heb: 'אבקש לתאם את נהמשלוח מול המקבל',
      heb: "מבקש לתאם מסירה מול המקבל",
      en: "",
    },
  };
  deliveryType = DeliveryType.delivery;
  _deliveryType = DeliveryType;
  _destinationType = DestinationType;
  paymentType: PaymentType;
  _paymentType = PaymentType;
  host: string = environment.apihost;
  curLang: string;
  store: Store;
  events: CalendarEvent[];
  disabledDates = [];
  pack: Package;
  city: City;
  deliveryCities: City[];
  offerID: string;
  additionalItems: Item[] = [];
  package: Package;
  itemSize: boolean[] = [false, false, false];
  size: any = ItemSize;
  additionalItemFnc: boolean[] = [];
  timer: any;
  mindate = new Date();
  state = {
    minutes: 0,
    seconds: 0,
  };
  iframeUrl: SafeResourceUrl | string = "";
  showSlider = false;
  menuFixed: string = "";
  disableButton: boolean = false;
  @HostListener("window:scroll", ["$event"]) onWindowScroll(e) {
    if (isPlatformBrowser(this.platformId)) {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      this.menuFixed = scrollTop > 100 ? "top-0" : "";
    }
  }

  constructor(
    private route: ActivatedRoute,
    protected appService: AppService,
    private translateSrv: TranslateService,
    private readonly _meta: MetaService,
    private router: Router,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private serializer: UrlSerializer,
    private serverTimerService: ServerTimerService
  ) {
    this.transDate.he = {
      firstDayOfWeek: 0,
      dayNames: [
        "יום ראשון",
        "יום שני",
        "יום שלישי",
        "יום רביעי",
        "יום חמישי",
        "יום שישי",
        "יום שבת",
      ],
      dayNamesShort: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
      dayNamesMin: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
      monthNames: [
        "ינואר",
        "פברואר",
        "מרץ",
        "אפריל",
        "מאי",
        "יוני",
        "יולי",
        "אוגוסט",
        "ספטמבר",
        "אוקטובר",
        "נובמבר",
        "דצמבר",
      ],
      monthNamesShort: [
        "ינואר",
        "פברואר",
        "מרץ",
        "אפריל",
        "מאי",
        "יוני",
        "יולי",
        "אוגוסט",
        "ספטמבר",
        "אוקטובר",
        "נובמבר",
        "דצמבר",
      ],
      today: "היום",
      clear: "חדש",
    };
    this.appService.onRenderBackgroundImage.next(false);
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe((lang) => {
      this.curLang = lang.lang;
    });
    if (this.route.snapshot.data.payload[1].data.offer.finished === true) {
      this.appService
        .getOrderIdByOffer(this.route.snapshot.data.payload[1].data.offer._id)
        .subscribe((data: any) => {
          console.log(data);
          if (data.id) {
            this.router.navigateByUrl(`/order-history/${data.id}`);
          } else {
            console.log(data.id);
          }
        });
    } else {
      this.store = new Store(
        this.route.snapshot.data.payload[1].data.offer.store
      );
      this.events = this.route.snapshot.data.payload[0].map(
        (item) => new CalendarEvent(item)
      );
      this.disabledDates = [];
      this.events.forEach((cEvent) => {
        this.disabledDates = [
          ...this.disabledDates,
          ...this.getDates(cEvent.start, cEvent.end),
        ];
      });

      this.paymentType =
        this.store.payments.length > 0 ? this.store.payments[0] : null;
      this.offerID = this.route.snapshot.data.payload[1].data.offer._id;
      this.additionalItems =
        this.route.snapshot.data.payload[1].data.addItems.length > 0
          ? this.route.snapshot.data.payload[1].data.addItems.filter((item) =>
              this.store.items.find((obj) => obj.item === item._id)
                ? true
                : false
            )
          : [];
      this.pack = new Package(
        this.route.snapshot.data.payload[1].data.offer.package
      );
      this._meta.setTitle(
        !this.pack.tmp
          ? this.pack.name[this.curLang]
          : this.pack.baseItem.name[this.curLang]
      );
      if (this.pack.tmp) {
        this.pack.baseItem = this.appService.getImprovePrice(
          this.pack.baseItem
        );
        this.checkTimer();
      }
      if (this.pack.size === ItemSize.normal) {
        this.itemSize[0] = true;
      } else if (this.pack.size === ItemSize.large) {
        this.itemSize[1] = true;
      } else if (this.pack.size === ItemSize.extralarge) {
        this.itemSize[2] = true;
      }
      this.city = new City(this.route.snapshot.data.payload[1].data.offer.city);
      this.deliveryCities = this.route.snapshot.data.payload[1].data.deliveryDest;
      let items: Item[] = [];
      console.log(this.pack);
      this.additionalItems.forEach((item, index) => {
        if ((this.pack.addItems as string[]).indexOf(item._id) > -1) {
          this.additionalItemFnc[index] = true;
          items.push(item);
        }
      });
      this.pack.addItems = items;
    }
  }

  ngOnInit() {
    this.buildForm();
    //`https://direct.tranzila.com/hashve/iframe.php?template=custom&nosubmitlabel=1&lang=il&sum=${this.orderForm.get('deliveryDetails.deliveryType').value === DeliveryType.pickup ? this.store.getPackagePrice(this.pack) : this.store.getPackagePriceWithDelivery(this.pack, this.city._id)}&currency=1&storeid=${encodeURIComponent(this.store.name[this.curLang])}&pdesc=${encodeURIComponent(this.pack.stringifyPackage(this.additionalItems, this.store, this.city))}`;
    this.iframeUrl = "https://direct.tranzila.com";
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.iframeUrl as string
    );
    console.log(this.store.payments.indexOf(this._paymentType.phone));
  }

  getDates(startDate, endDate) {
    var dates = [],
      currentDate = startDate,
      addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  }

  dateFilter = (d: any): boolean => {
    //debugger;
    let day;

    day = d.day();
    // Prevent Saturday and Sunday from being selected.
    if (!this.store.shabatHours.active && day === 6) {
      return false;
    }
    let flag = true;
    this.events.forEach((cEvent) => {
      if (d.isSameOrAfter(cEvent.start) && d.isSameOrBefore(cEvent.end)) {
        flag = false;
      }
    });
    if (!flag) {
      return flag;
    }
    return true;
  };

  private buildForm(): void {
    this.orderForm = this.fb.group({
      customerDetails: this.fb.group({
        fullName: ["", [Validators.required]],
        mobile: [
          "",
          [
            Validators.required,
            Validators.pattern("[0-9]*(-?[0-9]+){1,2}"),
            Validators.minLength(9),
          ],
        ],
        email: ["", [Validators.email, Validators.required]],
        invoice: [false],
        companyName: [""],
        address: [""],
      }),
      deliveryDetails: this.fb.group({
        deliveryType: [DeliveryType.delivery],
        date: [],
        hours: [""],
        blessing: [""],
        specialRequests: [""],
        recipient: this.fb.group({
          fullName: [""],
          mobile: [""],
        }),
      }),
      deliveryAddress: this.fb.group({
        destinationType: [DestinationType.private],
        companyName: [""],
        city: [""],
        street: [""],
        house: [""],
        floor: [""],
        apartment: [""],
        instructions: [""],
      }),
      phonePaymentDetails: this.fb.group({
        // fullName: ['', Validators.required],
        // mobile: ['', [Validators.minLength(9), Validators.pattern("[0-9]*(-?[0-9]*){1,2}"), Validators.required]],
        // email: ['', [Validators.email, Validators.required]]
        fullName: [""],
        mobile: [""],
        email: [""],
      }),
    });

    this.orderForm
      .get("deliveryDetails.blessing")
      .setValidators([Validators.required]);

    this.orderForm
      .get("deliveryDetails.date")
      .setValidators([Validators.required]);

    // this.orderForm
    //   .get("deliveryDetails.hours")
    //   .setValidators([Validators.required]);

    this.orderForm
      .get("deliveryDetails.recipient.fullName")
      .setValidators([Validators.required]);
    this.orderForm
      .get("deliveryDetails.recipient.mobile")
      .setValidators([Validators.required]);

    this.orderForm
      .get("deliveryAddress.street")
      .setValidators([Validators.required]);

    this.orderForm
      .get("deliveryAddress.house")
      .setValidators([Validators.required]);
    // this.orderForm
    //   .get("deliveryAddress.apartment")
    //   .setValidators([Validators.required]);
    // this.orderForm.get("blessing").updateValueAndValidity();
    // this.orderForm.get("deliveryDetails.date").updateValueAndValidity();
    // this.orderForm.get("deliveryDetails.hours").updateValueAndValidity();
    // this.orderForm.get("deliveryDetails.recipient.fullName").updateValueAndValidity();
    // this.orderForm.get("deliveryDetails.recipient.mobile").updateValueAndValidity();
    // this.orderForm.get("deliveryAddress.street").updateValueAndValidity();

    this.orderForm
      .get("deliveryDetails")
      .get("deliveryType")
      .valueChanges.subscribe((data) => {
        if (data === DeliveryType.pickup) {
          this.orderForm
            .get("deliveryDetails.recipient.fullName")
            .clearValidators();
          this.orderForm.get("deliveryDetails.blessing").clearValidators();

          this.orderForm
            .get("deliveryDetails.recipient.mobile")
            .clearValidators();
          this.orderForm.get("deliveryAddress.street").clearValidators();
          this.orderForm.get("deliveryAddress.house").clearValidators();
          // this.orderForm.get("deliveryAddress.apartment").clearValidators();

          this.orderForm
            .get("deliveryDetails.recipient.fullName")
            .updateValueAndValidity();
          this.orderForm
            .get("deliveryDetails.recipient.mobile")
            .updateValueAndValidity();
          this.orderForm
            .get("deliveryDetails.blessing")
            .updateValueAndValidity();

          this.orderForm.get("deliveryAddress.street").updateValueAndValidity();
          this.orderForm.get("deliveryAddress.house").updateValueAndValidity();
          // this.orderForm.get("deliveryAddress.apartment").updateValueAndValidity();
        } else {
          this.orderForm
            .get("deliveryDetails.recipient.fullName")
            .setValidators([Validators.required]);

          this.orderForm
            .get("deliveryDetails.blessing")
            .setValidators([Validators.required]);

          this.orderForm
            .get("deliveryDetails.recipient.mobile")
            .setValidators([Validators.required]);

          this.orderForm
            .get("deliveryAddress.street")
            .setValidators([Validators.required]);
          this.orderForm
            .get("deliveryAddress.house")
            .setValidators([Validators.required]);
          // this.orderForm
          //   .get("deliveryAddress.apartment")
          //   .setValidators([Validators.required]);
        }
      });
  }

  toPayment() {
    this.disableButton = true;
    this.orderForm
      .get("phonePaymentDetails.fullName")
      .setValidators([Validators.required]);
    this.orderForm
      .get("phonePaymentDetails.mobile")
      .setValidators([
        Validators.minLength(9),
        Validators.pattern("[0-9]*(-?[0-9]*){1,2}"),
        Validators.required,
      ]);
    this.orderForm
      .get("phonePaymentDetails.email")
      .setValidators([Validators.email, Validators.required]);

    this.order.productOffer = this.offerID;
    this.order.price = this.store.getPackagePrice(this.pack);
    this.order.deliveryPrice =
      this.orderForm.value.deliveryDetails.deliveryType === DeliveryType.pickup
        ? 0
        : this.store.getDeliveryPrice(this.city._id);
    if (
      this.orderForm.value.deliveryDetails.deliveryType === DeliveryType.pickup
    ) {
      this.order.customerDitails = this.orderForm.value.customerDetails;
      this.order.deliveryDetails = this.orderForm.value.deliveryDetails;
    } else {
      this.order.customerDitails = this.orderForm.value.customerDetails;
      this.order.deliveryDetails = this.orderForm.value.deliveryDetails;
      this.order.deliveryAddress = this.orderForm.value.deliveryAddress;
      this.order.deliveryAddress.city = this.city._id;
    }
    if (this.pack && this.pack.baseItem.isPriceImproveValid()) {
      this.order.typeOfDiscount = DiscountType.ImprovePrice;
    } else if (this.pack && this.pack.baseItem.isSale()) {
      this.order.typeOfDiscount = DiscountType.Discount;
    } else if (this.pack && this.pack.baseItem.isDayDeal()) {
      this.order.typeOfDiscount = DiscountType.DailyDeal;
    } else {
      this.order.typeOfDiscount = DiscountType.NO;
    }

    this.appService.createOrder(this.order).subscribe((data) => {
      this.order._id = data.data._id;
      this.step = 2;
      this.orderForm
        .get("phonePaymentDetails.fullName")
        .setValue(this.orderForm.get("customerDetails.fullName").value);
      this.orderForm
        .get("phonePaymentDetails.mobile")
        .setValue(this.orderForm.get("customerDetails.mobile").value);
      this.orderForm
        .get("phonePaymentDetails.email")
        .setValue(this.orderForm.get("customerDetails.email").value);
      let queryParams = {
        contact: this.orderForm.get("customerDetails.fullName").value,
        email: this.orderForm.get("customerDetails.email").value,
        city: this.city.name[this.curLang],
        template: "custom",
        nosubmitlabel: 1,
        lang: "il",
        orderId: this.order._id,
        sum:
          this.orderForm.get("deliveryDetails.deliveryType").value ===
          DeliveryType.pickup
            ? this.store.getPackagePrice(this.pack)
            : this.store.getPackagePriceWithDelivery(this.pack, this.city._id),
        currency: 1,
        storeid: encodeURIComponent(this.store.name[this.curLang]),
        pdesc: encodeURIComponent(
          this.pack.stringifyPackage(
            this.additionalItems,
            this.store,
            this.city
          )
        ),
      };
      const tree = this.router.createUrlTree(["hashve", "iframe.php"], {
        queryParams,
      });
      let address =
        "https://direct.tranzila.com" + this.serializer.serialize(tree);
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(address);
    });
  }

  saveOrder(data) {
    // debugger;
    let body: any = {};
    if (this.paymentType === PaymentType.phone) {
      body.paymentType = PaymentType.phone;
      body.phonePaymentDetails = this.orderForm.value.phonePaymentDetails;
      const result = this.appService
        .updateOrder(this.order._id, body)
        .subscribe(
          (data) => {
            if (data.data && data.data._id) {
              this.router.navigateByUrl(`/order-history/${data.data._id}`);
            }
          },
          (err) => {
            setTimeout(() => {
              this.router.navigateByUrl(`/order-history/${this.order._id}`);
            }, 3000);
          }
        );
    } else {
      body.paymentType = PaymentType.creditCard;
      body.creditCardDetails = data;
      const result = this.appService
        .updateOrder(this.order._id, body)
        .subscribe(
          (data) => {
            if (data.data && data.data._id) {
              this.router.navigateByUrl(`/order-history/${data.data._id}`);
            }
          },
          (err) => {
            setTimeout(() => {
              this.router.navigateByUrl(`/order-history/${this.order._id}`);
            }, 3000);
          }
        );
      setTimeout(() => {
        this.router.navigateByUrl(`/order-history/${this.order._id}`);
      }, 3000);
    }
  }

  onOfficeOwnerTypeChanged(event, type) {
    if (
      type === DestinationType.private &&
      this.orderForm.get("deliveryAddress.destinationType").value ===
        DestinationType.private
    ) {
      (this.orderForm.controls["deliveryAddress"] as FormGroup).controls[
        "destinationType"
      ].setValue(DestinationType.office);
    } else if (
      type === DestinationType.office &&
      this.orderForm.get("deliveryAddress.destinationType").value ===
        DestinationType.office
    ) {
      (this.orderForm.controls["deliveryAddress"] as FormGroup).controls[
        "destinationType"
      ].setValue(DestinationType.private);
    } else {
      (this.orderForm.controls["deliveryAddress"] as FormGroup).controls[
        "destinationType"
      ].setValue(type);
    }
  }

  getDate() {
    let today: any = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    today = mm + "/" + dd + "/" + yyyy;
    return today;
  }

  onCityChanged(dest) {
    this.city = dest;
    this.appService.onSelcetedCityChanged.next(this.city);
  }

  setDeliveryTypeValue(val) {
    (this.orderForm.controls["deliveryDetails"] as FormGroup).controls[
      "deliveryType"
    ].setValue(val);
    this.iframeUrl = `https://direct.tranzila.com/hashve/iframe.php?template=custom&nosubmitlabel=1&lang=il&sum=${
      this.orderForm.get("deliveryDetails.deliveryType").value ===
      DeliveryType.pickup
        ? this.store.getPackagePrice(this.pack)
        : this.store.getPackagePriceWithDelivery(this.pack, this.city._id)
    }&currency=1&storeid=${encodeURIComponent(
      this.store.name[this.curLang]
    )}&pdesc=${encodeURIComponent(
      this.pack.stringifyPackage(this.additionalItems, this.store, this.city)
    )}`;
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.iframeUrl as string
    );
  }

  private checkTimer() {
    if (this.pack.tmp && this.pack.baseItem.isPriceImproveValid()) {
      this.timer = timer(1000, 1000);
      this.timer.subscribe((val) => {
        this.state.minutes = this.pack.baseItem.getMinutes();
        this.state.seconds = this.pack.baseItem.getSeconds();
      });
    }
  }

  onLoadFunc(financeiFrame) {
    // debugger;
    const source = financeiFrame.contentWindow.location.href;
    if (source !== "about:blank") {
      console.log(source);
      this.parseUrl(source);
    }
  }

  parseUrl(url) {
    // debugger;
    // let url = 'https://test.hashve.co.il/payment-result/true?tr_top=1%26Response%3D036%26o_tranmode%3D%26expmonth%3D01%26myid%3D123456789%26currency%3D1%26expyear%3D19%26supplier%3Dhashve%26pdesc%3D%D7%94%D7%96%D7%9E%D7%A0%D7%94:%20%D7%9E%D7%99%D7%9C%D7%A0%D7%94%20%D7%9E%D7%A7%27%27%D7%98%2057%0A%20%20%20%20%20%20%20%20%20%20%20%20%D7%9E%D7%9B%D7%99%D7%A8%20%D7%9B%D7%95%D7%9C%D7%9C%20%D7%9E%D7%A9%D7%9C%D7%95%D7%97%20%D7%91%D7%91%D7%90%D7%A8%20%D7%A9%D7%91%D7%A2.%20%0A%20%20%20%20%20%20%20%20%20%D7%A1%D7%94%27%27%D7%9B%20%D7%9C%D7%AA%D7%A9%D7%9C%D7%95%D7%9D:%20285%26sum%3D100%26benid%3Dlccicm7angc20kfp0pfvbdrbm0%26o_cred_type%3D%26template%3Dcustom%26lang%3Dil%26ccard%3D%26nosubmitlabel%3D1%26ccno%3D2312%26myfio%3D%26o_npay%3D%26storeid%3D%D7%A7%D7%95%D7%9C%D7%99%D7%91%D7%A8%D7%99%20%D7%A4%D7%A8%D7%97%D7%99%D7%9D%26ConfirmationCode%3D0000000%26cardtype%3D5%26cardissuer%3D1%26cardaquirer%3D0%26index%3D34%26Tempref%3D03140001%26';
    url = decodeURI(url);
    url = url.replace(/%26/g, "&");
    url = url.replace(/%3d/g, "=");
    url = url.replace(/%3D/g, "=");
    let tmp = url.split("?");
    console.log("parsed ? ", tmp);
    let result = tmp[0].endsWith("false")
      ? false
      : tmp[0].endsWith("true")
      ? true
      : null;
    let sum = -1;
    if (result === true) {
      let params = tmp[1].split("&");
      console.log("parsed params ", params);
      this.saveOrder(tmp[1]);
      // params.forEach(param => {
      //   if (param.startsWith("sum=")) {
      //     let sumTmp = param.replace("sum=", "");
      //     if (isNaN(+sumTmp)) {
      //       this.saveUndefinedOrder(url);
      //       console.log("is not number");
      //     } else {
      //       sum = +sumTmp;
      //       this.saveOrder(tmp[1]);
      //     }
      //   } else {
      //     this.saveUndefinedOrder(url);
      //   }
      // });
    } else {
      this.saveUndefinedOrder(url);
      console.log("Status not true");
    }
  }

  saveUndefinedOrder(data) {
    const body: any = {};
    body.paymentType = PaymentType.error;
    body.creditCardDetails = data;
    console.log("error responce", this.order);
    const result = this.appService
      .updateOrder(this.order._id, body)
      .subscribe((data) => {
        this.router.navigateByUrl(`/order-history/${data.data._id}`);
      });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.orderForm.controls;
  }

  timeOver = false;

  onDateChange(event: any): void {
    // this.timeOver = true;

    // const dialogRef = this.dialog.open(NotificationPopupComponent, {
    //   data: { store: this.store, city: this.city.name[this.curLang] }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('dialog closed');
    // });

    let date = new Date(this.orderForm.get("deliveryDetails.date").value);
    const offset = (date.getTimezoneOffset() - -2) / 60;
    date.setHours(date.getHours() - offset);
    if (isNaN(+date)) {
      return;
    }
    if (
      date.getFullYear() ===
        this.serverTimerService.currentDate.getFullYear() &&
      date.getMonth() === this.serverTimerService.currentDate.getMonth() &&
      date.getDate() === this.serverTimerService.currentDate.getDate()
    ) {
      if (
        (this.serverTimerService.currentDate.getDay() === 5 &&
          this.serverTimerService.currentDate.getHours() >= 13) ||
        (this.serverTimerService.currentDate.getDay() !== 5 &&
          this.serverTimerService.currentDate.getHours() >= 18)
      ) {
        // this.timeOver = true;
        this.orderForm.get("deliveryDetails.date").setValue("");

        const dialogRef = this.dialog.open(NotificationPopupComponent, {
          data: { store: this.store, city: this.city.name[this.curLang] },
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log("dialog closed");
        });
      }
    }
  }
}
