import { Injectable, Injector } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';

import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppAuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private authService: AppAuthService;
    constructor(private injector: Injector) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.authService = this.injector.get(AppAuthService);
        const token: string = this.authService.getToken();
        if (token) {
            request = request.clone({
                setHeaders: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
        }
        return next.handle(request);
    }

}
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private authService: AppAuthService;
    constructor(private router: Router, private injector: Injector) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.authService = this.injector.get(AppAuthService);

        // return next.handle(request)
        //     .catch((response: any) => {
        //         if (response instanceof HttpErrorResponse && response.status === 401) {
        //             console.log(response);
        //             localStorage.removeItem('token');
        //             localStorage.removeItem('user');
        //             this.router.navigateByUrl('/login');
        //         }
        //         return throwError(response);

        //     }); fixedddddd

            return next.handle(request).pipe(catchError(response => {
              if (response instanceof HttpErrorResponse && response.status === 401) {

                localStorage.removeItem('token');
                localStorage.removeItem('customer');
                this.router.navigateByUrl('/');
                this.authService.onRegistrationFormOpen('auth')
             }
            return throwError(response);
          }))
    }
}
