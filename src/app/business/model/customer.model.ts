
import { ICity } from "../interfaces/ICity";
import { ICustomer } from "../interfaces/ICustomer";
import { ICustomerAddress } from "../interfaces/ICustomerAddress";

import { EmptyICustomerDataManagement, ICustomerDataManagement } from "../interfaces/ICustomerDataManagement";
import { EmptyDeliveryAddress, IDeliveryAddress } from "../interfaces/IDeliveryAddress";


export class Customer  implements ICustomer{
    _id: string;
    fullName: string;
    phone: string;
    email: string;
    birthday: Date;
    password: string;
    active: boolean;
    token?:string ;
    city: ICity | string;
    address: Array<ICustomerAddress> ;
    managment: ICustomerDataManagement | any;

    constructor(item:any){
        if(item._id){
            this._id =  item._id ;
        }
        
        this.fullName =  item.fullName?item.fullName: '';
        this.phone =  item.phone?item.phone : '',
        this.email =  item.email?item.email:'';
        this.token =  item.token?item.token:'';
        this.birthday = item.birthday?item.birthday: undefined ;
        this.password = item.password?item.password: undefined ;
        this.active = item.active?item.active: true ;
        this.address = item.address?item.address: [] ;
        this.city = item.city?item.city: undefined ;
        this.managment = item.managment?item.managment: EmptyICustomerDataManagement ;

    }
  

}