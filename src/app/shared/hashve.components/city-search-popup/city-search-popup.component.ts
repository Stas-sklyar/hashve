import {AfterViewInit, Component, ElementRef, Input, Output, OnInit, ViewChild, EventEmitter, OnDestroy} from '@angular/core';
import {Item} from '../../../business/model/item.model';
import {Store} from '../../../business/model/store.model';
import {environment} from '../../../../environments/environment';
import {Category} from '../../../business/model/category.model';
import {AppService} from '../../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {} from 'googlemaps';
import {City} from '../../../business/model/city.model';

interface IFilter {
  categoryFilter: Category;
  filter: string;
}

@Component({
  selector: 'app-city-search-popup',
  templateUrl: './city-search-popup.component.html',
  styleUrls: ['./city-search-popup.component.scss'],
})
export class CitySearchPopupComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  set items(value){
    this.filteredItems = value;
    this.initMarkers(0);
  }
  @Input() link: string[] | string;
  @Input() stores: Store[] = [];
  @Input() categoryName: string;
  @Input()
  set categories(value) {
    /*let tmp = value.map(item => item.subcategory);
    this._categories = [].concat.apply([], tmp);*/
    this._categories = value;
  };
  @Output() onCloseTheModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() byItem: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('mapElement', {static: false}) mapElement: ElementRef;
  map: google.maps.Map;
  _categories: Category[] = [];
  markers: google.maps.Marker[] = [];
  infoWindows: google.maps.InfoWindow[] = [];
  events: any[] = [];
  host: string = environment.apihost;
  city: City;
  curLang: string;
  filteredItems: Array<Item> = [];
  private styleTag: HTMLStyleElement;
  configSlider = {
    observer: true,
    slidesPerView: 5,
    spaceBetween: 5,
    loop: true,
    centeredSlides: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      1279: {
        slidesPerView: 4,
      },
      991: {
        slidesPerView: 3,
      },
      420: {
        slidesPerView: 2,
      },
    }
  };
  swiperq: any;
  icon = {
    path: 'M26.85,42.47c3.37-4.67,7.02-10.28,9.5-15.71c0.55-1.2,0.96-2.45,1.24-3.75c0.28-1.29,0.42-2.63,0.42-4h0\n' +
      '\tc0-5.24-2.14-9.99-5.58-13.43C28.99,2.13,24.24,0,19,0v0C13.76,0,9.01,2.14,5.57,5.58C2.13,9.02,0,13.77,0,19.01\n' +
      '\tc0,1.37,0.14,2.71,0.42,4c0.28,1.3,0.69,2.55,1.24,3.75c1.87,4.09,4.41,8.3,6.99,12.13c4.23,6.27,8.57,11.47,10.36,13.56\n' +
      '\tC20.43,50.77,23.5,47.1,26.85,42.47L26.85,42.47z',
    fillColor: 'red',
    fillOpacity: 1,
    anchor: new google.maps.Point(0, 0),
    strokeWeight: 1,
    scale: 0.5
  };
  constructor(private translateSrv: TranslateService, private appService: AppService) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
    this.city = this.appService.selectedCity;
  }

  ngOnInit() {
    this.styleTag = this.buildStyleElement();
    document.body.appendChild(this.styleTag);
  }

  ngAfterViewInit() {
    let lat = 0, lng = 0, count = 0;
    this.stores.forEach((store) => {
      lat += store.storeLocation.lat;
      lng += store.storeLocation.lng;
      count++;
    });
    const mapProperties = {
      center: new google.maps.LatLng(lat / count, lng / count),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    this.initMarkers(0);
  }

  selectedItem($event) {
    this.swiperq = $event;
    $event.on('slideChange', () => {
      //console.log(this.filteredItems[this.swiperq.realIndex]);
      //console.log(this.swiperq.realIndex);
      this.initMarkers(this.swiperq.realIndex);
    });
  }

  buyHere(item, store) {
    this.byItem.emit({item, store});
  }

  closeModal() {
    this.onCloseTheModal.emit(true);
  }

  initMarkers(swiperIndex: number) {
    this.markers = [];
    for (let i = 0; i < this.infoWindows.length; i++) {
      this.infoWindows[i].close();
    }
    this.infoWindows = [];
    this.events = [];
    this.stores.forEach((store, index) => {
      this.infoWindows[index] = new google.maps.InfoWindow({
        content: this.getMarkerHtml(store.rating, store.getPriceById(this.filteredItems[swiperIndex]._id), store.name[this.curLang], store.pic, store.address[this.curLang], this.filteredItems[swiperIndex], store)
      });

      this.markers[index] = new google.maps.Marker({
        position: {lat: store.storeLocation.lat, lng: store.storeLocation.lng},
        map: this.map,
        icon: this.icon
      });

      google.maps.event.addListener(this.infoWindows[index], 'domready', () => {
        let selector = 'anchor_' + store._id;
        this.events[index] = (document.getElementById(selector));
        this.events[index].addEventListener('click', (event) => this.buyHere(this.filteredItems[swiperIndex]._id, store._id));
      });

      this.markers[index].addListener('mouseover', () => {
        this.infoWindows[index].open(this.map, this.markers[index]);
      });

      this.markers[index].addListener('click', () => {
        this.infoWindows[index].open(this.map, this.markers[index]);
      });
    });

  }

  getMarkerHtml(rate, price, name, pic, address, item, store) {
    return `
          <div class="shop-map__label">
            <div class="shop-map__name"><a id="anchor_${store._id}" (click)="buyHere('${item._id}', '${store._id}')">${name}</a></div>
            <div class="shop-map__mark"><span class="shop-map__mark-num">${rate}</span> דירוד</div>
            <div class="shop-map__mark"><span class="shop-map__mark-num">${price}₪</span></div>
          </div>
        `;
  }

  ngOnDestroy(): void {
    document.body.removeChild( this.styleTag );
  }

  private buildStyleElement() : HTMLStyleElement {
    var style = document.createElement( "style" );
    style.type = "text/css";
    style.setAttribute( "data-debug", "Injected by popup city search map." );
    style.textContent = `
            body {
                overflow: hidden !important ;
            }
        `;
    return( style );
  }
}


