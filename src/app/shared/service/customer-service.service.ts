import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ICustomer } from '../../business/interfaces/ICustomer';

import { ICustomerAddress } from '../../business/interfaces/ICustomerAddress';
import { CustomerOrder } from '../../business/model/Order/CustomerOrder';
import { BaseService } from './base/service.base';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService<ICustomer> {
 
 
  constructor(private http: HttpClient) {
    super(http, environment.apihost, environment.customerV1Endpoint);
  }

  public updateUserInfos(item: any, id:string): Observable<ICustomer> {
    return this.httpClient
      .put<ICustomer>(`${this.url}${this.endpoint}/${id}`, item);
  }
  changePassword(data: any, email: string):Observable<any>  {
    const payload = {password:data.password, newPassword:data.newPassword , email }
    return this.httpClient
    .post(`${this.url}${environment.customerV2Endpoint}/change-password`, payload);

  }
  public updateAddresse(item: any, id:string): Observable<ICustomerAddress> {
    return this.httpClient
      .put<ICustomerAddress>(`${this.url}${environment.customerV2Endpoint}/update-address/${id}`, item);
  }
  public read(id: string): Observable<ICustomer> {
    return this.httpClient
      .get(`${this.url}${environment.customerV2Endpoint}/${id}`).pipe(map((data: any) => data as ICustomer));
  }
  public getOrders(payload): Observable<CustomerOrder[]> {
    return this.httpClient
      .get(`${this.url}${environment.customerV2Endpoint}/orders?phone=${payload.phone}&email=${payload.email}`).pipe(map((data: any) => data as CustomerOrder[]));
  }

  public list(): Observable<ICustomer[]> {
    return this.httpClient.get(`${this.url}${this.endpoint}`).pipe(map((data: any) => {
      return data as ICustomer[];
    }));
  }

  deleteAddress(id: string) {
    return this.httpClient
    .delete<ICustomerAddress>(`${this.url}${environment.customerV2Endpoint}/delete-address/${id}`);
  }
  setPrincipalAddress(id: string, customerId) {
    return this.httpClient
    .put<ICustomerAddress>(`${this.url}${environment.customerV2Endpoint}/active-address/${id}`, {customerId});
  }

}
