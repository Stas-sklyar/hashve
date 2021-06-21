import { Component, OnInit,OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment';
import {MetaService} from '@ngx-meta/core';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit,OnDestroy  {
  data:any;
  article: any;
  lastarticles: any;
  curLang: string = 'heb';
  sub: any;
  showSlider = false;
  constructor(private translateSrv: TranslateService,
              private route: ActivatedRoute,
              private readonly _meta: MetaService) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
    this.data = this.route.snapshot.data.payload;
    this.article=this.data.article;
    this._meta.setTag('description', this.article.seo.description[this.curLang]);
    this._meta.setTitle(this.article.seo.title[this.curLang]);
    this.lastarticles=this.data.lastarticles.data;
  }

  ngOnInit() {
    this.sub=this.route.params.subscribe(params => {
      this.data = this.route.snapshot.data.payload;
      this.article=this.data.article;
      this.article.pic = environment.apihost + '/assets/articles/' + this.article.pic;
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
