import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfficeComponent } from './office/office.component';
import { OfficeService } from './office/services/office.service';
import { TitleComponent } from './title/title.component';
import { TitleService } from './title/title.service';
import { PositionComponent } from './position/position.component';
import { PositionService } from './position/position.service';

export const routes: Routes = [
    {
        path: '', component: OfficeComponent,
        resolve: {
            data: OfficeService
        }
    },
    {
        path: 'offices', component: OfficeComponent,
        resolve: {
            data: OfficeService
        },
        children: [
            {path: 'detail', component: OfficeComponent},
            {path: 'edit', component: OfficeComponent},
        ]
    },
    {
        path: 'titles', component: TitleComponent,
        resolve: {
            data: TitleService
        }
    },
    {
        path: 'positions', component: PositionComponent,
        resolve: {
            data: PositionService
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [TitleService, PositionService, OfficeService]
})

export class OrganizationRoutingModule {
}
