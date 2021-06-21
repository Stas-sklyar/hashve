import {DestinationType} from '../../Enum/DestinationType';

export class DelivertyAddress {
  city: string;
  street: string;
  house: string;
  floor: string;
  apartment: string;
  house?: string;

  destinationType: DestinationType;
  companyName: string;
  instructions: string;
}
