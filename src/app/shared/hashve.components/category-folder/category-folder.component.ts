import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Category} from '../../../business/model/category.model';
import {AppService} from '../../../app.service';
import {City} from '../../../business/model/city.model';

@Component({
  selector: 'app-category-folder',
  templateUrl: './category-folder.component.html',
  styleUrls: ['./category-folder.component.scss']
})
export class CategoryFolderComponent implements OnInit {
  curLang: string = 'heb';
  curCategories: any;
  link: City = null;
  _categories: any;
  @Input() additionClass: string;

  @Input()
  set categories(value: Array<Category>) {
    this._categories = value.map(i => new Category(i));
  }

  constructor(private translateSrv: TranslateService, private appService: AppService) {
    this.link = this.appService.selectedCity ? this.appService.selectedCity : null;
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
  }

  ngOnInit() {
  }
}
