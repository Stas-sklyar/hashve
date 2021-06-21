import { IStatus } from './IStatus';
import { ItemStoreOffer } from './../item.store.offer';
import { ITranslate } from './../../interfaces/ITranslate';
import { IOrderCancel } from './IOrderCancel';
import { StatusType } from './../../Enum/StatusType';
import { ProductOffer } from './../product.offer.model';
import { DiscountType } from '../../Enum/DiscountType';
import { PaymentType } from '../../Enum/PaymentType';
import { CostumerDetails } from './CostumerDetails'
import { DeliveryDetails } from './DeliveryDetails';
import { DelivertyAddress } from './DelivertyAddress';
import { PhonePayment } from './PhonePayment';
import { CreditCardPayment } from './CreditCardPayment';
import { IOrder } from './IOrder';

export class Order {
  productOffer: ProductOffer | string;
  price: number;
  deliveryPrice: number;
  deliveryDetails: DeliveryDetails;
  deliveryAddress: DelivertyAddress;
  customerDitails: CostumerDetails;
  paymentType: PaymentType;
  creditCardDetails: string;
  orderNumber: string;
  phonePaymentDetails: PhonePayment;
  status: Array<IStatus>;
  typeOfDiscount: DiscountType;
  customerFullName: string;
  dateOfDelivery: Date;
  storeName: ITranslate;
  storeId: string;
  productAndSize: string;
  deliveryCity: ITranslate;
  itemPrices: ItemStoreOffer[]

  cancelationRequest?: IOrderCancel;
  _id?: string;

  constructor(item: IOrder = null) {
    this.productOffer = item && item.productOffer ? item.productOffer : null;
    this.price = item && item.price ? item.price : null;
    this.deliveryPrice = item && item.deliveryPrice ? item.deliveryPrice : null;
    this.deliveryDetails = item && item.deliveryDetails ? item.deliveryDetails : null;
    this.deliveryAddress = item && item.deliveryAddress ? item.deliveryAddress : null;
    this.customerDitails = item && item.customerDitails ? item.customerDitails : null;
    this.paymentType = item && item.paymentType ? item.paymentType : null;
    this.creditCardDetails = item && item.creditCardDetails ? item.creditCardDetails : null;
    this.orderNumber = item && item.orderNumber ? item.orderNumber : null;
    this.phonePaymentDetails = item && item.phonePaymentDetails ? item.phonePaymentDetails : null;
    this.status = item && item.status ? item.status : null;
    this.typeOfDiscount = item && item.typeOfDiscount ? item.typeOfDiscount : null;
    this.customerFullName = item && item.customerFullName ? item.customerFullName : null;
    this.dateOfDelivery = item && item.dateOfDelivery ? item.dateOfDelivery : null;
    this.storeName = item && item.storeName ? item.storeName : null;
    this.storeId = item && item.storeId ? item.storeId : null;
    this.productAndSize = item && item.productAndSize ? item.productAndSize : null;
    this.deliveryCity = item && item.deliveryCity ? item.deliveryCity : null;
    this.itemPrices = item && item.itemPrices ? item.itemPrices : null;
    if (item && item.cancelationRequest) {
      this.cancelationRequest = item.cancelationRequest;
    }
    if (item && item._id) {
      this._id = item._id;
    }
  }

  public currentStatus(): StatusType {
    if (this.status && this.status.length) {
      return this.status[this.status.length - 1].type;
    } else {
      return undefined;
    }
  }

  public isStatus(status: StatusType): boolean {
    if (this.status && this.status.length) {
      return this.status[this.status.length - 1].type === status;
    } else {
      return false;
    }
  }
}
