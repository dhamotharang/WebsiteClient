import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './shareds/services/auth-guard.service';
import {LayoutComponent} from './shareds/layouts/layout.component';
import {AppService} from './shareds/services/app.service';
import {AuthService} from './shareds/services/auth.service';
import {AuthWebsiteGuardService} from './shareds/services/auth-website-guard.service';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: './auth/auth.module#AuthModule'
    },
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            data: AppService
        },
        canActivate: [AuthGuardService],
        children: [
            // {path: '', redirectTo: 'organization/positions', pathMatch: 'full'},
            {path: 'config', loadChildren: './modules/configs/config.module#ConfigModule'},
            {path: 'organization', loadChildren: './modules/hr/organization/organization.module#OrganizationModule'},
            {path: 'users', loadChildren: './modules/hr/user/user.module#UserModule'},
            {
                path: 'config-customer',
                loadChildren: './modules/customer/config/customer-config.module#CustomerConfigModule'
            },
            {path: 'customers', loadChildren: './modules/customer/customer.module#CustomerModule'},
            {path: 'surveys', loadChildren: './modules/surveys/survey.module#SurveyModule'},
            // {path: 'offices', loadChildren: './modules/hr/office/office.module#OfficeModule'},
            {
                path: 'tasks',
                canActivate: [AuthGuardService],
                loadChildren: './modules/task/task.module#TaskModule'
            },
            {path: 'timekeeping', loadChildren: './modules/timekeeping/timekeeping.module#TimekeepingModule'},
            {path: 'error', loadChildren: './modules/error/error.module#ErrorModule'},
            {path: 'website', loadChildren: './modules/website/website.module#WebsiteModule'},
            {path: 'notifications', loadChildren: './modules/notifications/notification.module#NotificationModule'},
            {path: 'gallery', loadChildren: './modules/gallery/gallery.module#GalleryModule'},
            {path: 'folders', loadChildren: './modules/folders/folder.module#FolderModule'},
            {path: 'banners', loadChildren: './modules/banners/banner.module#BannerModule'},
            {path: 'news', loadChildren: './modules/news/news.module#NewsModule'},
            {
                path: 'products',
                canActivate: [AuthWebsiteGuardService],
                loadChildren: './modules/product/product.module#ProductModule'},
            {path: 'warehouses', loadChildren: './modules/warehouse/warehouse.module#WarehouseModule'},
            {path: 'event', loadChildren: './modules/event/event.module#EventModule'},
            {path: 'brand', loadChildren: './modules/brand/brand.module#BrandModule'},
        ]
    },
    {path: '', redirectTo: 'titles', pathMatch: 'full'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
