import {Component, Input} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {AppService} from '../../../app.service';
import {Item} from '../../../business/model/item.model';
import {Store} from '../../../business/model/store.model';
import {Router} from '@angular/router';
import {City} from '../../../business/model/city.model';
import {ItemStatisticalPrices} from '../../../business/model/analytics/ItemStatisticalPrices';
import {Package} from '../../../business/model/package.model';
import {ItemSize} from '../../../business/Enum/ItemSize';
import {RateService} from '../../service/rate.service';
import {ItemStoreOffer} from '../../../business/model/item.store.offer';
import {timer} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

class OfferStore {
  public store: Store;
  public offer: ItemStoreOffer;
}

@Component({
  selector: 'app-package-full',
  templateUrl: './package-full.component.html',
  styleUrls: ['./package-full.component.scss'],
})

export class PackageFullComponent {
  _ItemSize = ItemSize
  data: any;
  currentCity: City;
  stores: Store[];
  curLang = 'heb';
  host = environment.apihost;
  showSlider = false;
  offers: any;
  store: Store;
  offerStore: OfferStore[] = [];
  minPrice: Number = 0;
  minPriceWithDiscount = 0;
  cityStores: Store[];
  pic: string;
  timer: any;
  curItem: Item;
  packages: any;
  addItem: Item[] = [];
  state = {
    minutes: 0,
    seconds: 0
  };
  sizeArray = {
    0: {
      heb: 'רגיל',
      en: 'M'
    },
    40: {
      heb: 'גדול',
      en: 'L'
    },
    80: {
      heb: 'ענק',
      en: 'XL'
    }
  };
  colors: Array<string> = ['#FF33FF', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

  @Input() showOffers: boolean = true;

  @Input() items: Item[];

  @Input()
  set pack(value) {
    this.offers = value;
    this.curItem = this.offers.package.baseItem;
    this.curItem = this.appService.getImprovePrice(this.curItem);
    this.checkTimer();

    console.log(this.offers);

    this.offers.package.addItems.forEach(item => {
      this.addItem.push(
        this.items.find(additem => additem._id === item)
      );
    });
  }

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private appService: AppService, private router: Router, private rateService: RateService) {
    this.appService.onRenderBackgroundImage.next(false);
    this.appService.onSelcetedCityChanged.subscribe(city => {
      this.currentCity = city;
    });

  }

  private checkTimer() {
    if (this.curItem.isPriceImproveValid()) {
      this.timer = timer(1000, 1000);
      this.timer.subscribe(val => {
        this.state.minutes = this.curItem.getMinutes();
        this.state.seconds = this.curItem.getSeconds();
      });
    } else {
      this.appService.removeFromImprovePriceList(this.curItem);
    }
  }

  startImprovingPrice() {
    this.curItem.improvePriceRequest = true;
    this.curItem.improvePrice = new Date();
    this.checkTimer();
    this.appService.addToImprovePriceList(this.curItem);
    this.toastr.success('הצעה חדשה התווספה לדף שיפור מחיר.', 'שיפור מחיר');
    this.sortStores();
    this.calculateMinPrices();
  }

  sortStores(): void {
    this.cityStores.sort((a, b) => {
      const itemA = a.getPrice(this.curItem) + a.getDeliveryPrice(this.currentCity._id);
      const itemB = b.getPrice(this.curItem) + b.getDeliveryPrice(this.currentCity._id);
      return itemA > itemB ? 1 : -1;
    });
    this.minPriceWithDiscount = this.cityStores[0].getPrice(this.curItem) + this.cityStores[0].getDeliveryPrice(this.currentCity._id);
  }

  calculateMinPrices(): void {
    this.minPrice = 0;
    this.offerStore = [];
    this.cityStores.forEach((item, index) => {
      const offer = item.items.find((offers) => {
        return offers.item === this.curItem._id;
      });
      if (index === 0) {
        this.minPrice = offer.price + item.getDeliveryPrice(this.currentCity._id);
      }
      this.minPrice = offer.price + item.getDeliveryPrice(this.currentCity._id) < this.minPrice ? offer.price + item.getDeliveryPrice(this.currentCity._id) : this.minPrice;
      this.offerStore.push({store: item, offer});
    });
  }

}
