import { IStatus } from './IStatus';
import { IOrderCancel } from './IOrderCancel';
import { ItemStoreOffer } from './../item.store.offer';
import { ITranslate } from './../../interfaces/ITranslate';
import { DiscountType } from './../../Enum/DiscountType';
import { PhonePayment } from './PhonePayment';
import { PaymentType } from './../../Enum/PaymentType';
import { CostumerDetails } from './CostumerDetails';
import { DelivertyAddress } from './DelivertyAddress';
import { DeliveryDetails } from './DeliveryDetails';
import { ProductOffer } from './../product.offer.model';

export interface IOrder {
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
  itemPrices: ItemStoreOffer[];

  cancelationRequest?: IOrderCancel;
  _id?: string;
}
