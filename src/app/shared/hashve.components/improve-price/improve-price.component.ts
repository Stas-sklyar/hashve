import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AppService} from '../../../app.service';
import {ApplicationState} from '../../../business/Enum/ApplicationState';
import {AppRouterState} from '../../../business/model/AppRouterState';
import {isPlatformServer} from '@angular/common';

@Component({
  selector: 'app-improve-price',
  templateUrl: './improve-price.component.html',
  styleUrls: ['./improve-price.component.css']
})
export class ImprovePriceComponent implements OnInit {

  itemsCount: number;

  constructor(private appService: AppService, @Inject(PLATFORM_ID) private platformId) {
    if(!isPlatformServer(this.platformId)){
      this.itemsCount = this.appService.getImprovePriceCount();
      this.appService.onImprovePriceChanged.subscribe(data => {
        this.itemsCount = data;
      });
    }else{
      this.itemsCount = 0;
    }
  }

  ngOnInit() {

  }

  navigateToImprovePrice(){
    if(this.appService.selectedCity){
      const link = `/שיפור-מחיר/${this.appService.selectedCity.name.heb.replace(/\s/g, '_')}`;
      this.appService.navigateByLink(link);
    }else{
      this.appService.routerState = new AppRouterState({state: ApplicationState.ImprovePrice});
      this.appService.onCitySearchOpen.next(true);
    }
  }
}
