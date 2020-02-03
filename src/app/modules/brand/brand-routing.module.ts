import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {BrandService} from './services/brand.service';
import {BrandComponent} from './brand.component';
import {AgencyListComponent} from './agency/agency-list/agency-list.component';
import {AgencyService} from './agency/agency-service';

const routes: Routes = [
    {
        path: '',
        component: BrandComponent,
        resolve: {
            data: BrandService
        },
    },
    {
        path: 'agency',
        component: AgencyListComponent,
        resolve: {
            data: AgencyService
        },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [BrandService, AgencyService]
})

export class BrandRoutingModule {
}
