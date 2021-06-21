import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppService} from '../../../app.service';
import {environment} from '../../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {Item} from '../../../business/model/item.model';
import {City} from '../../../business/model/city.model';

@Component({
  selector: 'app-review-slider',
  templateUrl: './review-slider.component.html',
  styleUrls: ['./review-slider.component.css']
})
export class ReviewSliderComponent implements OnInit {
  configPopularReview: any = {
    slidesPerView: 5,
    spaceBetween: 25,
    loop: true,
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
        slidesPerView: 4,
        spaceBetween: 25,
      },
      1279: {
        slidesPerView: 3,
        spaceBetween: 25,
      },
      991: {
        slidesPerView: 2,
        spaceBetween: 25,
      },
      575: {
        slidesPerView: 1.5,
        spaceBetween: 20,
      },
      479: {
        slidesPerView: 1.2,
        spaceBetween: 20,
      },
    }
  };
  reviews: any = [];
  host: string = environment.apihost;
  curLang: string = 'heb';
  constructor(private http: HttpClient, private appService: AppService, private translateSrv: TranslateService,) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
    let params;
    if(this.appService.getSelectedCity()){
      params = new HttpParams().set('city', this.appService.getSelectedCity().name.heb.replace(/\s/g, "_"));
    }else{
      params = null;
    }

    this.http.get(this.host + "/api/v1/content/get-review", {params}).subscribe((data: any) => {
      this.reviews = data.reviews.map(item => {
        item.item = new Item(item.item);
        item.city = new City(item.city);
        return item;
      });
      // console.log(this.reviews)
    });
  }

  ngOnInit() {
  }

  redirectProductPageByReview(review){
    this.appService.createCityOffer(review.item, review.city);
  }

  redirectToCitySearch(){
    if(!this.appService.selectedCity){
      this.appService.onCitySearchOpen.next(true);
    }else{
      const link: string = `/פרחים_${this.appService.selectedCity.name.heb.replace(/\s/g, "_")}`;
      this.appService.navigateByLink(link);
    }
  }

}
