import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate, Router, RouterStateSnapshot
} from '@angular/router';
import {AuthService} from './auth.service';
import {AuthWebsiteService} from './auth-website.service';

@Injectable()
export class AuthWebsiteGuardService implements CanActivate {

    constructor(private router: Router,
                private authService: AuthService, private authWebsiteService: AuthWebsiteService ) {

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
        if (this.authWebsiteService.isAuthenticated()) {
            return true;
        } else {
            this.authWebsiteService.login();
            return false;
        }

    }


}
