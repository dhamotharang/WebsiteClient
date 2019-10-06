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
        CommonModule, FormsModule, ReactiveFormsModule, [RouterModule.forChild(routes)], DxCheckBoxModule,
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
