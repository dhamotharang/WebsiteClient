import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserComponent} from './user.component';
import {UserService} from './services/user.service';
import {UserFormComponent} from './user-form/user-form.component';
import {UserDetailResolve} from './user-detail/user-detail.resolve';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {ManagerConfigComponent} from './manager-config/manager-config.component';

export const userRoutes: Routes = [
    {
        path: '',
        component: UserComponent,
        resolve: {
            data: UserService
        }
    },
    {
        path: 'add',
        component: UserFormComponent,
    },
    {
        path: 'detail/:id',
        component: UserDetailComponent,
        resolve: {detail: UserDetailResolve}
    },
    {
        path: 'edit/:id',
        component: UserFormComponent,
        resolve: {detail: UserDetailResolve}
    },
    {
        path: 'manager-config',
        component: ManagerConfigComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(userRoutes)],
    exports: [RouterModule],
    providers: [UserService, UserDetailResolve]
})

export class UserRoutingModule {
}
