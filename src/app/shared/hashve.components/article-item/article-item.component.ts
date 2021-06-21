import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: '[app-article-item]',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss']
})
export class ArticleItemComponent implements OnInit {
  _article:any;
  curLang: string = 'heb';

  @Input() set article(v:any){
    this._article=v;
    this._article.pic = environment.apihost + '/assets/articles/' + this._article.pic;
    this._article.link='/articles/'+this._article.header.heb.trim().replace(/\s/g, '_');
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
