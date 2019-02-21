import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate, Router, RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private router: Router,
        private authService: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url = state.url;
        const isLoggedIn = this.checkLogin(url);
        return isLoggedIn;
    }

    checkLogin(url: string): boolean {
        if (this.authService.isLoggedIn) {
            return true;
        }
        this.router.navigate([`/login`], { queryParams: { redirect: url } });
        return false;
    }
}
