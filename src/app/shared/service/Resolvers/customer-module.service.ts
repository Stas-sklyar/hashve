import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../../../app.service';
import { ICustomer } from '../../../business/interfaces/ICustomer';
import { Customer } from '../../../business/model/customer.model';
import { CustomerOrder } from '../../../business/model/Order/CustomerOrder';
import { CityService } from '../city.service';
import { CustomerService } from '../customer-service.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerModuleservice implements Resolve<any>{

  customer: ICustomer ;
  constructor(private customerService: CustomerService, private appService: AppService ,  private cityService: CityService) {
    this.customer =  new Customer({});
   }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    let prom1 = this.cityService.list().toPromise();
    if (route.routeConfig.path.indexOf("user/profil") != 1) {
      return Promise.all([prom1, this.checkUserLogged()]).then(data => {
        return { cities: data[0], ifUser: data[1] };
      });
    } else {
      return Promise.all([prom1, this.checkUserLogged()]).then(data => {
        return { cities: data[0], ifUser: data[1] };
      });
    }


  }




  checkUserLogged(): Promise<Boolean> {
    return new Promise(async (resolve, reject) => {
      let user = (JSON.parse(localStorage.getItem('customer')) as any);
      if (!user) {
        resolve(false);
      }
      const customer = new Customer(user);

      this.customerService.read(customer._id).subscribe((data) => {
        this.customer = new Customer(data)
        localStorage.setItem('customer', JSON.stringify(this.customer));
        resolve(true);
      },error => {
        resolve(false);
      })

    })
  }

  getUserOrders(payload: any): Promise<CustomerOrder[]> {
    return new Promise((resolve, reject) => {
      this.customerService.getOrders(payload).subscribe(data => {
        resolve(data);
      })
    })

  }


}
