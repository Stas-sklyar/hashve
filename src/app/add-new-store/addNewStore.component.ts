import { Component, OnInit } from "@angular/core";
import { AppService } from "../app.service";
import { ActivatedRoute } from "@angular/router";
import { Article } from "../business/model/article.model";
import { AbstractControl, FormBuilder, FormGroup, NgControl, FormControl, Validators } from "@angular/forms";
import { ValidationErrors } from "@angular/forms";
import { MetaService } from '@ngx-meta/core';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-addNewStore",
  templateUrl: "./addNewStore.component.html",
  styleUrls: ["./addNewStore.component.scss"]
})
export class AddNewStoreComponent implements OnInit {
  data: any;
  showSlider = false;
  curLang: string = "heb";
  addNewStore: Article;
  form: FormGroup;
  formTwo: FormGroup;
  data2: any;
  terms: Article;
  low: Article;
  faq: Article[];
  public faqTabsStatus: boolean[] = [];
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


  public tabStatus2: boolean[] = [false, false, false, false, true];
  public tabStatus: boolean[] = [true, false];

  constructor(private route: ActivatedRoute, private appService: AppService, private readonly _meta: MetaService, private toastr: ToastrService) {
    this.data = this.route.snapshot.data.payload;
    this.addNewStore = new Article(this.data[0].data[0]);
    this._meta.setTag('description', this.addNewStore.seo.description[this.curLang])
    this._meta.setTitle(this.addNewStore.seo.title[this.curLang])
    this.appService.onRenderBackgroundImage.next(false);
  }

  private passwordValidator(control: FormControl): ValidationErrors {
    const value = control.value;

    const hasNumber = /[0-9]/.test(value);

    const hasLowercaseLetter = /[a-z]/.test(value);

    const isLengthValid = value ? value.length > 7 : false;

    const passwordValid = hasNumber && hasLowercaseLetter && isLengthValid;

    return null;
  }

  ngOnInit() {
    this.form = new FormGroup({
      company: new FormControl("", [
        Validators.minLength(1),
        Validators.required
      ]),
      city: new FormControl("", [Validators.minLength(1), Validators.required]),
      street: new FormControl("", [
        Validators.minLength(1),
        Validators.required
      ]),
      house: new FormControl("", [
        Validators.minLength(1),
        Validators.required
      ]),
      name: new FormControl("", [Validators.minLength(1), Validators.required]),
      email: new FormControl("", [Validators.email, Validators.required]),
      phone: new FormControl("", [
        Validators.minLength(4),
        Validators.required
      ]),

      password: new FormControl("", [
        Validators.minLength(8),
        Validators.required,

      ]),
      passwordTwo: new FormControl("", [
        Validators.minLength(8),
        Validators.required,
      ])
    });

    this.formTwo = new FormGroup({
      company: new FormControl("", [
        Validators.minLength(1),
        Validators.required
      ]),
      city: new FormControl("", [Validators.minLength(1), Validators.required]),
      name: new FormControl("", [Validators.minLength(1), Validators.required]),
      email: new FormControl("", [Validators.email, Validators.required]),
      phone: new FormControl("", [
        Validators.minLength(4),
        Validators.required
      ]),
      password: new FormControl("", [
        Validators.minLength(8),
        Validators.required,
        this.passwordValidator
      ]),
      passwordTwo: new FormControl("", [
        Validators.minLength(8),
        Validators.required,
        this.passwordValidator
      ])
    });

  }

  onTabClicked(index: number) {
    for (let i = 0; i < this.tabStatus.length; i++) {
      this.tabStatus[i] = false;
    }
    this.tabStatus[index] = true;
  }

  hasCharacter(form): boolean {
    const value = form.get('password').value;
    return /[a-zA-Z]+/.test(value);
  }

  hasNumber(form): boolean {
    const value = form.get('password').value;
    return /[0-9]+/.test(value);
  }

  hasMinLength(form): boolean {
    const value = form.get('password').value;
    const isLengthValid = value ? value.length > 7 : false;
    return isLengthValid;
  }
  theSame(form): boolean {
    const value = form.get('password').value;
    const value2 = form.get('passwordTwo').value;
    const isSame = value ? value === value2 : false;
    return isSame;
  }

  hasCharacter2(formTwo): boolean {
    const value = formTwo.get('password').value;
    return /[a-zA-Z]/.test(value);
  }

  hasNumber2(formTwo): boolean {
    const value = formTwo.get('password').value;
    return /[0-9]/.test(value);
  }

  hasMinLength2(formTwo): boolean {
    const value = formTwo.get('password').value;
    const isLengthValid = value ? value.length > 7 : false;
    return isLengthValid;
  }
  theSame2(formTwo): boolean {
    const value = formTwo.get('password').value;
    const value2 = formTwo.get('passwordTwo').value;
    const isSame = value ? value === value2 : false;
    return isSame;
  }

  submit() {
    debugger
    const formData = { ...this.form.value };
    this.appService.sendContactForm({
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      text: `City: ${formData.city || ''} | Street: ${formData.street || ''} | House: ${formData.house || ''} | Company: ${formData.company || ''} | Password: ${formData.password || ''}`,
      title: formData.company,
      topic: 'topic',
      type: 1
    }).subscribe(data => {
      this.form.reset();
      this.toastr.success("Message send successfully", "Contact us");
    });
  }

  submitTwo() {
    debugger
    const formData = { ...this.formTwo.value };
    this.appService.sendContactForm({
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      text: `City: ${formData.city || ''} | Company: ${formData.company || ''} | Password: ${formData.password || ''}`,
      title: formData.company,
      topic: 'topic',
      type: 1
    }).subscribe(data => {
      this.formTwo.reset();
      this.toastr.success("Message send successfully", "Contact us");
    });
  }
}
