import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Region } from '../../../business/model/region.model';


@Component({
  selector: 'app-regionlist',
  templateUrl: './regionlist.component.html',
  styleUrls: ['./regionlist.component.scss']
})
export class RegionListComponent implements OnInit {
  curLang: string = 'heb';
  regions: any;
  categories: any;
  cities: any;
  dayDealCount:number;

  @Input() additionClass: string;
  @Input() data:any;


  constructor(private translateSrv: TranslateService) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
  }

  ngOnInit() {
    this.regions = this.data['data']['regions'];
    this.categories = this.data['data']['categories'];
    this.cities = this.data['data']['cities'];

    this.dayDealCount = this.data['data']['dayDealCount'];

    let countItems = 0;

    this.categories.forEach(category => {
      countItems += category.itemsCount;
      category.link = category['name']['heb'].trim().replace(/\s/g, '_');
    });

    this.cities.forEach(element => {
      element.countItems = countItems;
      element.link = '/חנויות_פרחים_' + element['name']['heb'].trim().replace(/\s/g, '_');
      element.link2 = '/פרחים_' + element['name']['heb'].trim().replace(/\s/g, '_');
    });

    this.regions.forEach(element => {
      element.countItems = countItems;
      element.link = "/משלוחי_פרחים_ב" + element['name']['heb'].trim().replace(/\s/g, '_');
      element.link2 = "/משלוחי_פרחים_ב" + element['name']['heb'].trim().replace(/\s/g, '_');
      element.storesCount = this.cities.reduce((result, val) => {return  (val.region == element._id) ? (result + val.storesCount): result},0);
    });

  }
}
