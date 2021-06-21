import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ItemSize } from '../business/Enum/ItemSize';
import { PaymentType } from '../business/Enum/PaymentType';
import { StatusType } from '../business/Enum/StatusType';
import { Item } from '../business/model/item.model';
import { CustomerOrder } from '../business/model/Order/CustomerOrder';
import { CustomerModuleservice } from '../shared/service/Resolvers/customer-module.service';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss']
})
export class UserOrdersComponent implements OnInit {
  orders: CustomerOrder[] = [];
  _StatusType = StatusType;
  _ItemSize = ItemSize;
  _payementType = PaymentType;
  _ItemAssetUrl = environment.apihost + '/assets/items/';

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _CustomerModuleService: CustomerModuleservice) {

    const payload = this._activatedRoute.snapshot.data.payload;
    const existUser = payload.ifUser;

    console.log(payload);

    if (!existUser) {
      this._router.navigateByUrl('/');
    }

    const customer = _CustomerModuleService.customer;
    const username  =  {phone: customer.phone , email :customer.email };
  
    _CustomerModuleService.getUserOrders(username).then(data => {
      this.orders = data.map(order => new CustomerOrder(order))
      this.orders = this.orders.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      
    })
  
  }
  ngOnInit() {
  }

  getPrice(item: Item, _order:CustomerOrder): number{
    let index = _order.itemPrices.findIndex((i) => { return i.item === item._id})
    return index > -1 ? _order.itemPrices[index].price:0
   }
}
