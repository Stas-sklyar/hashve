import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from './base/service.base';
import {ICity} from '../../business/interfaces/ICity';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityService extends BaseService<ICity> {

  constructor(private http: HttpClient) {
    super(http, environment.apihost, environment.regionEndpoint);
  }
}
