import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { ErrorPermissionComponent } from './error-permission.component';

const routes: Routes = [
    {
        path: 'not-found',
        component: NotFoundComponent
    },
    {
        path: 'permission',
        component: ErrorPermissionComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class ErrorRoutingModule {
}
