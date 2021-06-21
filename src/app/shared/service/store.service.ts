import { Injectable } from '@angular/core';
import {Store} from '../../business/model/store.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  cacheStore: Store;
  constructor() { }
}
