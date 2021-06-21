import {Component, EventEmitter, HostListener, Inject, Input, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {showCallButton, showStoreBar} from '../../animations/hashve.animations';
import {TranslateService} from '@ngx-translate/core';
import {City} from '../../../business/model/city.model';
import {CategoryService} from '../../service/category.service';
import {AppService} from '../../../app.service';
import {ApplicationState} from '../../../business/Enum/ApplicationState';
import {AppRouterState} from '../../../business/model/AppRouterState';
import {Category} from '../../../business/model/category.model';

@Component({
  selector: 'app-city-search-header-mobile',
  templateUrl: './city-search-header-mobile.component.html',
  styleUrls: ['./city-search-header-mobile.component.css'],
  animations: [showStoreBar, showCallButton],
})
export class CitySearchHeaderMobileComponent implements OnInit {
  @Input() header: string;
  @Input() selectedSorting: string;
  @Input() city: City;
  @Input() categoryName: string;
  @Output() onFilterChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  public mobileMenu: string = 'collapsed';
  public closeMenu: boolean = true;
  public topMenu: Category[] = [];
  private styleTag: HTMLStyleElement;
  sortLable = {
    na: {en: 'na', heb: 'אין'},
    count: {en: 'Orders Number', heb: 'מס‘ הזמנות'},
    rate: {en: 'Rating', heb: 'דירוג (מגבוהה לנמוך )'},
    price: {en: 'Price', heb: 'מחיר (מנמוך לגבוהה)'},
  };
  curLang: string;
  menuHidden: string = 'notShowed';
  public categories: Category[] = [];
  config1: any = {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };
  config2: any = {
    slidesPerView: 'auto',
    freeMode: true,
    mousewheel: true,
  };

  @HostListener('window:scroll', ['$event']) onWindowScroll(e) {
    if (isPlatformBrowser(this.platformId)) {
      let positionSensor = document.getElementById('position-fixedmenu');
      if (positionSensor) {
        let fixedMenu = document.getElementById('shop-scroll');
        let sensorTopPos = positionSensor.getBoundingClientRect().top;
        this.menuHidden = 'notShowed';
        // let startIndentTop = window.pageYOffset;

        sensorTopPos = positionSensor.getBoundingClientRect().top;
        if (sensorTopPos <= 0) {
          if (this.menuHidden === 'notShowed') {
            this.menuHidden = 'showed';
          }
        } else if (sensorTopPos > 0) {
          if (this.menuHidden === 'showed') {
            this.menuHidden = 'notShowed';
          }
        }
      }
    }
  }

  constructor(@Inject(PLATFORM_ID) private platformId, protected categoryService: CategoryService, private translateSrv: TranslateService, protected appService: AppService) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
  }

  ngOnInit() {
    this.categoryService.getCategoriesWithoutLogin().subscribe(data => {
      let headers: Array<Category> = data.filter((item: Category) => item.subcategory && item.subcategory.length > 0);
      headers.forEach((item, index) => {
        item.subcategory.forEach((i, ind) => {
          const cat = data.find(el => el._id === i);
          if (cat) {
            headers[index].subcategory[ind] = cat;
          }
        });
      });
      this.categories = headers;
      this.topMenu = data.filter(item => item.toTopMenu === true);
    });
  }

  sortBy(data){
    this.onFilterChanged.emit(data);
  }

  uglify(text: string):string{
    return text.replace(/\s/g, '_');
  }

  onMenuClicked() {
    this.mobileMenu = this.mobileMenu === 'collapsed' ? 'expanded' : 'collapsed';
    setTimeout(() => {
      this.closeMenu = !this.closeMenu;
      if(this.closeMenu === false){
        this.styleTag = this.buildStyleElement();
        document.body.appendChild(this.styleTag);
      }else{
        document.body.removeChild( this.styleTag );
      }
    }, 300);
  }

  navigateToImprovePrice(){
    this.onMenuClicked();
    if(this.appService.selectedCity){
      const link = `/שיפור-מחיר/${this.appService.selectedCity.name.heb.replace(/\s/g, '_')}`;
      this.appService.navigateByLink(link);
    }else{
      this.appService.routerState = new AppRouterState({state: ApplicationState.ImprovePrice});
      this.appService.onCitySearchOpen.next(true);
    }
  }

  openWishList(){
    this.appService.routerState = new AppRouterState({state: ApplicationState.WishList, element: ''});
    this.onMenuClicked();
    this.appService.onCitySearchOpen.next(true);
  }

  private buildStyleElement() : HTMLStyleElement {
    var style = document.createElement( "style" );
    style.type = "text/css";
    style.setAttribute( "data-debug", "Injected by popup city search map." );
    style.textContent = `
            body {
                overflow: hidden !important ;
            }
        `;
    return( style );
  }

}
