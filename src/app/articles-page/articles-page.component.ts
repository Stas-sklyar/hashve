import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppService} from '../app.service';
import {MetaService} from '@ngx-meta/core';

@Component({
  selector: 'app-articles-page',
  templateUrl: './articles-page.component.html',
  styleUrls: ['./articles-page.component.scss']
})
export class ArticlesPageComponent implements OnInit {
  data: any;
  articles: any;
  showSlider = false;
  constructor(private route: ActivatedRoute, private appService: AppService, private readonly _meta: MetaService) {
    this._meta.setTitle("מאמרים וכתבות - אתר השווה");
    this._meta.setTag("description", "מאגר מאמרים וכתבות בנושאים מגוונים המספקים תשובות והמלצות לקהל לקוחות של אתר השווה המציע מגוון כתבות מעולם הזמנות משלוחים אונליין ומאגר כתבות מעניינות בנושא פרחים ומתנות.");
  }

  ngOnInit() {
    this.data = this.route.snapshot.data.payload;
    this.articles = this.data['data'];
    this.appService.onRenderBackgroundImage.next(false);
  } 

}
