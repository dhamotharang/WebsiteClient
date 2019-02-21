import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthCallbackComponent } from './callback/auth-callback.component';

const routes: Routes = [
    { path: '', component: AuthComponent },
    { path: 'auth-callback', component: AuthCallbackComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {
}
