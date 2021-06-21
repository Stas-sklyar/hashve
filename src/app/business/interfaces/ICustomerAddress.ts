import { DestinationType } from "../Enum/DestinationType";
import { ICustomer } from "./ICustomer";
import { ICity } from "./ICity";

export interface ICustomerAddress {
    _id?:string;
    destinationType: DestinationType;
    fullName: string;
    phone: string;
    companyName: string;
    city: ICity | string;
    street: string;
    house: string;
    floor: number;
    apartment: number;
    instructions: string;

    customer: ICustomer | string; 
    active:boolean ;
}
export const  EmptyCustomerAddress  = {
    _id:null,
    destinationType: DestinationType.private,
    fullName: '',
    phone: '',
    companyName: '',
    city: '',
    street: '',
    house: '',
    floor: null,
    apartment: null,
    instructions: '',

    customer: '', 
    active:false ,
}