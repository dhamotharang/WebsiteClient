import {RouterModule, Routes} from '@angular/router';
import {FolderComponent} from './folder.component';
import {FolderService} from './service/folder.service';
import {NgModule} from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: FolderComponent,
        resolve: {
            data: FolderService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [FolderService]
})
export class FolderRoutingModule {

}
