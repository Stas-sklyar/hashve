
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DestinationType } from '../../business/Enum/DestinationType';
import { ICity } from '../../business/interfaces/ICity';
import { EmptyCustomerAddress, ICustomerAddress } from '../../business/interfaces/ICustomerAddress';
import { Customer } from '../../business/model/customer.model';
import { CustomerService } from '../../shared/service/customer-service.service';
import { CustomerModuleservice } from '../../shared/service/Resolvers/customer-module.service';

@Component({
  selector: 'app-form-user-address',
  templateUrl: './form-address.component.html',
  styleUrls: ['./form-address.component.scss']
})
export class FormAddressComponent implements OnInit {
  _customer: ICustomerAddress = EmptyCustomerAddress ;
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  formAddress: FormGroup;
  
  
  @Input() set customer(value) {
    this._customer = value;
  };
  cities :ICity[] =  [];
  constructor(  
    private fb: FormBuilder, 
    private _activatedRoute:ActivatedRoute,
    private _customerModuleService:CustomerModuleservice,
    private _customerService:CustomerService) {
    const payload = this._activatedRoute.snapshot.data.payload;
    this.cities = payload.cities; 

   }

  ngOnInit() {
    this.formAddress = this.createFormAddress(this._customer );
  }

  onFormClose() {
    this.onClose.emit(true);
  }


  createFormAddress(address): FormGroup {
    return this.fb.group({
      companyName: [address.companyName, ''],
      destinationCompany: [address.destinationType != DestinationType.private?true:false, ''],
      destinationPrivate: [address.destinationType == DestinationType.private?true:false, ''],
      apartment: [address.apartment, ''],
      floor: [address.floor, ''],
      city: [address.city, ''],
      house: [address.house, ''],
      instructions: [address.instructions, ''],
      street: [address.street, ''],
      fullName: [address.fullName, ''],
      phone: [address.phone, ''],
      customer: [address.customer, ''],
      _id: [address._id, ''],
    })
  }

  saveAddressForm() {
    let customerAddress: any = (this.formAddress.value as ICustomerAddress);
    
    customerAddress.destinationType =  DestinationType.private ;

    if(this.formAddress.value.destinationCompany){
      customerAddress.destinationType =  DestinationType.office
    }
    
    this._customerService.updateAddresse(customerAddress, customerAddress._id).subscribe(data => {
   
    this.onFormClose()
    },error =>  {

    })
  }
}
