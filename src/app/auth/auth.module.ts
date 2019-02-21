import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.routing';
import { AuthComponent } from './auth.component';
import { AlertComponent } from './_directives/alert.component';
import { LogoutComponent } from './logout/logout.component';
import { AlertService } from './_services/alert.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthCallbackComponent } from './callback/auth-callback.component';
import { CoreModule } from '../core/core.module';

@NgModule({
    declarations: [
        AuthComponent,
        AlertComponent,
        LogoutComponent,
        AuthCallbackComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        AuthRoutingModule,
        CoreModule
    ],
    providers: [
        AlertService,
    ],
    entryComponents: [AlertComponent],
})

export class AuthModule {
}
