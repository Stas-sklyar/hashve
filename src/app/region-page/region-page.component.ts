import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppService} from '../app.service';
import {Article} from '../business/model/article.model';
import {MetaService} from '@ngx-meta/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './region-page.component.html',
  styleUrls: ['./region-page.component.scss']
})
export class RegionPageComponent implements OnInit {
  data: any;
  showSlider = false;
  article: Article;
  curLang: string;
  constructor(private route: ActivatedRoute, private translateSrv: TranslateService, private readonly _meta: MetaService, private appService: AppService) {
    this.data = this.route.snapshot.data.payload;
    this.curLang = this.translateSrv.currentLang;
    this.translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
    this.article = this.data.data.article.length > 0 ? this.data.data.article[0] : null;
    this.appService.onRenderBackgroundImage.next(false);
    if(this.article){
      this._meta.setTitle(this.article.seo.title[this.curLang]);
      this._meta.setTag('description', this.article.seo.description[this.curLang]);
    }
  }

  ngOnInit() {

  }
}
