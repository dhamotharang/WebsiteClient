import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WarehouseComponent} from './warehouse/warehouse.component';
import {WarehouseService} from './warehouse/service/warehouse.service';
import {WarehouseFormComponent} from './warehouse/warehouse-form/warehouse-form.component';
import {WarehouseDetailComponent} from './warehouse/warehouse-detail/warehouse-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: WarehouseComponent,
        resolve: {
            data: WarehouseService
        }
    }, {
        path: 'add',
        component: WarehouseFormComponent
    },
    {
        path: 'edit/:id',
        component: WarehouseFormComponent
    },
    {
        path: 'detail/:id',
        component: WarehouseDetailComponent
    },
    // {
    //     path: 'configs',
    //     component: WarehouseConfigComponent
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [WarehouseService]
})

export class WarehouseRoutingModule {
}
