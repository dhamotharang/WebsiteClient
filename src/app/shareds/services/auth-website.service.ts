import {Injectable} from '@angular/core';
import {User, UserManager} from 'oidc-client';
import {getClientSettings} from '../constants/auth-config.const';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';


@Injectable()
export class AuthWebsiteService {
    // Observable navItem source
    private _authNavStatusSource = new BehaviorSubject<boolean>(false);
    // Observable navItem stream
    authNavStatus$ = this._authNavStatusSource.asObservable();
    loggedIn = false;
    private _token: string;
    private manager;
    private user: User = null;

    constructor(private router: Router) {
        this.manager = new UserManager(getClientSettings());
        this.manager.getUser().then(user => {
            this.user = user;
            this._authNavStatusSource.next(this.isAuthenticated());
            this.loggedIn = true;
        });
    }

    completeAuthentication() {
        return this.manager.signinRedirectCallback().then((user) => {
            this.user = user;
            this.token = user.access_token;
            this.loggedIn = true;
            console.log('signed in', user);
        });
    }

    get token(): string {
        if (this._token) {
            return this._token;
        }
        return localStorage.getItem('_tw');
    }

    set token(val: string) {
        this._token = val;
        if (localStorage) {
            localStorage.setItem('_tw', val);
        }
    }

    login() {
         this.manager.signinRedirect();
    }

    isAuthenticated(): boolean {
        if (this.token) {
            return true;
        }
        return this.user != null && !this.user.expired;
    }

    getAuthorizationHeaderValue(): string {
        return `${this.user.token_type} ${this.user.access_token}`;
    }

    signOut() {
        localStorage.removeItem('_tw');
        this.manager.signoutRedirect().then(() => {
        });
    }

    startAuthentication(): Promise<void> {
        return this.manager.signinRedirect();
    }

    get authorizationHeaderValue(): string {
        return `${this.user.token_type} ${this.user.access_token}`;
    }

    get name(): string {
        return this.user != null ? this.user.profile.name : '';
    }
}
