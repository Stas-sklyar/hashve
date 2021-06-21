import {Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {} from 'googlemaps';
import {Store} from '../../../business/model/store.model';
import {City} from '../../../business/model/city.model';
import {CityService} from '../../service/city.service';

@Component({
  selector: 'app-shop-about-description',
  templateUrl: './shop-about-description.component.html',
  styleUrls: ['./shop-about-description.component.scss']
})
export class ShopAboutDescriptionComponent implements OnInit, AfterViewInit {
  @ViewChild('mapElement', {static: false}) mapElement: ElementRef;
  map: google.maps.Map;
  markers: google.maps.Marker[] = [];

  curLang = 'heb';
  // tslint:disable-next-line: variable-name
  _open = true;
  // tslint:disable-next-line: variable-name
  _mapEnable = true;
  // tslint:disable-next-line: variable-name
  _store: any;

  @Input() set store(value: Store) {
    this._store = value;
  }

  @Input() set open(v: boolean) {
    this._open = v;
  }

  @Input() set mapEnable(v: boolean) {
    this._mapEnable = v;
  }


  constructor(private translateSrv: TranslateService) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this._mapEnable) {
      const mapProperties = {
        center: new google.maps.LatLng(this._store.storeLocation.lat, this._store.storeLocation.lng),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
      this.markers.push(new google.maps.Marker({
        position: {lat: this._store.storeLocation.lat, lng: this._store.storeLocation.lng},
        map: this.map
      }));
    }
  }
}
