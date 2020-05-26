import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from './shareds/services/script-loader.service';
import { AuthModule } from './auth/auth.module';
import { APP_CONFIG, APP_CONFIG_DI } from './configs/app.config';
import { CoreModule } from './core/core.module';
import { PAGE_ID, PAGE_ID_DI } from './configs/page-id.config';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from './shareds/services/auth.service';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { InterceptorService } from './shareds/services/interceptor.service';
import { AuthGuardService } from './shareds/services/auth-guard.service';
import { UtilService } from './shareds/services/util.service';
import { LayoutModule } from './shareds/layouts/layout.module';
import { registerLocaleData } from '@angular/common';
import { APP_SERVICE, AppService } from './shareds/services/app.service';

// Locale.
import localeVI from '@angular/common/locales/fr';
import localeVIExtra from '@angular/common/locales/extra/vi';
import { SpinnerService } from './core/spinner/spinner.service';
import { SpinnerComponent } from './core/spinner/spinner.component';
import { setAppInjector } from './shareds/helpers/app-injector';
import { NotificationService } from './shareds/services/notification.service';
import {AuthWebsiteGuardService} from './shareds/services/auth-website-guard.service';
import {AuthWebsiteService} from './shareds/services/auth-website.service';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';

registerLocaleData(localeVI, 'vi-VN', localeVIExtra);

// export function appServiceFactory(appService: AppService, authService: AuthService): Function {
//     return () => {
//         if (authService.isLoggedIn) {
//             appService.initApp();
//         }
//     };
// }

@NgModule({
    declarations: [
        AppComponent,
        SpinnerComponent,
    ],
    imports: [
        LayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        AuthModule,
        CoreModule,
        ToastrModule.forRoot(),
        SweetAlert2Module.forRoot()
    ],
    providers: [
        ScriptLoaderService, ToastrService, AuthService, AuthGuardService, UtilService, HttpClient,
        AppService, SpinnerService, NotificationService, AuthWebsiteGuardService, AuthWebsiteService,
        // {provide: APP_INITIALIZER, useFactory: appServiceFactory, deps: [AppService, Title], multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
        {provide: APP_CONFIG, useValue: APP_CONFIG_DI},
        {provide: PAGE_ID, useValue: PAGE_ID_DI},
        {provide: 'APP_SERVICE', useValue: AppService},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(injector: Injector) {
        setAppInjector(injector);
    }
}
