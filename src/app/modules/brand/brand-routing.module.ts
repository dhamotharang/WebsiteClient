import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {BrandService} from './services/brand.service';
import {BrandComponent} from './brand.component';

const routes: Routes = [
    {
        path: '',
        component: BrandComponent,
        resolve: {
            data: BrandService
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [BrandService]
})

export class BrandRoutingModule {
}