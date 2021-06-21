import { Package } from './../../../business/model/package.model';
import { StatusType } from './../../../business/Enum/StatusType';
import { ProductOffer } from './../../../business/model/product.offer.model';
import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Store} from '../../../business/model/store.model';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../../environments/environment';
import {DeliveryType} from '../../../business/Enum/DeliveryType';
import {DiscountType} from '../../../business/Enum/DiscountType';
import {ItemSize} from '../../../business/Enum/ItemSize';
import {PaymentType} from '../../../business/Enum/PaymentType';
import {CityService} from '../../service/city.service';
import {City} from '../../../business/model/city.model';
import { Order } from '../../../business/model/Order/Order';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit, AfterViewInit {
  @Input() public order: Order;
  _statusType = StatusType;
  curLang: string;
  store: Store;
  pack: Package;
  city: City;
  _deliveryType = DeliveryType;
  _discountType = DiscountType;
  _paymentType = PaymentType;
  _itemSize = ItemSize;
  sizesName = {
    0: {
      en: 'Normal',
      heb: 'רגיל'
    },
    40: {
      en: 'Large',
      heb: 'גדול'
    },
    80: {
      en: 'Extra',
      heb: 'ענק'
    },
  };
  host: string = environment.apihost;
  constructor(private translateSrv: TranslateService, private cityService: CityService) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
  }


  ngOnInit() {

  }

  ngAfterViewInit(): void {
    
    this.store = (this.order.productOffer as ProductOffer).store;
    this.pack = (this.order.productOffer as ProductOffer).package;
    this.cityService.getCitiesWithoutLogin().subscribe(data => {
      this.city = data.data.find(item => item._id === this.order.deliveryAddress.city);
    });
    console.log(this.pack);
    console.log(+this.order.paymentType === this._paymentType.phone);
    console.log(+this.order.paymentType === this._paymentType.creditCard);
  }
}
