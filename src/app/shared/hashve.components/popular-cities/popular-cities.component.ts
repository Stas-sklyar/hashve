import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Item} from '../../../business/model/item.model';
import {City} from '../../../business/model/city.model';
import {CityService} from '../../service/city.service';
import {environment} from '../../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-popular-cities',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './popular-cities.component.html',
  styleUrls: ['./popular-cities.component.css']
})
export class PopularCitiesComponent implements OnInit, AfterViewInit {
  popularCity: Array<City> = [];
  curLang: string = 'heb';
  host: string = environment.apihost;
  public configCities: any = {
    slidesPerView: 6,
    spaceBetween: 40,
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
        slidesPerView: 5.5,
        spaceBetween: 40,
      },
      1279: {
        slidesPerView: 4.5,
        spaceBetween: 40,
      },
      991: {
        slidesPerView: 3.5,
        spaceBetween: 40,
      },
      767: {
        slidesPerView: 3.5,
        spaceBetween: 20,
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
  constructor(private cityService: CityService, private translateSrv: TranslateService, private cdr: ChangeDetectorRef) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
    this.cityService.getCitiesWithoutLogin().subscribe(data => {
      let cities = data.data.map(city => new City(city))
      this.popularCity = cities.filter(item => item.inPopular);
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

}
