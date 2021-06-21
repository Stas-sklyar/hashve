import {Component} from '@angular/core';
import {environment} from '../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {AppService} from '../app.service';
import {Item} from '../business/model/item.model';
import {Store} from '../business/model/store.model';
import {Router} from '@angular/router';
import {City} from '../business/model/city.model';
import {MetaService} from '@ngx-meta/core';


@Component({
  selector: 'app-busket-component',
  templateUrl: './busket.component.html',
  styleUrls: ['./busket.component.scss'],
})


export class BusketComponent {
  data: any;
  items: Item[];
  currentCity: City;
  Card: any[] = [];
  stores: Store[];
  curLang = 'heb';
  host = environment.apihost;
  showSlider = false;
  packCount: number;
  packages: any;
  city: any[] = [];
  packByCity: any[] = [];

  constructor(private route: ActivatedRoute, private appService: AppService, private _meta: MetaService) {
    this.appService.onRenderBackgroundImage.next(false);
    this.data = this.route.snapshot.data.payload;
    this.packages = this.data[1].data.offer;
    this._meta.setTitle('סל קניות');
    this.items = this.data[0].data.map(item => new Item(item));
    this.packages = this.packages.map(pack => {
      pack.store = new Store(pack.store);
      pack.package.baseItem = new Item(pack.package.baseItem);
      return pack;
    });

    this.packCount = this.data[1].data.offer.length;

    this.appService.onSelcetedCityChanged.subscribe(city => {
      this.currentCity = city;
    });

    this.packages.forEach(i => {
      if (!this.packByCity[i.city._id]) {
        this.packByCity[i.city._id] = [];
      }
      this.packByCity[i.city._id].push(i);
    });
    // tslint:disable-next-line:forin
    const tmp: any[] = [];
    for (const field in this.packByCity) {
      tmp.push(this.packByCity[field]);
    }
    this.packByCity = tmp;
  }
}

