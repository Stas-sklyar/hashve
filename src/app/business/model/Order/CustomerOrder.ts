
import { DelivertyAddress } from './DelivertyAddress';
import { DeliveryDetails } from './DeliveryDetails';
import { PhonePayment } from './PhonePayment';
import { CostumerDetails } from './CostumerDetails';
import { ProductOfferService } from '../../../shared/service/product.offer.service';
import { DiscountType } from '../../Enum/DiscountType';
import { PaymentType } from '../../Enum/PaymentType';
import { IStatus } from '../../interfaces/IStatus';
import { ITranslate } from '../../interfaces/ITranslate';
import { ItemStoreOffer } from '../item.store.offer';
import { StatusType } from '../../Enum/StatusType';
import { ProductOffer } from './ProductOffer';

export class CustomerOrder {
    _id?: string;
    productOffer: ProductOffer;
    typeOfDiscount: DiscountType;
    deliveryAddress: DelivertyAddress;

    deliveryPrice: number;
    price: number;

    customerDitails?: CostumerDetails;
    deliveryDetails?: DeliveryDetails;
    paymentType: PaymentType;

    // creditCardDetails: CreditCardPayment;
    phonePaymentDetails: PhonePayment;
    status: Array<IStatus>;
    creditCardDetails: string;
    orderNumber: string;
    createdAt: Date;
    customerFullName: string;
    dateOfDelivery: Date;
    storeName: ITranslate;
    storeId: string;
    productAndSize: string;
    deliveryCity: ITranslate;
    itemPrices: ItemStoreOffer[];
    cancelationRequest: {
        date: { type: Date },
        explanation: String,
    };
    /**
     * Constructor
     *
     * @param item
     */
    constructor(item: any) {
        {
            if (item._id) {
                this._id = item._id;
            }
            this.deliveryAddress = item.deliveryAddress ? item.deliveryAddress : undefined;
            this.phonePaymentDetails = item.phonePaymentDetails ? item.phonePaymentDetails : undefined;
            this.paymentType = item.paymentType;
            this.deliveryDetails = item.deliveryDetails ? item.deliveryDetails : undefined;
            this.customerDitails = item.customerDitails ? item.customerDitails : undefined;
            this.deliveryPrice = item.deliveryPrice ? item.deliveryPrice : 0;
            this.typeOfDiscount = item.typeOfDiscount ? item.typeOfDiscount : undefined;
            this.productOffer = item.productOffer ? item.productOffer : undefined;
            this.price = item.price;
            this.status = item.status ? item.status : [];
            this.creditCardDetails = item.creditCardDetails ? item.creditCardDetails : undefined;
            this.orderNumber = item.orderNumber ? item.orderNumber : '';
            this.createdAt = item.createdAt ? item.createdAt : undefined;
            this.customerFullName = item.customerFullName ? item.customerFullName : '';
            this.storeName = item.storeName ? item.storeName : { en: '', heb: '' };
            this.storeId = item.storeId ? item.storeId : '';
            this.productAndSize = item.productAndSize ? item.productAndSize : '';
            this.deliveryCity = item.deliveryCity ? item.deliveryCity : { en: '', heb: '' };
            this.itemPrices = item.itemPrices ? item.itemPrices : [];
            this.dateOfDelivery = item.dateOfDelivery ? item.dateOfDelivery : undefined;
            this.cancelationRequest = item.cancelationRequest ? item.cancelationRequest : undefined;

        }
    }

    getStatus(): StatusType {
        if (this.status && this.status.length > 0) {
            return this.status[this.status.length - 1].type;
        } else {
            return StatusType.NA;
        }
    }
    IfOrderClosed(): boolean {
        return this.getStatus() === StatusType.Closed
    }
    IfOrderPayed(): boolean {
        return (this.getStatus() === StatusType.Closed || this.getStatus() === StatusType.Payed)
    }
    IfOrderAccepted(): boolean {
        return (this.getStatus() !== StatusType.NA || this.getStatus() !== StatusType.Canceled)
    }
    recipientFullInfos(): string {
        let info = '';
        if (this.deliveryDetails)
            if (this.deliveryDetails.recipient)
                info += this.deliveryDetails.recipient.fullName;

        if (this.deliveryCity)
            if (this.deliveryCity.heb)
                info += ' ,' + this.deliveryCity.heb;
        if (this.deliveryAddress)
            if (this.deliveryAddress.apartment)
                info += ' ,' + this.deliveryAddress.street;
        info += ' ,' + this.deliveryAddress.house;
        info += ' ,' + this.deliveryAddress.floor;
        info += ' ,' + this.deliveryAddress.apartment;
        return info
    }

    IfOrderPayedByPhone(): boolean {
      return  (this.paymentType == PaymentType.phone || this.phonePaymentDetails)
        && (this.paymentType !== PaymentType.error)
    }
    IfOrderPayedByCard(): boolean {
      return  (this.paymentType == PaymentType.creditCard || this.creditCardDetails)
        && (this.paymentType !== PaymentType.error)
    }
}
