import { Component, OnInit, Input } from '@angular/core';
import {Store} from '../../../business/model/store.model';
import {Item} from '../../../business/model/item.model';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss']
})
export class CatalogListComponent implements OnInit {
  @Input() items: Array<Item>;
  @Input() store: Store = null;
  @Input() categoryName: string = null;
  @Input() linkToItemPage: boolean = false;
  constructor() { }

  ngOnInit() {

  }

}
