import { DestinationType } from "../Enum/DestinationType";
import { ICity } from "./ICity";
import { ICustomerAddress } from "./ICustomerAddress";
import { ICustomerDataManagement } from "./ICustomerDataManagement";
import { IDeliveryAddress } from "./IDeliveryAddress";


export interface ICustomer {
  token?: string;
  _id?:string
  fullName: string;
  phone: string;
  email: string;
  birthday: Date;
  password: string;
  active: boolean;
  city: ICity | string;
  address:  Array<ICustomerAddress> ;
  managment: ICustomerDataManagement | any;
}
