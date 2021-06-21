import {Component, OnInit} from '@angular/core';
import {Order} from '../business/model/Order/Order';
import {ActivatedRoute} from '@angular/router';
import {Store} from '../business/model/store.model';
import {AppService} from '../app.service';
import {PaymentType} from '../business/Enum/PaymentType';

@Component({
  selector: 'app-order-history',
  templateUrl: './tranzila-result.component.html',
  styleUrls: ['./tranzila-result.component.scss']
})
export class TranzilaResultComponent implements OnInit {
  financeResult: boolean = false;

  constructor(private route: ActivatedRoute, private appService: AppService) {
    this.financeResult = this.route.snapshot.data.payload === true || this.route.snapshot.data.payload === 'true' ? true : false;
    this.route.queryParams.subscribe(params => {
      let url: string;
      if (params.tr_top) {
        url = decodeURI(params.tr_top);
        url = url.replace(/%26/g, '&');
        url = url.replace(/%3d/g, '=');
        url = url.replace(/%3D/g, '=');
        let tmp = url.split('?');
        console.log('parsed ? ', tmp);
        let sum = -1;
        if (this.financeResult === true) {
          let params = tmp[0].split('&');
          console.log('parsed params ', params);
          params.forEach(param => {
            if (param.startsWith('sum=')) {
              let sumTmp = param.replace('sum=', '');
              if (isNaN(+sumTmp)) {
                console.log('is not number');
              } else {
                sum = +sumTmp;
                // this.saveOrder(tmp[1]);
              }
            } else if (param.startsWith('orderId=')) {
              let orderID = param.replace('orderId=', '');
              this.appService.updateOrder(orderID, {creditCardDetails: tmp[0], paymentType: PaymentType.creditCard}).subscribe(data => {
                console.log(data);
              });
            }
          });
          console.log("sum", sum);
        } else {
          console.log('Status not true');
        }
      }
      console.log(params);
    });
  }

  ngOnInit() {
  }

}
