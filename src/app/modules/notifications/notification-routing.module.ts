import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationComponent } from './notification.component';
import { NotificationService } from './notification.service';
import { LayoutComponent } from '../../shareds/layouts/layout.component';
import { AuthGuardService } from '../../shareds/services/auth-guard.service';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: '',
                component: NotificationComponent,
                resolve: {
                    data: NotificationService
                }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [NotificationService]
})

export class NotificationRoutingModule {
}
