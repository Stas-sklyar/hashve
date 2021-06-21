import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AppService} from '../../../app.service';
import {AppRouterState} from '../../../business/model/AppRouterState';
import {ApplicationState} from '../../../business/Enum/ApplicationState';
import {isPlatformServer} from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  itemsCount: number;

  constructor(private appService: AppService, @Inject(PLATFORM_ID) private platformId) {
    if(!isPlatformServer(this.platformId)){
      this.itemsCount = this.appService.getCardCount();
      this.appService.onCardChanged.subscribe(data => {
        this.itemsCount = data;
      });
    }else{
      this.itemsCount = 0;
    }
  }

  ngOnInit() {
  }

  navigateToCard(){
    if(this.appService.selectedCity){
      const link = `/busket/${this.appService.selectedCity.name.heb.replace(/\s/g, '_')}`;
      this.appService.navigateByLink(link);
    }else{
      this.appService.routerState = new AppRouterState({state: ApplicationState.ImprovePrice});
      this.appService.onCitySearchOpen.next(true);
    }
  }

}
