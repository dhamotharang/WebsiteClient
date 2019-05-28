import {Injectable} from '@angular/core';
import {User, UserManager} from 'oidc-client';
import {OAuthService} from 'angular-oauth2-oidc';
import {getClientSettings} from '../constants/auth-config.const';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';


@Injectable()
export class AuthWebsiteService {
    // Observable navItem source
    private _authNavStatusSource = new BehaviorSubject<boolean>(false);
    // Observable navItem stream
    authNavStatus$ = this._authNavStatusSource.asObservable();

    private manager;
    private user: User = null;

    constructor(private route: Router) {
        this.manager = new UserManager(getClientSettings());
        this.manager.getUser().then(user => {
            this.user = user;
            this._authNavStatusSource.next(this.isAuthenticated());
        });
    }
    completeAuthentication()  {
        return this.manager.signinRedirectCallback().then(user => {
            this.user = user;
        });
    }
    get token(): string {
        return this.user.access_token;
    }


    login() {
        return this.manager.signinRedirect();
    }
    isAuthenticated(): boolean {
        return this.user != null && !this.user.expired;
    }

    getAuthorizationHeaderValue(): string {
        return `${this.user.token_type} ${this.user.access_token}`;
    }
    signOut() {
        this.manager.signoutRedirect();
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
