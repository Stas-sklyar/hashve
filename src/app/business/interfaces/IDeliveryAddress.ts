import {DestinationType} from '../Enum/DestinationType';
import {ICity} from './ICity';

export interface IDeliveryAddress {
    destinationType: DestinationType;
    city: ICity;
    street: string;
    house: string;
    floor: number;
    appartament: number;
    instructions: string;

    fullName?: string;
    phone?: string;
    companyName?: string;
    apartment?: number;
}

export const EmptyDeliveryAddress  = {
    destinationType: 'private',
    city: undefined,
    street: '',
    house: undefined,
    floor: undefined,
    appartament: undefined,
    instructions: undefined,
    fullName: undefined,
    phone: undefined,
    companyName: undefined,
    apartment: undefined
}