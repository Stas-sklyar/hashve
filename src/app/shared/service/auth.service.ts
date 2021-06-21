import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../business/model/user.model';
import { CustomerService } from './customer-service.service';
import { Observable } from 'rxjs';
import { AppService } from '../../app.service';

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {

  public user: User;
  public token: string;

  constructor(private http: HttpClient, private appService: AppService, customerService: CustomerService) {
  }

  registration(_user) {
    return this.http.post(environment.apihost + '/api/v1/content/registration', _user);
  }
  customerRegistration(_user) {
    return this.http.post(environment.apihost + '/api/v1/customer', _user);
  }

  login(login, passwoord):Observable<any> {
    return this.http.post(environment.apihost + '/api/v2/user/login', { email: login, password: passwoord });
  }

  socialLogin(provider: string, authToken: string) {
    const url = `${environment.apihost}/api/v1/content/social-login/${provider.toLowerCase()}`;
    return this.http.post(url, {}, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        access_token: `${authToken}`
      },
      //withCredentials: true
    })
  }

  getToken(): string {
    return  JSON.parse(localStorage.getItem('token'))
  }

  isLoggedIn() {
    const token = this.getToken();
    return token != null;
  }
  onRegistrationFormOpen(type) {
    if (type === 'auth') {
      this.appService.onAuthFormOpen.next(true); 
    } else {
      this.appService.onRegistrationFormOpen.next(true);
    }
  }
}
