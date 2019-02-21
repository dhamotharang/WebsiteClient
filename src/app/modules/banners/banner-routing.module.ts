import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {BannerComponent} from './banner.component';
import {BannerService} from './service/banner.service';
import {BannerHistoryComponent} from './banner-history/banner-history.component';

const routes: Routes = [
    {
        path: '',
        component: BannerComponent,
        resolve: {
            data: BannerService
        },
    },
    {
        path: 'view-history/:id',
        component: BannerHistoryComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [BannerService]
})

export class BannerRoutingModule {
}
