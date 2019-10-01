import {Injectable, Inject, Injector} from '@angular/core';
import {
    HttpErrorResponse, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, flatMap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {APP_CONFIG, IAppConfig} from '../../configs/app.config';
import {AuthService} from './auth.service';
import {ToastrService} from 'ngx-toastr';
import {AuthWebsiteService} from './auth-website.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private injector: Injector,
                private router: Router,
                private toastr: ToastrService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const contentType = req.headers.get('Content-Type');
        const authService = this.injector.get(AuthService);
        let apiReq: any;
        if (req.headers.get('useAuth') === this.appConfig.USE_AUTH) {
            const authWebsiteService = this.injector.get(AuthWebsiteService);
            apiReq = req.clone({
                headers: new HttpHeaders()
                    .set('Access-Control-Allow-Origin', '*')
                    .set('Accept', 'application/json')
                    .set('Accept-Language', 'vi-VN')
                    .set('Authorization', `bearer ${authWebsiteService.token}`)
            });

            if (apiReq.headers.get('Content-Type') === 'clear') {
                apiReq.headers.delete('Content-Type', 'clear');
            }
            return next.handle(apiReq).pipe(
                catchError(response => {
                    if (response instanceof HttpErrorResponse) {
                        if (response.status === 401) {
                            authWebsiteService.signOut();
                            return throwError(`Can't fresh token. ReLogin please.`);
                        }
                        return this.handlingError(response, authService);
                    }

                    return throwError('Something went wrong!');
                }));
        } else {
            if (contentType === 'clear') {
                apiReq = req.clone({
                    headers: new HttpHeaders()
                        .set('Access-Control-Allow-Origin', '*')
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'vi-VN')
                        .set('Authorization', `bearer ${authService.token}`)
                });
            } else {
                apiReq = req.clone({
                    headers: req.headers.set('Access-Control-Allow-Origin', '*')
                        .set('Content-Type', contentType ? contentType : 'application/json')
                        .set('Accept', 'application/json')
                        .set('Accept-Language', 'vi-VN')
                        .set('Authorization', `bearer ${authService.token}`)
                });
            }


            if (apiReq.headers.get('Content-Type') === 'clear') {
                apiReq.headers.delete('Content-Type', 'clear');
            }
            return next.handle(apiReq)
                .pipe(
                    catchError(response => {
                        if (response instanceof HttpErrorResponse) {
                            if (response.status === 401) {
                                return authService
                                    .getRefreshToken()
                                    .pipe(flatMap(result => {
                                        if (result) {
                                            const reqRefreshAuth = apiReq.clone({
                                                headers: req.headers.set('Authorization', `bearer ${result}`)
                                            });
                                            return next.handle(reqRefreshAuth)
                                                .pipe(catchError(refreshTokenResponse => {
                                                    if (refreshTokenResponse instanceof HttpErrorResponse) {
                                                        this.handlingError(refreshTokenResponse, authService);
                                                    }
                                                    authService.signOut();
                                                    return of(null);
                                                }));
                                        } else {
                                            authService.signOut();
                                            return throwError(`Can't fresh token. ReLogin please.`);
                                        }
                                    }), catchError((errorResponse: HttpErrorResponse) => {
                                        this.handlingError(errorResponse, authService);
                                        return throwError(`Can't fresh token. ReLogin please.`);
                                    }));
                            }
                            return this.handlingError(response, authService);
                        }

                        return throwError('Something went wrong!');
                    }));
        }

    }

    private handlingError(response: HttpErrorResponse, authService: AuthService): Observable<HttpErrorResponse> {
        switch (response.status) {
            case 403:
                this.router.navigate(['/error/permission']);
                break;
            case 400:
                try {
                    const error = response.error;
                    if (error.code != null && typeof error.code !== 'undefined') {
                        this.toastr.error(error.message, error.title);
                        return throwError(error);
                    } else if (error.error) {
                        if (error.error === 'invalid_client') {
                            authService.signOut();
                            this.toastr.error('Client invalid please contact with administrator.');
                        } else if (error.error === 'invalid_grant') {
                            authService.signOut();
                        } else if (error.error_description && error.error_description !== 'account_does_not_exists') {
                            authService.signOut();
                            this.toastr.error(error.error_description);
                        } else if (error.error_description === 'account_does_not_exists') {
                            this.toastr.error('Tài khoản không tồn tại. Vui lòng kiểm tra lại.');
                        }
                    } else {
                        for (const key in error) {
                            if (error.hasOwnProperty(key)) {
                                const values = error[key];
                                values.forEach((value) => {
                                    this.toastr.error(value);
                                });
                            }
                        }
                    }
                } catch (ex) {
                    // this.toastr.warning('Có gì đó hoạt động chưa đúng. Vui lòng liên hệ với quản trị viên.', 'Thông báo');
                    return throwError(response);
                }
                break;
            case 404:
                // if (response.status === 404) {
                //     this.router.navigate(['/error/not-found']);
                // }
                break;
            case 500:
                this.toastr.error('Something went wrong. Please contact with administrator.');
                break;
        }
        return throwError(response);
    }

    private handlingWebsiteError(response: HttpErrorResponse, authService: AuthWebsiteService): Observable<HttpErrorResponse> {
        switch (response.status) {
            case 403:
                this.router.navigate(['/error/permission']);
                break;
            case 400:
                try {
                    const error = response.error;
                    if (error.code != null && typeof error.code !== 'undefined') {
                        this.toastr.error(error.message, error.title);
                        return throwError(error);
                    } else if (error.error) {
                        if (error.error === 'invalid_client') {
                            authService.signOut();
                            this.toastr.error('Client invalid please contact with administrator.');
                        } else if (error.error === 'invalid_grant') {
                            authService.signOut();
                        } else if (error.error_description && error.error_description !== 'account_does_not_exists') {
                            authService.signOut();
                            this.toastr.error(error.error_description);
                        } else if (error.error_description === 'account_does_not_exists') {
                            this.toastr.error('Tài khoản không tồn tại. Vui lòng kiểm tra lại.');
                        }
                    } else {
                        for (const key in error) {
                            if (error.hasOwnProperty(key)) {
                                const values = error[key];
                                values.forEach((value) => {
                                    this.toastr.error(value);
                                });
                            }
                        }
                    }
                } catch (ex) {
                    // this.toastr.warning('Có gì đó hoạt động chưa đúng. Vui lòng liên hệ với quản trị viên.', 'Thông báo');
                    return throwError(response);
                }
                break;
            case 404:
                // if (response.status === 404) {
                //     this.router.navigate(['/error/not-found']);
                // }
                break;
            case 500:
                this.toastr.error('Something went wrong. Please contact with administrator.');
                break;
        }
        return throwError(response);
    }

}
