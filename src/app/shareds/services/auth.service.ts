import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, of, Subject} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {APP_CONFIG, IAppConfig} from '../../configs/app.config';
import {Resolve, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../environments/environment';

export class SigninData {
    isLoggedIn: boolean;
    message: any;

    constructor(isLoggedIn: boolean, message: any) {
        this.isLoggedIn = isLoggedIn;
        this.message = message;
    }
}

@Injectable()
export class AuthService implements Resolve<any> {
    private user = null;
    private _token: string;
    private _refreshToken: string;
    private _isLoggedIn: boolean;

    authMessage$ = new Subject<string>();

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private router: Router,
                private toastr: ToastrService,
                private http: HttpClient) {
    }

    resolve() {
        if (this.isLoggedIn) {
            this.router.navigateByUrl('/');
            return true;
        }
    }

    get isLoggedIn(): boolean {
        if (this.token) {
            return true;
        }
        return this._isLoggedIn;
    }

    set isLoggedIn(val: boolean) {
        this._isLoggedIn = val;
    }

    get token(): string {
        if (this._token) {
            return this._token;
        }
        return localStorage.getItem('_t');
    }

    set token(val: string) {
        this._token = val;
        if (localStorage) {
            localStorage.setItem('_t', val);
        }
    }

    get refreshToken() {
        if (this._refreshToken) {
            return this._refreshToken;
        }
        return localStorage.getItem('_rt');
    }

    set refreshToken(val) {
        this._refreshToken = val;
        if (localStorage) {
            localStorage.setItem('_rt', val);
        }
    }

    login(userName: string, password: string) {
        if (this.isLoggedIn) {
            return of(new SigninData(true, 'Đã đăng nhập'));
        }
        const body = `grant_type=password&userName=${userName}&password=${password}
            &client_id=${this.appConfig.CLIENT_ID}&scope=${this.appConfig.SCOPES}`;
        return this.http.post(`${environment.apiGatewayUrl}auth/connect/token`, body, {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }).pipe(map((result: any) => {
            this.isLoggedIn = true;
            this.token = result.access_token;
            this.refreshToken = result.refresh_token;
            return new SigninData(true, 'Đăng nhập thành công.');
        }), catchError((response: HttpErrorResponse) => {
            const error = response.error;
            if (error.error === 'invalid_grant' && error.error_description) {
                this.authMessage$.next(error.error_description);
            }
            this.resetAuthService();
            return of(new SigninData(false, response.error));
        })) as Observable<SigninData>;
    }

    getRefreshToken() {
        const body = `grant_type=refresh_token&client_id=${this.appConfig.CLIENT_ID}&refresh_token=${this.refreshToken}`;
        return this.http.post(`${environment.apiGatewayUrl}auth/connect/token`, body, {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }).pipe(map((result: any) => {
            if (result) {
                this.token = result.access_token;
                this.refreshToken = result.refresh_token;
                this.isLoggedIn = true;
                return this.token;
            }
            return null;
        })) as Observable<string>;
    }

    resetAuthService() {
        this.token = '';
        this.refreshToken = '';
        this.isLoggedIn = false;
        if (localStorage) {
            localStorage.clear();
        }
    }

    signOut() {
        this.resetAuthService();
        this.router.navigateByUrl('/login');
    }

    forgotPassword(email: string) {
        return this.http.post(this.appConfig.CORE_API_URL + 'account/forgot-password', {
            email: email
        });
    }
}
