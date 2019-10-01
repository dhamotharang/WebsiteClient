import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
    Router,
    Event as RouterEvent,
    NavigationStart,
    NavigationEnd,
    NavigationCancel,
    NavigationError, ActivatedRoute
} from '@angular/router';
import { IAppConfig } from './interfaces/iapp-config';
import { SpinnerService } from './core/spinner/spinner.service';
import { APP_CONFIG } from './configs/app.config';
import { PageService } from './modules/configs/page/page.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from './shareds/services/auth.service';
import { NotificationService } from './shareds/services/notification.service';
import {JwksValidationHandler, OAuthService} from 'angular-oauth2-oidc';
import {authConfig} from './shareds/constants/auth-config.const';

@Component({
    selector: 'body',
    templateUrl: './app.component.html',
    providers: [PageService]
})

export class AppComponent implements OnInit, OnDestroy {
    @ViewChild('appTabList') appTabListRef: ElementRef;
    @ViewChild('appTabListContainer') appTabListContainerRef: ElementRef;
    subscribers: any = {};
    offsetLeft: number;

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                private sanitizer: DomSanitizer,
                private router: Router,
                private route: ActivatedRoute,
                private notificationService: NotificationService,
                private authService: AuthService,
                private spinnerService: SpinnerService) {
        this.subscribers.router = this.router.events.subscribe(e => this.navigationInterceptor(e));;
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscribers.router.unsubscribe();
        this.subscribers.routeData.unsubscribe();
    }

    // Shows and hides the loading spinner during RouterEvent changes
    navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            this.spinnerService.show();
        }
        if (event instanceof NavigationEnd) {
            this.spinnerService.hide();
        }
        if (event instanceof NavigationCancel) {
            this.spinnerService.hide();
        }
        if (event instanceof NavigationError) {
            this.spinnerService.hide();
        }
    }
}
