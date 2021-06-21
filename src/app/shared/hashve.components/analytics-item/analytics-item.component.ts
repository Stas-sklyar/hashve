import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CityService} from '../../service/city.service';
import {CategoryService} from '../../service/category.service';
import {Category} from '../../../business/model/category.model';
import {City} from '../../../business/model/city.model';
import {TranslateService} from '@ngx-translate/core';
import {map, mergeAll} from 'rxjs/operators';
import {merge, Subscription} from 'rxjs';

@Component({
  selector: 'app-analytics-item',
  templateUrl: './analytics-item.component.html',
  styleUrls: ['./analytics-item.component.css']
})
export class AnalyticsItemComponent implements OnInit, OnDestroy {
  public footerCategories: Category[] = [];
  public reviewCity: City[] = [];
  public curLang: string;
  public tabActive: boolean = true;
  public sub: Subscription[] = [];

  constructor(private cityService: CityService, private categoryService: CategoryService, private translateSrv: TranslateService, private cdr: ChangeDetectorRef) {
    this.curLang = translateSrv.currentLang;
    this.sub.push(translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    }));
    this.sub.push(this.categoryService.getCategoriesWithoutLogin().subscribe(data => {
      this.footerCategories = data.filter(item => item.toFooterMenu);
    }));
    this.sub.push(this.cityService.getCitiesWithoutLogin().subscribe(data => {
      this.reviewCity = data.data.filter(item => item.inReview).map(city => new City(city));
    }));
  }

  ngOnInit() {

  }

  changeTab(){
    this.tabActive = !this.tabActive;
  }

  ngOnDestroy(): void {
    this.sub.forEach(item => item.unsubscribe());
  }

}
