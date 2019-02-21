import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatCheckboxModule, MatIconModule} from '@angular/material';
import {ManagerConfigComponent} from './manager-config.component';
import {AuthGuardService} from '../../../../shareds/services/auth-guard.service';
import {NHTreeModule} from '../../../../shareds/components/nh-tree/nh-tree.module';
import {NhSelectModule} from '../../../../shareds/components/nh-select/nh-select.module';
import {NhSelectUserModule} from '../../../../shareds/components/nh-select-user/nh-select-user.module';
import {NhImageModule} from '../../../../shareds/components/nh-image/nh-image.module';
import {TinymceModule} from '../../../../shareds/components/tinymce/tinymce.module';
import {ManagerConfigService} from './manager-config.service';
import {GhmPagingModule} from '../../../../shareds/components/ghm-paging/ghm-paging.module';
import {GhmUserSuggestionModule} from '../../../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.module';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {CoreModule} from '../../../../core/core.module';
import {NhModalModule} from '../../../../shareds/components/nh-modal/nh-modal.module';

export const managerConfigRouter: Routes = [
    {path: '', component: ManagerConfigComponent, canActivate: [AuthGuardService]}
];

@NgModule({
    imports: [
        FormsModule, CommonModule, RouterModule.forChild(managerConfigRouter), MatButtonModule, MatCheckboxModule,
        NHTreeModule, NhSelectModule, NhSelectUserModule, NhImageModule, CoreModule, NhModalModule,
        MatButtonModule, MatIconModule, TinymceModule, GhmPagingModule, GhmUserSuggestionModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn',
            confirmButtonText: 'Đồng ý',
            showCancelButton: true,
            cancelButtonText: 'Hủy bỏ'
        }),
    ],
    declarations: [
        ManagerConfigComponent
    ],
    providers: [ManagerConfigService]
})

export class ManagerConfigModule {
}
