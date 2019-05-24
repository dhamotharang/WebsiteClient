import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate, Router, RouterStateSnapshot
} from '@angular/router';
import {AuthService} from './auth.service';
import {OAuthService} from 'angular-oauth2-oidc';

@Injectable()
export class AuthWebsiteGuardService implements CanActivate {
    constructor(private router: Router,
                private authService: AuthService, private oauthService: OAuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url = state.url;
        const isLoggedIn = this.checkConnectWarehouse(url);
        return isLoggedIn;
    }

    checkLogin(url: string): boolean {
        if (this.authService.isLoggedIn) {
            return true;
        }
        this.router.navigate([`/login`], {queryParams: {redirect: url}});
        return false;
    }

    checkConnectWarehouse(url: string): boolean {
        if (this.oauthService.hasValidAccessToken()) {
            return true;
        }
        this.router.navigate(['/login'], { queryParams: { redirect: url } });
        return false;
    }
}
