import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AppService} from '../../../app.service';
import {isPlatformServer} from '@angular/common';

@Component({
  selector: 'app-search-button',
  templateUrl: './search.button.component.html',
  styleUrls: ['./search.button.component.css']
})
export class SearchButtonComponent implements OnInit {

  itemsCount: number;

  constructor(private appService: AppService, @Inject(PLATFORM_ID) private platformId) {

  }

  ngOnInit() {
  }

  redirectToCitySearch() {
    if (!this.appService.selectedCity) {
      this.appService.onCitySearchOpen.next(true);
    } else {
      const link: string = `/פרחים_${this.appService.selectedCity.name.heb.replace(/\s/g, '_')}`;
      this.appService.navigateByLink(link);
    }
  }

}
