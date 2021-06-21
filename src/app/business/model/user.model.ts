import {IUser} from '../interfaces/IUser';
import {UserType} from '../Enum/UserType';
import {IDeliveryAddress} from '../interfaces/IDeliveryAddress';

export class User implements IUser {
    fullName: string;
    mobile: string;
    mail: string;
    password: string;
    pic: string;
    country: string;
    birthday: Date;
    sms: boolean;
    userType: UserType;
    active: boolean;
    token: String;
    deliveryAddress: Array<IDeliveryAddress>;
    changePassword: {
        token: String,
        creationDate: Date
    };
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}
