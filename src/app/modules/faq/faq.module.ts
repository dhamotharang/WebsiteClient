import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FaqListComponent} from './faq-list/faq-list.component';
import {FaqFormComponent} from './faq-form/faq-form.component';
import {RouterModule, Routes} from '@angular/router';
import {FaqGroupFormComponent} from './faq-group-form/faq-group-form.component';
import {FaqService} from './service/faq.service';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {DxCheckBoxModule} from 'devextreme-angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NhModalModule} from '../../shareds/components/nh-modal/nh-modal.module';
import {GhmSelectModule} from '../../shareds/components/ghm-select/ghm-select.module';
import {GhmInputModule} from '../../shareds/components/ghm-input/ghm-input.module';
import {CoreValue} from '../configs/website/core-values/model/core-value.model';
import {CoreModule} from '../../core/core.module';
import {TinymceModule} from '../../shareds/components/tinymce/tinymce.module';
import {GhmFileExplorerModule} from '../../shareds/components/ghm-file-explorer/ghm-file-explorer.module';
import {NhSafeHtmlModeule} from '../../shareds/components/nh-safe-html/nh-safe-html.module';


export const routes: Routes = [
    {
        path: '',
        component: FaqListComponent,
        resolve: {
            data: FaqService
        }
    }
];

@NgModule({
    imports: [
        CommonModule, CoreModule, FormsModule, ReactiveFormsModule, NhModalModule, TinymceModule, NhSafeHtmlModeule,
        [RouterModule.forChild(routes)], DxCheckBoxModule, GhmSelectModule, GhmInputModule, GhmFileExplorerModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn',
            confirmButtonText: 'Đồng ý',
            showCancelButton: true,
            cancelButtonText: 'Hủy bỏ'
        })],
    declarations: [FaqListComponent, FaqFormComponent, FaqGroupFormComponent]
})

export class FaqModule {
}
