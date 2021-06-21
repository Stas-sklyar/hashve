import { Component, OnInit,Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-catalog-menu',
  templateUrl: './catalog-menu.component.html',
  styleUrls: ['./catalog-menu.component.scss']
})
export class CatalogMenuComponent implements OnInit {
  @Input() categories: any;
  @Input() storelink: string;
  @Input() set isShopPage(v:boolean){this._isShopPage = v;}
  
  _isShopPage: boolean = false;
  curLang: string = 'heb';

  constructor(private translateSrv: TranslateService) { 
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
  }

  configMenu: any = {
    slidesPerView: 'auto',
    freeMode: true,
    mousewheel: true,
  };

  ngOnInit() { 
    this.categories.forEach(category => {
      category.link =category.name['heb'].trim().replace(/\s/g, '_');
    });
  }
}
