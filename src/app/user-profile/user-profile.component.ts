import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import { ICity } from '../business/interfaces/ICity';

import { ICustomer } from '../business/interfaces/ICustomer';
import { EmptyCustomerAddress, ICustomerAddress } from '../business/interfaces/ICustomerAddress';

import { Customer } from '../business/model/customer.model';
import { CustomerService } from '../shared/service/customer-service.service';
import { CustomerModuleservice } from '../shared/service/Resolvers/customer-module.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers:[DatePipe]
})
export class UserProfileComponent implements OnInit {

  _customer: ICustomer;
  formUserInfos: FormGroup;
  formAddress: FormGroup;
  formPassword: FormGroup;
  ListformAddress: FormGroup[];
  showSlider = false;
  isNewAddress = false;
  cities: ICity[];
  selectedAddress: ICustomerAddress = EmptyCustomerAddress;
  ifShowFormAddress: boolean = false;
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _customerService: CustomerService,
    protected _appService: AppService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _CustomerModuleService: CustomerModuleservice  , private datePipe: DatePipe ) {

     
    this.ListformAddress = [];
    const payload = this._activatedRoute.snapshot.data.payload;
    this.cities = payload.cities;
    const existUser = payload.ifUser;


    if (!existUser) {
      this._router.navigateByUrl('/');
    }
    this._customer = _CustomerModuleService.customer;

    this.formUserInfos = this.createFormUserInfos(this._customer);
    this.formPassword = this.createFormPassword();

  }

  ngOnInit() {

    this._appService.onAddressFormOpen.subscribe(data => {
      this.ifShowFormAddress = true;
      data.customer = this._customer._id;
      this.selectedAddress = data
    })
  }
  createFormUserInfos(_customer): FormGroup {
     const birth = _customer.birthday?this.datePipe.transform(new Date(_customer.birthday), 'yyyy-MM-dd'):null ; 
    return this.fb.group({
      fullName: [_customer.fullName ? _customer.fullName : _customer.fullName],
      email: [_customer.email],
      phone: [_customer.phone ? _customer.phone : _customer.address.phone],
      birthday: [birth],
      city: [_customer.city],
    })
  }
  createFormPassword(): FormGroup {

    return this.fb.group({
      password: [],
      newPassword: [],

    })
  }
  // createFormAddress(_customer): FormGroup {
  //   return this.fb.group({
  //     companyName: [_customer.address.companyName, ''],
  //     destinationType: [_customer.address.destinationType, ''],
  //     apartment: [_customer.address.apartment, ''],
  //     floor: [_customer.address.floor, ''],
  //     city: [_customer.address.city, ''],
  //     house: [_customer.address.house, ''],
  //     instructions: [_customer.address.instructions, ''],
  //     street: [_customer.address.street, ''],
  //     fullName: [_customer.address.fullName, ''],
  //     phone: [_customer.address.phone, ''],
  //   })
  // }
  // createFormAddressList(address): FormGroup {
  //   return this.fb.group({
  //     companyName: [address.companyName, ''],
  //     destinationType: [address.destinationType, ''],
  //     apartment: [address.apartment, ''],
  //     floor: [address.floor, ''],
  //     city: [address.city, ''],
  //     house: [address.house, ''],
  //     instructions: [address.instructions, ''],
  //     street: [address.street, ''],
  //     fullName: [address.fullName, ''],
  //     phone: [address.phone, ''],
  //     customer: [address.customer, ''],
  //     _id: [address._id, ''],
  //   })
  // }

  saveUserInfosData() {
    const data = this.formUserInfos.value;
    data.birthday = (new Date (data.birthday).toISOString());  
    this._customerService.updateUserInfos(data, this._customer._id).subscribe(data => {
      this._CustomerModuleService.checkUserLogged();
      this._customer = this._CustomerModuleService.customer;
      this.createFormUserInfos(this._customer) ;
      this.createFormPassword();
    })
  }
  changePassword() {
    const data = this.formPassword.value;
    this._customerService.changePassword(data, this._customer.email).subscribe(data => {
        localStorage.setItem('token', JSON.stringify(data.token));

        this._CustomerModuleService.checkUserLogged();
        this._customer = this._CustomerModuleService.customer;
        this.createFormUserInfos(this._customer) ;
        this.createFormPassword()
    }, error => {
      this.toastr.error(error.error);
    })
  }
  saveAddressForm(_id?: string) {
    let formData: any = null;
    let customerAddress: any = null;

    if (!_id) {
      return;
    } else {
      formData = this.ListformAddress.find(item => item.value._id == _id);
      customerAddress = formData.value;

    }
    this._customerService.updateAddresse(customerAddress, customerAddress._id).subscribe(data => {
      this._CustomerModuleService.checkUserLogged();
    })
  }

  showAddressForm(_id: any) {
    const add = this._customer.address.find(item => item._id === _id);
    this._appService.onAddressFormOpen.next(add ? add : EmptyCustomerAddress)
  }
   async closeRegistrationForm() {
    this.ifShowFormAddress = false;
    await this._CustomerModuleService.checkUserLogged();

    this._customer = this._CustomerModuleService.customer;
  }

  getCity(_id: string): String {
    let index = this.cities.findIndex((i) => { return i._id === _id })
    return index > -1 ? this.cities[index].name.heb : ''
  }
  setPrincipalAddress(id: string) {
    this._customerService.setPrincipalAddress(id, this._customer._id).subscribe(async data => {
      await this._CustomerModuleService.checkUserLogged();
      this._customer = this._CustomerModuleService.customer;
    })
  }
  deleteAddress(id: string) {
    this._customerService.deleteAddress(id).subscribe(async data => {
      await this._CustomerModuleService.checkUserLogged();
      this._customer = this._CustomerModuleService.customer;
    })
  }
}
