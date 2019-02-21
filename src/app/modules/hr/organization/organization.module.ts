import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationRoutingModule } from './organization-routing.module';
import { TitleComponent } from './title/title.component';
import { TitleFormComponent } from './title/title-form/title-form.component';
import { PositionComponent } from './position/position.component';
import { PositionFormComponent } from './position/position-form/position-form.component';
import { OfficeComponent } from './office/office.component';
import { OfficeFormComponent } from './office/office-form/office-form.component';
import { OfficeDetailComponent } from './office/office-detail/office-detail.component';
import { NhModalModule } from '../../../shareds/components/nh-modal/nh-modal.module';
import { GhmPagingModule } from '../../../shareds/components/ghm-paging/ghm-paging.module';
import { NhSelectModule } from '../../../shareds/components/nh-select/nh-select.module';
import { CoreModule } from '../../../core/core.module';
import { OfficeTitleComponent } from './office/office-title/office-title.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { MatCheckboxModule, MatSlideToggleModule, MatTooltipModule } from '@angular/material';
import { TinymceModule } from '../../../shareds/components/tinymce/tinymce.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NHTreeModule } from '../../../shareds/components/nh-tree/nh-tree.module';
import { NhSuggestionModule } from '../../../shareds/components/nh-suggestion/nh-suggestion.module';
import { GhmUserSuggestionModule } from '../../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.module';
import { OfficeContactComponent } from './office/office-contact/office-contact.component';
import { OfficeContactFormComponent } from './office/office-contact/office-contact-form.component';

@NgModule({
    imports: [OrganizationRoutingModule, CommonModule, NhModalModule, GhmPagingModule, NhSelectModule, CoreModule,
        MatCheckboxModule, TinymceModule, ReactiveFormsModule, FormsModule, MatTooltipModule, NHTreeModule, MatSlideToggleModule,
        NhSuggestionModule, GhmUserSuggestionModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn',
            confirmButtonText: 'Đồng ý',
            showCancelButton: true,
            cancelButtonText: 'Hủy bỏ'
        })],
    exports: [],
    declarations: [
        // Titles.
        TitleComponent, TitleFormComponent,
        // Positions.
        PositionComponent, PositionFormComponent,
        // Offices.
        OfficeComponent, OfficeFormComponent, OfficeDetailComponent, OfficeTitleComponent, OfficeContactComponent,
        OfficeContactFormComponent
    ],
    providers: [],
})
export class OrganizationModule {
}
