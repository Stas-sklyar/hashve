import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { City } from "./business/model/city.model";
import { environment } from "../environments/environment";
import { Package } from "./business/model/package.model";
import { Order } from "./business/model/Order/Order";
import { OfferResult } from "./business/model/offerResult/offer.result.model";
import { UniversalStorage } from "./shared/storage/universal.storage";
import { DocumentTypeStore } from "./business/Enum/DocumentTypeStore";
import { ItemSize } from "./business/Enum/ItemSize";
import { Item } from "./business/model/item.model";
import { Rate } from "./business/model/rate.model";
import { AppRouterState } from "./business/model/AppRouterState";
import { Router } from "@angular/router";
import { ProductOffer } from "./business/model/product.offer.model";
import { CitySearchStorage } from "./business/model/StorageModel/CitySerchStorageModel";

@Injectable({
  providedIn: "root",
})
export class AppService {
  public selectedCity: City = null;
  public routerState: AppRouterState;
  public watchedList: Array<OfferResult> = [];
  public onRenderBackgroundImage: Subject<boolean> = new Subject<boolean>();

  public onImprovePriceChanged: Subject<number> = new Subject<number>();
  public onCardChanged: Subject<number> = new Subject<number>();
  public onSideMenuToggle: Subject<boolean> = new Subject<boolean>();

  public onSelcetedCityChanged: BehaviorSubject<City> = new BehaviorSubject<City>(
    null
  );
  public onRegistrationFormOpen: Subject<boolean> = new Subject<boolean>();
  public onAuthFormOpen: Subject<boolean> = new Subject<boolean>();
  public onAddressFormOpen: Subject<any> = new Subject<any>();
  public onCitySearchOpen: Subject<boolean> = new Subject<boolean>();
  public onCitySearchOpenWihoutShadow: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private _universalStorage: UniversalStorage,
    private router: Router
  ) {
    this.onSelcetedCityChanged.subscribe((city) => {
      this.selectedCity = city;
    });
  }

  public getSelectedCity(): City {
    return this.selectedCity;
  }

  public saveOffer(tmp): Observable<any> {
    return this.http.post(
      environment.apihost + environment.saveOfferEndPoint,
      tmp
    );
  }

  public updatePackageOfOffer(pack: Package, offerId: string): Observable<any> {
    return this.http.post(
      environment.apihost + environment.saveOfferEndPoint + "/" + offerId,
      pack
    );
  }

  public getOrderIdByOffer(id: string) {
    return this.http.get(
      environment.apihost + environment.getOrderIdByOffer + id
    );
  }

  public createOrder(_order: Order): Observable<any> {
    return this.http.post(
      environment.apihost + environment.saveOrderEndPoint,
      _order
    );
  }

  public updateOrder(orderid, body): Observable<any> {
    return this.http.post(
      environment.apihost + environment.saveOrderEndPoint + "/" + orderid,
      body
    );
  }

  public getStoreSearchHistory() {
    let localObject: any = localStorage.getItem(
      DocumentTypeStore.citySearchHistory
    );
    if (localObject === undefined) {
      localObject = [];
    } else {
      localObject = JSON.parse(localObject);
    }
    let tmp: Array<CitySearchStorage> = localObject as Array<CitySearchStorage>;
    return tmp;
  }

  public addStoreSearchHistory(item: CitySearchStorage) {
    let localObject: any = localStorage.getItem(
      DocumentTypeStore.citySearchHistory
    );
    if (!localObject) {
      localObject = [];
    } else {
      localObject = JSON.parse(localObject);
    }
    let tmp: Array<CitySearchStorage> = localObject as Array<CitySearchStorage>;
    const result = tmp.find((city) => city._id === item._id);
    if (result) {
      return tmp;
    }
    if (tmp.length > 15) {
      const ind = tmp.length;
      for (let i = 0; i < ind - 15; i++) {
        tmp.shift();
      }
    }
    tmp.push(item);
    localStorage.setItem(
      DocumentTypeStore.citySearchHistory,
      JSON.stringify(tmp)
    );
    return tmp;
  }

  removeFromStoreSearchHistory(city) {
    let localObject: any = localStorage.getItem(
      DocumentTypeStore.citySearchHistory
    );
    if (!localObject) {
      localObject = [];
    } else {
      localObject = JSON.parse(localObject);
    }
    let tmp: Array<CitySearchStorage> = localObject as Array<CitySearchStorage>;
    const result = tmp.findIndex((item) => item._id === city._id);
    if (result >= 0) {
      tmp.splice(result, 1);
      localStorage.setItem(
        DocumentTypeStore.citySearchHistory,
        JSON.stringify(tmp)
      );
    }
    return tmp;
  }

  public getWatchedList(): Array<OfferResult> {
    let localObject: any = localStorage.getItem(DocumentTypeStore.watchedList);
    if (localObject === undefined) {
      localObject = [];
    } else {
      localObject = JSON.parse(localObject);
    }
    let tmp: Array<OfferResult> = localObject as Array<OfferResult>;
    return tmp;
  }

  public addToWatchedList(item: OfferResult) {
    let localObject: any = localStorage.getItem(DocumentTypeStore.watchedList);
    if (!localObject) {
      localObject = [];
    } else {
      localObject = JSON.parse(localObject);
    }
    let tmp: Array<OfferResult> = localObject as Array<OfferResult>;
    const result = tmp.find((offer) => offer.id === item.id);
    if (result) {
      return tmp;
    }
    if (tmp.length > 15) {
      const ind = tmp.length;
      for (let i = 0; i < ind - 15; i++) {
        tmp.shift();
      }
    }
    tmp.push(item);
    localStorage.setItem(DocumentTypeStore.watchedList, JSON.stringify(tmp));
    return tmp;
  }

  public getImprovePrice(item: Item): Item {
    const tmp = localStorage.getItem(DocumentTypeStore.improvePrice);
    let localObject: Array<any> = [];
    if (!tmp) {
      localObject = [];
    } else {
      localObject = JSON.parse(tmp);
    }
    const tmpItem = localObject.find((value) => value.id === item._id);
    if (tmpItem) {
      item.improvePrice = new Date(tmpItem.improvePrice);
      item.improvePriceRequest = tmpItem.improvePriceRequest;
    }
    return item;
  }

  public getFullImprovePrice(): any {
    const tmp = localStorage.getItem(DocumentTypeStore.improvePrice);
    let localObject: Array<any> = [];
    if (!tmp) {
      localObject = [];
    } else {
      localObject = JSON.parse(tmp);
    }
    return localObject;
  }

  public getImprovePriceCount(): number {
    const tmp = localStorage.getItem(DocumentTypeStore.improvePrice);
    if (!tmp) {
      return 0;
    } else {
      return JSON.parse(tmp).length;
    }
  }

  public removeFromImprovePriceList(item: Item) {
    const tmp = localStorage.getItem(DocumentTypeStore.improvePrice);
    item.improvePriceRequest = false;
    item.improvePrice = null;
    let localObject: Array<any> = [];
    if (!tmp) {
      localObject = [];
    } else {
      localObject = JSON.parse(tmp);
    }
    const result = localObject.findIndex((offer) => offer.id === item._id);
    if (result > -1) {
      localObject.splice(result, 1);
      localStorage.setItem(
        DocumentTypeStore.improvePrice,
        JSON.stringify(localObject)
      );
      this.onImprovePriceChanged.next(localObject.length);
    }
    return true;
  }

  public addToImprovePriceList(item: Item) {
    const tmp = localStorage.getItem(DocumentTypeStore.improvePrice);
    let localObject: Array<any> = [];
    if (!tmp) {
      localObject = [];
    } else {
      localObject = JSON.parse(tmp);
    }

    const result = localObject.find((offer) => offer.id === item._id);
    if (!result) {
      localObject.push({
        id: item._id,
        improvePrice: item.improvePrice,
        improvePriceRequest: item.improvePriceRequest,
      });
      localStorage.setItem(
        DocumentTypeStore.improvePrice,
        JSON.stringify(localObject)
      );
      this.onImprovePriceChanged.next(localObject.length);
    }
    return true;
  }

  public addToCard(item: any) {
    const tmp = localStorage.getItem(DocumentTypeStore.Card);
    let localObject: Array<any> = [];
    if (!tmp) {
      localObject = [];
    } else {
      localObject = JSON.parse(tmp);
    }

    const result = localObject.find(
      (offer) => offer.offer === item && offer.city === this.selectedCity._id
    );
    if (!result) {
      localObject.push({
        offer: item,
        city: this.selectedCity._id,
      });
      localStorage.setItem(DocumentTypeStore.Card, JSON.stringify(localObject));
      this.onCardChanged.next(localObject.length);
    }
    return true;
  }

  public removeFromCard(item: string, city: string) {
    const tmp = localStorage.getItem(DocumentTypeStore.Card);
    let localObject: Array<any> = [];
    if (!tmp) {
      localObject = [];
    } else {
      localObject = JSON.parse(tmp);
    }

    const index = localObject.findIndex(
      (offer) => offer.item === item && offer.city === city
    );
    if (index > -1) {
      localObject.splice(index, 1);
      localStorage.setItem(DocumentTypeStore.Card, JSON.stringify(localObject));
      this.onCardChanged.next(localObject.length);
    }
    return true;
  }

  public getCardCount(): number {
    const tmp = localStorage.getItem(DocumentTypeStore.Card);
    if (!tmp) {
      return 0;
    } else {
      return JSON.parse(tmp).length;
    }
  }

  public getFullCard(): any {
    const tmp = localStorage.getItem(DocumentTypeStore.Card);
    let localObject: Array<any> = [];
    if (!tmp) {
      localObject = [];
    } else {
      localObject = JSON.parse(tmp);
    }
    return localObject;
  }

  public getWishList(item: Item): boolean {
    const tmp = localStorage.getItem(DocumentTypeStore.wishList);
    let localObject: Array<any> = [];
    if (!tmp) {
      localObject = [];
    } else {
      localObject = JSON.parse(tmp);
    }
    const tmpItem = localObject.find((value) => value.id === item._id);
    return tmpItem ? true : false;
  }

  public getFullWishList(): any {
    const tmp = localStorage.getItem(DocumentTypeStore.wishList);
    let localObject: Array<any> = [];
    if (!tmp) {
      localObject = [];
    } else {
      localObject = JSON.parse(tmp);
    }
    return localObject;
  }

  public addWishList(item: Item) {
    const tmp = localStorage.getItem(DocumentTypeStore.wishList);
    let localObject: Array<any> = [];
    if (!tmp) {
      localObject = [];
    } else {
      localObject = JSON.parse(tmp);
    }

    const result = localObject.findIndex((offer) => offer.id === item._id);
    if (result > -1) {
      localObject.splice(result, 1);
      localStorage.setItem(
        DocumentTypeStore.wishList,
        JSON.stringify(localObject)
      );
      return false;
    } else {
      localObject.push({
        id: item._id,
      });
      localStorage.setItem(
        DocumentTypeStore.wishList,
        JSON.stringify(localObject)
      );
      return true;
    }
  }

  public saveFeedBack(feedback: Rate, orderID: string): Observable<any> {
    const url = `${environment.apihost}${environment.saveRateEndpoint}/${orderID}`;
    return this.http.post(url, feedback);
  }

  public createOffer() {
    let newOffer: any = {};
    newOffer.package = new Package({});
    newOffer.package.baseItem = this.routerState.element;
    newOffer.package.size = ItemSize.normal;
    this.http
      .get(
        environment.apihost +
          environment.cheapestDeliveryStore +
          "/" +
          this.selectedCity._id
      )
      .subscribe((data: any) => {
        newOffer.store = data.store._id;
        newOffer.city = this.selectedCity._id;
        this.saveOffer(newOffer).subscribe((offData) => {
          this.router.navigateByUrl(`product/` + offData.data._id);
        });
      });
  }

  public createStoreOffer(item, store) {
    let newOffer: any = {};
    newOffer.package = new Package({});
    newOffer.package.baseItem = item._id;
    newOffer.package.size = ItemSize.normal;

    newOffer.store = store._id;
    newOffer.city = store.city._id;
    this.saveOffer(newOffer).subscribe((offData) => {
      this.router.navigateByUrl(`product/` + offData.data._id);
    });
  }

  public createStoreOfferWithCity(item, store, city) {
    let newOffer: any = {};
    newOffer.package = new Package({});
    newOffer.package.baseItem = item._id;
    newOffer.package.size = ItemSize.normal;

    newOffer.store = store._id;
    newOffer.city = city._id;
    this.saveOffer(newOffer).subscribe((offData) => {
      this.router.navigateByUrl(`product/` + offData.data._id);
    });
  }

  public createCityOffer(item, city) {
    let newOffer: any = {};
    newOffer.package = new Package({});
    newOffer.package.baseItem = item;
    newOffer.package.size = ItemSize.normal;
    this.http
      .get(
        environment.apihost + environment.cheapestDeliveryStore + "/" + city._id
      )
      .subscribe((data: any) => {
        newOffer.store = data.store._id;
        newOffer.city = city._id;
        this.saveOffer(newOffer).subscribe((offData) => {
          this.router.navigateByUrl(`product/` + offData.data._id);
        });
      });
  }

  public createCurrentCityStoreItemOffer(store_id, item_id) {
    let newOffer: any = {};
    newOffer.package = new Package({});
    newOffer.package.baseItem = item_id;
    newOffer.package.size = ItemSize.normal;

    newOffer.store = store_id;
    newOffer.city = this.selectedCity._id;
    this.saveOffer(newOffer).subscribe((offData) => {
      this.router.navigateByUrl(`product/` + offData.data._id);
    });
  }

  public navigateByLink(link: string) {
    this.router.navigateByUrl(link);
  }

  public updateOfferStore(offerID: string, storeID: string): Observable<any> {
    return this.http.get(
      `${environment.apihost}/api/v1/content/product/${storeID}/${offerID}`
    );
  }

  public updateOfferCity(offerID: string, cityId: string): Observable<any> {
    return this.http.put(
      `${environment.apihost}/api/v1/content/product/${cityId}/${offerID}`,
      {}
    );
  }

  public storeCall(offer: ProductOffer, tel: number): Observable<any> {
    return this.http.post(
      `${environment.apihost}${environment.storeCall}/${tel}`,
      offer
    );
  }

  public sendContactForm(form): Observable<any> {
    return this.http.post(`${environment.apihost}/api/v1/message`, form);
  }
}
