import { Package } from './../business/model/package.model';
import { ProductOffer } from './../business/model/product.offer.model';
import { Component, OnInit } from '@angular/core';
import {Order} from '../business/model/Order/Order';
import {ActivatedRoute} from '@angular/router';
import {AppService} from '../../app/app.service';
import {Store} from '../business/model/store.model';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order;
  showSlider: false;
  constructor(private route: ActivatedRoute, private appService: AppService,) {
    /*if(this.route.snapshot.data.payload === 'true' || this.route.snapshot.data.payload === 'false'){
      this.financeResult = this.route.snapshot.data.payload;
    }else{*/
      this.orders = this.route.snapshot.data.payload.data;
      this.orders = new Order(this.orders);
    //}
    console.log(this.orders)
  }

  ngOnInit() {
    this.appService.onRenderBackgroundImage.next(false);
  }

}
