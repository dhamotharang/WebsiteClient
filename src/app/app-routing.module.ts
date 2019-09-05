import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './shareds/services/auth-guard.service';
import {LayoutComponent} from './shareds/layouts/layout.component';
import {AppService} from './shareds/services/app.service';

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
            {path: 'config', loadChildren: './modules/configs/config.module#ConfigModule'},
            {path: 'error', loadChildren: './modules/error/error.module#ErrorModule'},
            {path: 'notifications', loadChildren: './modules/notifications/notification.module#NotificationModule'},
            {path: 'gallery', loadChildren: './modules/gallery/gallery.module#GalleryModule'},
            {path: 'folders', loadChildren: './modules/folders/folder.module#FolderModule'},
            {path: 'banners', loadChildren: './modules/banners/banner.module#BannerModule'},
            {path: 'news', loadChildren: './modules/news/news.module#NewsModule'},
            {
                path: 'products',
                loadChildren: './modules/product/product.module#ProductModule'},
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
