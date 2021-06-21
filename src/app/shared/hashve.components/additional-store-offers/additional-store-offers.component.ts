import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Store} from '../../../business/model/store.model';
import {Item} from '../../../business/model/item.model';
import {environment} from '../../../../environments/environment';
import {ItemSize} from '../../../business/Enum/ItemSize';
import {Package} from '../../../business/model/package.model';
import {TranslateService} from '@ngx-translate/core';
import {City} from '../../../business/model/city.model';
import {AppService} from '../../../app.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-additional-store-offers',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './additional-store-offers.component.html',
  styleUrls: ['./additional-store-offers.component.scss']
})
export class AdditionalStoreOffersComponent implements OnInit, AfterViewInit {
  path: string = '';
  curLang: string = '';
  _ItemSize = ItemSize;
  sizesName = {
    normal: {
      en: 'Normal',
      heb: 'רגיל'
    },
    large: {
      en: 'Large',
      heb: 'גדול'
    },
    extraLarge: {
      en: 'Extra',
      heb: 'ענק'
    },
  };
  packArray: Package[] = [];
  _store: Store;
  _additionalItems: Item[] = [];
  _selectedItem: Item;
  currentCity: City;
  @Input()
  set store(value: Store) {
    this._store = Object.assign(value);
    this.updatePackages();
  }

  @Input()
  set additionalItems(value: Item[]) {
    if(value){
      this._additionalItems = value.filter(value => {
        return this._store.items.find(itm => itm.item === value._id) === undefined ? false : true;
      });
      this.updatePackages();
    }
  }

  @Input()
  set selectedItem(value: Item) {
    this._selectedItem = value;
    this.updatePackages();
  }

  constructor(private translateSrv: TranslateService, private appService: AppService, private router: Router) {
    this.path = environment.apihost + '/assets/items/';
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
    this.currentCity = this.appService.getSelectedCity();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  generateRandomInt(max, tmp: number[]) {
    let num: number = -1;
    while (tmp.indexOf(num) > -1 || num < 0) {
      num = Math.floor(Math.random() * Math.floor(max));
    }
    return num;
  }

  updatePackages() {
    if (this._store && this._additionalItems && this._selectedItem) {
      let pack1: Package = new Package({});
      pack1.baseItem = this._selectedItem;
      pack1.size = ItemSize.normal;
      let result: number[] = [];
      result.push(this.generateRandomInt(this._additionalItems.length, result));
      result.push(this.generateRandomInt(this._additionalItems.length, result));
      result.push(this.generateRandomInt(this._additionalItems.length, result));
      pack1.addItems = new Array<Item>();
      pack1.addItems.push(this._additionalItems[result[0]]);
      pack1.addItems.push(this._additionalItems[result[1]]);
      pack1.addItems.push(this._additionalItems[result[2]]);
      let pack2: Package = new Package({});
      pack2.baseItem = this._selectedItem;
      pack2.size = ItemSize.normal;
      result = [];
      result.push(this.generateRandomInt(this._additionalItems.length, result));
      result.push(this.generateRandomInt(this._additionalItems.length, result));
      pack2.addItems = new Array<Item>();
      pack2.addItems.push(this._additionalItems[result[0]]);
      pack2.addItems.push(this._additionalItems[result[1]]);
      let pack3: Package = new Package({});
      pack3.baseItem = this._selectedItem;
      pack3.size = ItemSize.large;
      let pack4: Package = new Package({});
      pack4.baseItem = this._selectedItem;
      pack4.size = ItemSize.extralarge;
      this.packArray.push(pack3);
      this.packArray.push(pack4);
      this.packArray.push(pack2);
      this.packArray.push(pack1);
    }
  }

  saveOfferAndRedirectToProduct(pack, _store: string = null) {
    let newOffer: any = {};
    newOffer.package = pack;
    newOffer.store = this._store._id;
    newOffer.city = this.currentCity._id;
    newOffer.package.additionalItems = this._additionalItems.map(a => a._id);

    this.appService.saveOffer(newOffer).subscribe((data) => {
      this.router.navigateByUrl(`product/` + data.data._id);
    });
  }

}
