import { ConfigService } from "./../shared/service/config.service";
import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppService } from "../app.service";
import { Item } from "../business/model/item.model";
import { Store } from "../business/model/store.model";
import { Package } from "../business/model/package.model";
import { Article } from "../business/model/article.model";
import { fadeInFadeOutAnimation } from "../shared/animations/hashve.animations";
import { City } from "../business/model/city.model";
import { CategoryService } from "../shared/service/category.service";
import { MetaService } from "@ngx-meta/core";

@Component({
  selector: "app-store-in-city-page",
  templateUrl: "./store-in-city-page.component.html",
  styleUrls: ["./store-in-city-page.component.scss"],
  animations: [fadeInFadeOutAnimation],
})
export class StoreInCityPageComponent implements OnInit {
  @ViewChild("mapElement", { static: false }) mapElement: ElementRef;
  map: google.maps.Map;
  markers: google.maps.Marker[] = [];
  curLang: string = "heb";
  city: City;
  idCity: string;
  cityName: string;
  toCityLink: string;
  data: any;
  allStores: Array<Store>;
  storeList: Array<Store>;
  storeList2: Array<Store>;
  pakages: Array<Package>;
  dalyDeal: Array<Item>;
  article: Article;
  showSlider = false;
  public deliveryState: string = "expanded";
  showArticle: boolean = true;
  storeMarkers: any[] = [];
  activeItem: any;
  activeItemIndex: number = 0;
  banners: any[] = [];
  colors: Array<string> = [
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
    "#66994D",
    "#B366CC",
    "#4D8000",
    "#B33300",
    "#CC80CC",
    "#66664D",
    "#991AFF",
    "#E666FF",
    "#4DB3FF",
    "#1AB399",
    "#E666B3",
    "#33991A",
    "#CC9999",
    "#B3B31A",
    "#00E680",
    "#4D8066",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#9900B3",
    "#E64D66",
    "#4DB380",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF",
  ];

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private readonly _meta: MetaService,
    private configService: ConfigService
  ) {
    this.city = new City(this.route.snapshot.data.payload.city[0]);
    this.appService.onSelcetedCityChanged.next(this.city);
    this.configService.getActiveBannerCitySearchPage().subscribe((data) => {
      this.banners = data;
    });
    this.cityName = this.route.snapshot.data.payload.city[0].name[this.curLang];
    this.toCityLink =
      "פרחים_" +
      this.route.snapshot.data.payload.city[0].name[this.curLang].replace(
        /\s/g,
        "_"
      );
    this.idCity = this.route.snapshot.data.payload.city[0]._id;

    this.route.snapshot.data.payload.storeList.forEach((element, index) => {
      element.color = this.colors[index];
    });

    this.allStores = this.route.snapshot.data.payload.storeList;
    this.storeList = this.route.snapshot.data.payload.storeList.filter(
      (item) => item.city === this.idCity
    );
    this.storeList2 = this.route.snapshot.data.payload.storeList.filter(
      (item) => item.city !== this.idCity
    );

    this.dalyDeal = this.route.snapshot.data.payload.dalyList.map(
      (item) => new Item(item)
    );

    this.activeItem = this.dalyDeal[this.activeItemIndex];

    this.pakages = this.route.snapshot.data.payload.packages.map(
      (item) => new Package(item)
    );
    this.article = new Article(this.route.snapshot.data.payload.article);
    if (this.article && this.article.seo) {
      this._meta.setTitle(this.article.seo.title[this.curLang]);
      this._meta.setTag(
        "description",
        this.article.seo.description[this.curLang]
      );
    }

    this.appService.onRenderBackgroundImage.next(false);
  }

  ngOnInit() {}

  mouseEnter(storeId: number) {
    this.storeMarkers[storeId].infoWindow.open(
      this.map,
      this.storeMarkers[storeId].marker
    );
  }

  mouseLeave(storeId: number) {
    this.storeMarkers[storeId].infoWindow.close();
  }

  ngAfterViewInit() {
    this.fixHeight();
    if (this.storeList.length > 0) {
      let lat = 0,
        lng = 0,
        count = 0;
      this.storeList.forEach((store) => {
        lat += store.storeLocation.lat;
        lng += store.storeLocation.lng;
        count++;
      });
      const mapProperties = {
        center: new google.maps.LatLng(lat / count, lng / count),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };
      this.map = new google.maps.Map(
        this.mapElement.nativeElement,
        mapProperties
      );

      this.allStores.forEach((store, index) => {
        let icon = {
          path:
            "M26.85,42.47c3.37-4.67,7.02-10.28,9.5-15.71c0.55-1.2,0.96-2.45,1.24-3.75c0.28-1.29,0.42-2.63,0.42-4h0\n" +
            "\tc0-5.24-2.14-9.99-5.58-13.43C28.99,2.13,24.24,0,19,0v0C13.76,0,9.01,2.14,5.57,5.58C2.13,9.02,0,13.77,0,19.01\n" +
            "\tc0,1.37,0.14,2.71,0.42,4c0.28,1.3,0.69,2.55,1.24,3.75c1.87,4.09,4.41,8.3,6.99,12.13c4.23,6.27,8.57,11.47,10.36,13.56\n" +
            "\tC20.43,50.77,23.5,47.1,26.85,42.47L26.85,42.47z",
          fillColor: store.color,
          fillOpacity: 1,
          anchor: new google.maps.Point(0, 0),
          strokeWeight: 0,
          scale: 0.5,
        };
        store.link = store.ind + "-" + store.name.heb.replace(/\s/g, "-");
        let contentString = `
          <div class="shop-map__label">
            <div class="shop-map__name"><a href="${store.link}">${
          store.name[this.curLang]
        }</a></div>
            <div class="shop-map__mark"><span class="shop-map__mark-num">${
              store.rating
            }</span> דירוד</div>
          </div>
        `;

        this.storeMarkers[store.ind] = {
          marker: new google.maps.Marker({
            position: {
              lat: store.storeLocation.lat,
              lng: store.storeLocation.lng,
            },
            map: this.map,
            draggable: false,
            icon: icon,
          }),
          infoWindow: new google.maps.InfoWindow({
            content: contentString,
          }),
        };

        this.storeMarkers[store.ind].marker.addListener("mouseover", () => {
          this.storeMarkers[store.ind].infoWindow.open(
            this.map,
            this.storeMarkers[store.ind].marker
          );
          this.activeItemIndex = this.allStores
            .map((e) => e.ind)
            .indexOf(store.ind);
          this.allStores.forEach((shop) => (shop.isHover = false));
          this.allStores[this.activeItemIndex].isHover = true;
          this.activeItem = this.dalyDeal[this.activeItemIndex];
        });

        // this.storeMarkers[store.ind].marker.addListener('mouseout', () => {
        //   this.storeMarkers[store.ind].infoWindow.close();
        // });
        this.storeMarkers[store.ind].marker.addListener("click", () => {
          this.storeMarkers[store.ind].infoWindow.open(
            this.map,
            this.storeMarkers[store.ind].marker
          );
          this.activeItemIndex = this.allStores
            .map((e) => e.ind)
            .indexOf(store.ind);
          this.allStores.forEach((shop) => (shop.isHover = false));
          this.allStores[this.activeItemIndex].isHover = true;
          this.activeItem = this.dalyDeal[this.activeItemIndex];
        });
      });
    }
  }

  toggleArticle() {
    this.deliveryState =
      this.deliveryState === "collapsed" ? "expanded" : "collapsed";
    this.showArticle = !this.showArticle;
  }

  fixHeight() {
    let elements = document.getElementsByClassName("shop-map-list__item");
    var heightArray = [];
    let resArray = [];
    for (var i = 0, len = elements.length; i < len; i++) {
      let rect = elements[i].getBoundingClientRect();
      resArray[i] = {
        height: rect.height,
        heightReq: 0,
        top: rect.top + pageYOffset,
        topParent:
          (elements[i].parentNode as HTMLElement).getBoundingClientRect().top +
          pageYOffset,
      };

      if (heightArray[resArray[i].top] === undefined) {
        heightArray[resArray[i].top] = 0;
      }
      heightArray[resArray[i].top] =
        heightArray[resArray[i].top] < resArray[i].height
          ? resArray[i].height
          : heightArray[resArray[i].top];
    }
    for (var i = 0, len = elements.length; i < len; i++) {
      resArray[i].heightReq = heightArray[resArray[i].top];
      (elements[i] as HTMLElement).style.height = resArray[i].heightReq + "px";
      (elements[i].getElementsByClassName(
        "search-city"
      )[0] as HTMLElement).style.top =
        resArray[i].top - resArray[i].topParent + resArray[i].heightReq + "px";
    }
  }
}
