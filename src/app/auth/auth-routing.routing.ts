import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth.component';
import {AuthCallbackComponent} from './callback/auth-callback.component';
import {LoginCoreComponent} from './login-core/login-core.component';
import {AuthService} from '../shareds/services/auth.service';

const routes: Routes = [
    {
        path: '',
        resolve: {
            data: AuthService
        }, component: AuthComponent
    },
    {path: 'core', component: LoginCoreComponent},
    {path: 'auth-callback', component: AuthCallbackComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {
}
