import { DeliveryType } from './../../Enum/DeliveryType';
import {DestinationType} from '../../Enum/DestinationType';
import {ReceiverInformation} from './ReceiverInformation';

export class DeliveryDetails {
  destinationType: DestinationType = DestinationType.private;
  deliveryType: DeliveryType;
  date: Date;
  hours: string;
  blessing: string;
  specialRequests: string;
  recipient: ReceiverInformation;
}
