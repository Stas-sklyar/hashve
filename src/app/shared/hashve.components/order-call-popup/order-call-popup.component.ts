import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {ProductOffer} from '../../../business/model/product.offer.model';
import {AppService} from '../../../app.service';
import {Router} from '@angular/router';
import {Package} from '../../../business/model/package.model';
import {TranslateService} from '@ngx-translate/core';
import {ItemSize} from '../../../business/Enum/ItemSize';
import {Item} from '../../../business/model/item.model';
import {ToastrService} from 'ngx-toastr';
import {DiscountType} from '../../../business/Enum/DiscountType';
import {FormBuilder, Validators} from '@angular/forms';
import {DeliveryType} from '../../../business/Enum/DeliveryType';

@Component({
  selector: 'app-order-call-popup',
  templateUrl: './order-call-popup.component.html',
  styleUrls: ['./order-call-popup.component.scss']
})
export class OrderCallPopupComponent implements OnInit, OnDestroy {
  public host: string = environment.apihost;
  private styleTag: HTMLStyleElement;
  _deliveryType = DeliveryType;
  phoneForm: any;
  startAnimate = false;
  _ItemSize = ItemSize;
  sizesName = {
    normal: {
      en: 'Normal',
      heb: 'רגיל'
    },
    large: {
      en: 'Large',
      heb: 'גדול'
    },
    extraLarge: {
      en: 'Extra',
      heb: 'ענק'
    },
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
  size: any = ItemSize;
  curLang: string;
  offer: ProductOffer = null;

  @Input() set productOffer(val: ProductOffer){
    this.offer = val;
    this.offer.orderNumber = this.offer.orderNumber?this.offer.orderNumber:this.getRandomInt(10000000, 99999999);
  }
  @Input() additionalItems: Item[] = [];
  @Input() link: string = '';

  constructor(protected appService: AppService, private route: Router, private translateSrv: TranslateService, private toastr: ToastrService, private fb: FormBuilder) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
    this.phoneForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern("[0-9]*(-?[0-9]+){1,2}"), Validators.minLength(8), Validators.maxLength(9),]],
    });
    
  }

  ngOnInit() {
    this.styleTag = this.buildStyleElement();
    document.body.appendChild(this.styleTag);
  }

  nextToPayment(): void {
    this.appService.updatePackageOfOffer(this.offer.package as Package, this.offer._id).subscribe((data) => {
      this.route.navigateByUrl(`payment/` + data.data._id);
    });
  }

  ngOnDestroy(): void {
    document.body.removeChild( this.styleTag );
  }

  storeCall(tel){
    let telephone = '972' + this.phoneForm.get('phone').value;
    this.startAnimate = true;
    setTimeout(()=>{this.startAnimate = false}, 15000);
    this.offer.discountType = this.offer.package.baseItem.isSale()?DiscountType.Discount:
      (this.offer.package.baseItem.isDayDeal()?DiscountType.DailyDeal:
        (this.offer.package.baseItem.isPriceImproveValid()?DiscountType.ImprovePrice:DiscountType.NO))
    if(!isNaN(+telephone)) {
      this.appService.storeCall(this.offer, +telephone).subscribe(data => {
        console.log(data);
      });
    }else{
      this.toastr.error("The number is not valid", "Try to fix the number and try back");
    }
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private buildStyleElement() : HTMLStyleElement {
    var style = document.createElement( "style" );
    style.type = "text/css";
    style.setAttribute( "data-debug", "Injected by popup order call." );
    style.textContent = `
            body {
                overflow: hidden !important ;
            }
        `;
    return( style );
  }
}
