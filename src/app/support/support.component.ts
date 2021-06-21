import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../environments/environment";
import { Article } from "../business/model/article.model";
import { fromPromise } from "rxjs/src/internal/observable/fromPromise";
import { FormGroup, NgControl, FormControl, Validators } from "@angular/forms";
import { AppService } from "../app.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import {MetaService} from '@ngx-meta/core';
import {ToastrService} from 'ngx-toastr';

export enum MessageType {
  CONTACT_FORM,
  CUSTOMER_MESSAGES
}

@Component({
  selector: "app-support",
  templateUrl: "./support.component.html",
  styleUrls: ["./support.component.scss"]
})
export class SupportComponent implements OnInit {
  data: any;
  terms: Article;
  low: Article;
  faq: Article[];
  last: any;
  showSlider = false;
  curLang: string = "heb";
  sub: any;
  form: FormGroup;
  config1: any = {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    }
  };
  config2: any = {
    slidesPerView: "auto",
    freeMode: true,
    mousewheel: true
  };
  configMenu: any = {
    slidesPerView: "auto",
    freeMode: true,
    mousewheel: true
  };

  public tabStatus: boolean[] = [true, false, false, false, false];
  public faqTabsStatus: boolean[] = [];

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private readonly _meta: MetaService,
    private appService: AppService,
    private toastr: ToastrService
  ) {
    this.appService.onRenderBackgroundImage.next(false);
    this.curLang = translateService.currentLang;
    translateService.onLangChange.subscribe(lang => {
      this.curLang = lang.lang;
    });
    this.data = this.route.snapshot.data.payload;
    this.terms = new Article(this.data[0].data[0]);
    this.low = new Article(this.data[1].data[0]);
    this.faq = this.data[2].data.map(item => new Article(item));
    this.faq.forEach(i => {
      this.faqTabsStatus.push(false);
    });
    this.last = this.data[3].data.map(item => new Article(item));
    this.activatePage(this.route.snapshot.data.page);
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl("", [Validators.minLength(1), Validators.required]),
      email: new FormControl("", [Validators.email, Validators.required]),
      phone: new FormControl("", [
        Validators.minLength(4),
        Validators.required
      ]),
      topic: new FormControl(""),
      title: new FormControl(""),
      text: new FormControl("", [
        Validators.minLength(1),
        Validators.required
      ])
    });
    this.route.params.subscribe(Params => {
      // console.log(Params);
    });
  }

  activatePage(page: string): void {
    switch (page) {
      case "contact":
        this.onTabClicked(3);
        this._meta.setTitle("יצירת קשר עם שירות לקוחות אתר השווה");
        this._meta.setTag('description', "יצירת קשר עם שירות לקוחות אתר השווה");
        break;
      case "faq":
        this.onTabClicked(1);
        this._meta.setTitle(this.faq[0].seo.title[this.curLang]);
        this._meta.setTag('description', this.faq[0].seo.description[this.curLang]);
        break;
      case "terms":
        this.onTabClicked(2);
        this._meta.setTitle(this.terms.seo.title[this.curLang]);
        this._meta.setTag('description', this.terms.seo.description[this.curLang]);
        break;
      case "about-us":
        this.onTabClicked(0);
        this._meta.setTitle(this.low.seo.title[this.curLang]);
        this._meta.setTag('description', this.low.seo.description[this.curLang]);
        break;
      case "add-store":
        this.onTabClicked(4);
        break;
    }
  }

  onTabClicked(index: number) {
    for (let i = 0; i < this.tabStatus.length; i++) {
      this.tabStatus[i] = false;
    }
    this.tabStatus[index] = true;
  }

  onWrapClicked(index: number) {
    this.faqTabsStatus[index] = !this.faqTabsStatus[index];
  }

  submit() {
    const formData = this.form.value;
    formData.type = MessageType.CONTACT_FORM;
    this.appService.sendContactForm(this.form.value).subscribe(data => {
      this.form.reset();
      this.toastr.success("Message send successfully", "Contact us");
    })
  }
}
