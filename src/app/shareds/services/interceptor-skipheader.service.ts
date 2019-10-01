import {HttpErrorResponse, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {Inject, Injectable, Injector} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../configs/app.config';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {catchError, flatMap} from 'rxjs/operators';
import {AuthWebsiteService} from './auth-website.service';


@Injectable()
export class SkippableInterceptor implements HttpInterceptor {
    interceptorSkipHeader;

    constructor(@Inject(APP_CONFIG) private appConfigInterceptorSkipHeader: IAppConfig,
                private injector: Injector,
                private router: Router,
                private toastr: ToastrService) {

    }

    set setInterceptorSkipHeader(value: any) {
        this.interceptorSkipHeader = value;
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (req.headers.has(this.interceptorSkipHeader)) {
            req.headers.delete(this.interceptorSkipHeader);
            const authService = this.injector.get(AuthWebsiteService);
            let apiReq: any;
            apiReq = req.clone({
                headers: new HttpHeaders()
                    .set('Access-Control-Allow-Origin', '*')
                    .set('Accept', 'application/json')
                    .set('Accept-Language', 'vi-VN')
                    .set('Authorization', `bearer ${authService.token}`)
            });

            if (apiReq.headers.get('Content-Type') === 'clear') {
                apiReq.headers.delete('Content-Type', 'clear');
            }

            return next.handle(apiReq);
        }

    }

    private handlingError(response: HttpErrorResponse, authService: AuthWebsiteService): Observable<HttpErrorResponse> {
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
