import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppAuthService} from '../../service/auth.service';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {noop} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from 'angularx-social-login';
import {FacebookLoginProvider, GoogleLoginProvider} from 'angularx-social-login';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  authF: FormGroup;
  registrationForm: FormGroup;
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() set formType(value) {
    if (value === 'auth') {
      this.showRegistration = false;
    } else {
      this.showRegistration = true;
    }
  };

  showRegistration: boolean = false;

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private authService: AuthService,
              private appAuthService: AppAuthService,
              private router: Router,
              private translateService: TranslateService
  ) {
    this.authF = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.registrationForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rePassword: ['', Validators.required],
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => {
      this.appAuthService.socialLogin(x.provider, x.authToken).subscribe(data => {
        // console.log(data);
      },error => {
        // debugger
        this.toastr.error(error.error.error);
      });
      // console.log(x);
    });
  }

  signInWithGoole(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => {
      this.appAuthService.socialLogin(x.provider, x.authToken).subscribe(data => {
        // console.log(data);
      }, error => {
        // debugger
        this.toastr.error(error.error.error);
      });
      // console.log(x);
    });
  }

  signOut(): void {
    this.authService.signOut();
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      const _user = user;
      const loggedIn = (user != null);
    });
  }

  onFormClose() {
    this.onClose.emit(true);
  }

  // registraion() {
  //   const val = this.registrationForm.value;
  //   this.appAuthService.registration(val).pipe(
  //     tap(user => {
  //       //console.log(user);
  //       this.translateService.get(['registration.success.content', 'registration.success.title']).subscribe(data => {
  //         this.toastr.success(data['registration.success.content'], data['registration.success.title']);
  //         this.onClose.emit(true);
  //       });
  //     })
  //   ).subscribe(noop, (error) => {
  //     this.toastr.error(error.data);
  //   });
  // }

  registraion() {
    const val = this.registrationForm.value;
    console.log(val);
    
    this.appAuthService.customerRegistration(val).pipe(
      tap(user => {

         localStorage.removeItem('customer' );
         localStorage.removeItem('token' );
         
        this.translateService.get(['registration.success.content', 'registration.success.title']).subscribe(data => {
          this.toastr.success(data['registration.success.content'], data['registration.success.title']);
          this.onClose.emit(true);
        });
      })
    ).subscribe(noop, (error) => {
      console.log(error);
      
      this.toastr.error(error.error);
    });
  }

  login() {
    const val = this.authF.value;
    this.appAuthService.login(val.email, val.password).pipe(
      tap(async user => {

        await localStorage.setItem('customer' , JSON.stringify(user.user));
        await localStorage.setItem('token' , JSON.stringify(user.token));
        this.onFormClose();
        this.router.navigateByUrl('/user/profile');
      })
    ).subscribe(noop, (error) => {
      console.log(error.error);
      this.toastr.error(error.error);
    });
  }
  // login() {
  //   const val = this.authF.value;
  //   this.appAuthService.login(val.mail, val.password).pipe(
  //     tap(user => {
  //       // console.log(user);
  //       //this.router.navigateByUrl('/courses');
  //     })
  //   ).subscribe(noop, () => {
  //     alert('User filed');
  //   });
  // }


}
