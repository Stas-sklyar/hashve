import {ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../../environments/environment';
import {AppService} from '../../../app.service';
import {OfferResult} from '../../../business/model/offerResult/offer.result.model';
import {isPlatformServer} from '@angular/common';

@Component({
  selector: 'app-watched-list',
  templateUrl: './watched.list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./watched.list.component.scss']
})
export class WatchedListComponent implements OnInit {
  curLang: string = 'heb';
  WATCHED_LIST: Array<OfferResult>;
  pic: string = environment.apihost + '/assets/items/';
  sliderConfig = {
    slidesPerView: 5,
    spaceBetween: 18,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      1530: {
        slidesPerView: 4.5,
        spaceBetween: 18,
      },
      1279: {
        slidesPerView: 3.5,
        spaceBetween: 18,
      },
      575: {
        slidesPerView: 2.5,
        spaceBetween: 10,
      },
      375: {
        slidesPerView: 1.5,
        spaceBetween: 10,
      },
    }
  };
  constructor(private translateSrv: TranslateService, private appService: AppService, @Inject(PLATFORM_ID) private platformId) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
    if(!isPlatformServer(this.platformId)){
      this.WATCHED_LIST = this.appService.getWatchedList();
    }
    console.log(this.WATCHED_LIST);
  }

  ngOnInit() {
  }

}
