import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Item } from '../../../business/model/item.model';
import { environment } from '../../../../environments/environment';
import { AppService } from '../../../app.service';
import { Store } from '../../../business/model/store.model';

@Component({
  selector: 'app-accelerate-sales',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './accelerate-sales.component.html'
})
export class AccelerateSalesComponent implements OnInit, AfterViewInit {
  recommndet: Item[] = [];
  saled: Item[] = [];
  prices: any[] = [];
  host: string = environment.apihost;
  _store: Store = null;
  @Input() set store(value) {
    this._store = value;
    this.cdr.detectChanges();
  }

  constructor(private http: HttpClient, private appService: AppService, private cdr: ChangeDetectorRef) {
    let params;
    if (this.appService.getSelectedCity()) {
      params = new HttpParams().set('city', this.appService.getSelectedCity().name.heb.replace(/\s/g, '_'));
    } else {
      params = null;
    }

    this.http.get(this.host + '/api/v1/content/get-item-banner-data', { params }).subscribe((data: any) => {
      this.saled = this._store ?
        data.mostSaled.map(item => new Item(item)).filter(item => this._store.inStock(item._id)) :
        data.mostSaled.map(item => new Item(item));
      this.recommndet = this._store ?
        data.recommended.map(item => new Item(item)).filter(item => this._store.inStock(item._id)) :
        data.recommended.map(item => new Item(item));
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
  }

  redirectToCitySearch() {
    if (!this.appService.selectedCity) {
      this.appService.onCitySearchOpen.next(true);
    } else {
      const link: string = `/פרחים_${this.appService.selectedCity.name.heb.replace(/\s/g, '_')}`;
      this.appService.navigateByLink(link);
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

}
