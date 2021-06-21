import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../app.service';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Rate } from '../business/model/rate.model';
import { Order } from '../business/model/Order/Order';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-rating-page',
  templateUrl: './rating-page.component.html',
  styleUrls: ['./rating-page.component.scss']
})
export class RatingPageComponent implements OnInit {
  data: any;
  order: any;
  date: any;
  curLang: string = 'heb';
  rate: Rate = new Rate();
  showSlider = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private translateSrv: TranslateService,
    private toastr: ToastrService) {
    this.curLang = translateSrv.currentLang;
    translateSrv.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
    this.data = this.route.snapshot.data.payload;
    this.order = this.data.data;
    this.date = moment(this.order.createdAt).format("DD/MM/YYYY");
    this.appService.onRenderBackgroundImage.next(false);
    this.rate.rate = 5;
  }

  ngOnInit() {
  }

  onRate($event) {
    this.rate.rate = $event.newValue;
    // console.log($event);
  }

  saveRate() {
    if (this.rate.feedback && this.rate.feedback.length > 5) {
      this.rate.fullName = this.order.customerDitails.fullName;
      this.rate.item = this.order.productOffer.package.baseItem;
      this.rate.order = this.order._id;
      this.rate.city = this.order.deliveryAddress.city;
      this.appService.saveFeedBack(this.rate, this.order._id).subscribe(data => {
        this.toastr.success('דירוג המוצר שמור בהצלחה!', 'דירוג המוצר');
        this.router.navigateByUrl('/');
      });
    } else {
      this.toastr.error('חוות דעת אמורה להיות יותר מ-5 תווים!', 'דירוג המוצר');
    }
  }

}
