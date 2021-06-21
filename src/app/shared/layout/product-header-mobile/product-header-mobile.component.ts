import {Component, Input, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {AppRouterState} from '../../../business/model/AppRouterState';
import {ApplicationState} from '../../../business/Enum/ApplicationState';
import {AppService} from '../../../app.service';
import {Router} from '@angular/router';
import {Category} from '../../../business/model/category.model';
import {CategoryService} from '../../service/category.service';

@Component({
  selector: 'app-product-header-mobile',
  templateUrl: './product-header-mobile.component.html',
  styleUrls: ['./product-header-mobile.component.css']
})
export class ProductHeaderMobileComponent implements OnInit {
  @Input() itemName: string = '';
  public mobileMenu: string = 'collapsed';
  public closeMenu: boolean = true;
  private styleTag: HTMLStyleElement;
  public showMobileMenu = false;
  public categories: Category[] = [];
  public topMenu: Category[] = [];

  constructor(protected appService: AppService, private _location: Location, private route: Router, protected categoryService: CategoryService) {
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



  onMenuClicked() {
    this.mobileMenu = this.mobileMenu === 'collapsed' ? 'expanded' : 'collapsed';
    setTimeout(() => {
      this.closeMenu = !this.closeMenu;
      if (this.closeMenu === false) {
        this.styleTag = this.buildStyleElement();
        document.body.appendChild(this.styleTag);
      } else {
        document.body.removeChild(this.styleTag);
      }
    }, 300);
  }

  private buildStyleElement(): HTMLStyleElement {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('data-debug', 'Injected by popup city search map.');
    style.textContent = `
            body {
                overflow: hidden !important ;
            }
        `;
    return (style);
  }

  navigateToImprovePrice() {
    this.onMenuClicked();
    if (this.appService.selectedCity) {
      const link = `/שיפור-מחיר/${this.appService.selectedCity.name.heb.replace(/\s/g, '_')}`;
      this.appService.navigateByLink(link);
    } else {
      this.appService.routerState = new AppRouterState({state: ApplicationState.ImprovePrice});
      this.appService.onCitySearchOpen.next(true);
    }
  }

  goBack() {
    this._location.back();
  }

  categoryMenuNavigate(item) {
    if (!this.appService.selectedCity) {
      this.appService.routerState = new AppRouterState({state: ApplicationState.Category, element: item});
      this.appService.onCitySearchOpen.next(true);
    } else {
      const link: string = `/פרחים_${this.appService.selectedCity.name.heb.replace(/\s/g, '_')}/${item.name.heb.replace(/\s/g, '_')}`;
      this.route.navigateByUrl(link);
    }
  }

  openWishList(){
    this.appService.routerState = new AppRouterState({state: ApplicationState.WishList, element: ''});
    this.onMenuClicked();
    this.appService.onCitySearchOpen.next(true);
  }
}
