import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './shareds/services/auth-guard.service';
import {LayoutComponent} from './shareds/layouts/layout.component';
import {AppService} from './shareds/services/app.service';
import {CustomPreloadingStrategyService} from './shareds/services/custom-preloading-strategy.service';

const routes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            data: AppService
        },
        canActivate: [AuthGuardService],
        children: [
            {path: 'customers', loadChildren: () => import('./modules/customer/customer.module').then(m => m.CustomerModule)},
            {path: 'config', loadChildren: () => import('./modules/configs/config.module').then(m => m.ConfigModule)},
            {path: 'error', loadChildren: () => import('./modules/error/error.module').then(m => m.ErrorModule)},
            {path: 'notifications', loadChildren: () => import('./modules/notifications/notification.module').then(m => m.NotificationModule)},
            {path: 'gallery', loadChildren: () => import('./modules/gallery/gallery.module').then(m => m.GalleryModule)},
            {path: 'folders', loadChildren: () => import('./modules/folders/folder.module').then(m => m.FolderModule)},
            {path: 'banners', loadChildren: () => import('./modules/banners/banner.module').then(m => m.BannerModule)},
            {path: 'news', loadChildren: () => import('./modules/news/news.module').then(m => m.NewsModule)},
            {
                path: 'products',
                loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule)},
            {path: 'event', loadChildren: () => import('./modules/event/event.module').then(m => m.EventModule)},
            {path: 'brand', loadChildren: () => import('./modules/brand/brand.module').then(m => m.BrandModule)},
            {path: 'faq', loadChildren: () => import('./modules/faq/faq.module').then(m => m.FaqModule)},
            {path: 'order', loadChildren: () => import('./modules/order/order.module').then(m => m.OrderModule)},
        ]
    },
    {path: '', redirectTo: 'titles', pathMatch: 'full'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        preloadingStrategy: CustomPreloadingStrategyService
    })],
    exports: [RouterModule],
    providers: [CustomPreloadingStrategyService]
})
export class AppRoutingModule {
}
