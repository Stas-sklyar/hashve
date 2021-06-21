import {Component, OnInit, Inject, PLATFORM_ID, OnDestroy} from '@angular/core';
import {trigger, transition, group, query, style, animate} from '@angular/animations';
import {TransferHttpService} from '@gorniv/ngx-universal';
import {UniversalStorage} from './shared/storage/universal.storage';
import {DOCUMENT, isPlatformBrowser, isPlatformServer} from '@angular/common';
import {AppService} from './app.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {platformServer} from '@angular/platform-server';

declare let gtag:Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimation', [
      transition('1 => 2, 1 => 3, 1 => 4, 2 => 3, 2 => 4, 3 => 4', [
        style({height: '!'}),
        query(':enter', style({transform: 'translateX(100%)'})),
        query(':enter, :leave', style({position: 'absolute', top: 0, left: 0, right: 0})),
        // animate the leave page away
        group([
          query(':leave', [
            animate('0.3s cubic-bezier(.35,0,.25,1)', style({transform: 'translateX(-100%)'})),
          ]),
          // and now reveal the enter
          query(':enter', animate('0.3s cubic-bezier(.35,0,.25,1)', style({transform: 'translateX(0)'}))),
        ]),
      ]),
      transition('4 => 3, 4 => 2, 4 => 1, 3 => 2, 3 => 1, 2 => 1', [
        style({height: '!'}),
        query(':enter', style({transform: 'translateX(-100%)'})),
        query(':enter, :leave', style({position: 'absolute', top: 0, left: 0, right: 0})),
        // animate the leave page away
        group([
          query(':leave', [
            animate('0.3s cubic-bezier(.35,0,.25,1)', style({transform: 'translateX(100%)'})),
          ]),
          // and now reveal the enter
          query(':enter', animate('0.3s cubic-bezier(.35,0,.25,1)', style({transform: 'translateX(0)'}))),
        ]),
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'hashve-front';
  errorMessage: string;
  showRegistrationForm: boolean = false;
  formType: string;
  subscription: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private _http: TransferHttpService,
    private _universalStorage: UniversalStorage,
    // instead window.document
    @Inject(DOCUMENT) private _document: Document,
    protected appService: AppService,
    private router: Router
  ) {
    if(isPlatformBrowser(this._platformId)) {
      router.events.subscribe((y: NavigationEnd) => {
        if (y instanceof NavigationEnd) {
          gtag('config', 'UA-1755336-1', {'page_path': y.url});
        }
      })
    }
  }

  ngOnInit(): void {
    // this._universalStorage.removeItem('test');
    // let resultCookie = this._universalStorage.getItem('test');
    /*if (resultCookie) {
      this.errorMessage = 'Cookie remove item not working';
      // console.log('Cookie put remove not working');
    }*/
    // console.log('home resultCookie 0:', resultCookie);
    /*this._universalStorage.setItem('test', 'test2');
    resultCookie = this._universalStorage.getItem('test');
    if (!resultCookie) {
      this.errorMessage = 'Cookie put item not working';
      // console.log('Cookie put item not working');
    }*/
    // console.log('home resultCookie 1:', resultCookie);
    const t = window;
    const t1 = document;

    if(isPlatformBrowser(this._platformId)){
      this.appService.onRenderBackgroundImage.subscribe((value) => {
        if (value) {
          document.getElementsByClassName('wrapper')[0].classList.add('wrapper--img');
        } else {
          document.getElementsByClassName('wrapper')[0].classList.remove('wrapper--img');
        }
      });
    }

    this.appService.onAuthFormOpen.subscribe(data => {
      this.showRegistrationForm = true;
      this.formType = 'auth';
    });

    this.subscription = this.appService.onRegistrationFormOpen.subscribe(data => {
      this.showRegistrationForm = true;
      this.formType = 'reg';
    });

    if(!isPlatformServer(this._platformId)){
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => window.scrollTo({top: 0, behavior: 'smooth'})); // document.getElementById(to).scrollIntoView({behavior: 'smooth'});
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getDepth(outlet) {
    return outlet.activatedRouteData['depth'];
  }

  closeRegistrationForm() {
    this.showRegistrationForm = false;
  }
}
