import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { AppRouterState } from '../../../business/model/AppRouterState';
import { ApplicationState } from '../../../business/Enum/ApplicationState';
import { Router } from '@angular/router';
import {Store} from '../../../business/model/store.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  curLang: string = 'heb';
  curCategory: any;
  pic: string = '';
  isItemRedirect: boolean = false;
  @Input() additionClass: string;
  @Input() store: Store;
  @Input()
  set category(value) {
    this.curCategory = value;
    this.pic = environment.apihost + '/assets/category/' + this.curCategory.pic;
  }
  constructor(private translateSrv: TranslateService, private appService: AppService, private route: Router) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
    this.isItemRedirect = this.appService.selectedCity?false:true;
  }

  ngOnInit() {
  }

  onCategoryClicked() {
    if(this.store){
      let link: string = `/${this.store.ind}-${this.store.name[this.curLang].replace(/\s/g, '_')}/${this.curCategory.name[this.curLang].replace(/\s/g, '_')}`;
      this.route.navigateByUrl(link);
    }else if (!this.appService.selectedCity) {
      this.appService.routerState = new AppRouterState({ state: ApplicationState.Category, element: this.curCategory });
      this.appService.onCitySearchOpen.next(true);
    } else {
      const link: string = `/פרחים_${this.appService.selectedCity.name.heb.replace(/\s/g, "_")}/${this.curCategory.name.heb.replace(/\s/g, "_")}`;
      if(this.appService.routerState)
        this.appService.routerState.resetState();
      this.route.navigateByUrl(link);
    }
  }

}
