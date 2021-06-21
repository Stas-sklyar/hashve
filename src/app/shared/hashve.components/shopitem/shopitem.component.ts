import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { Store } from '../../../business/model/store.model';
import { Item } from '../../../business/model/item.model';

@Component({
  selector: '[app-shopitem]',
  templateUrl: './shopitem.component.html',
  styleUrls: ['./shopitem.component.scss']
})
export class ShopItemComponent implements OnInit {
  curLang = 'heb';
  _shop: Store;
  pic = '';
  @Input() withMap: boolean;
  @Input() shortOverview = false;
  @Input() additionClass: string;
  @Input() stores: Store[] = [];
  @Input() item: Item;

  @Input() set shop(value) {
    this._shop = value instanceof Store ? value : new Store(value);
    this._shop.link = this._shop.ind + '-' + this._shop.name.heb.replace(/\s/g, '-');
    this.pic = this._shop.pic && typeof this._shop.pic !== 'string' && this._shop.pic.length > 0 ?
      this._shop.pic[0] as string : this._shop.pic as string;
  }

  constructor(private translateSrv: TranslateService) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
  }

  ngOnInit() {
  }
}
