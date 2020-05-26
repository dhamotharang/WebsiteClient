import { NgModule } from '@angular/core';
import { NhSelectModule } from '../../shareds/components/nh-select/nh-select.module';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule, MatCheckboxModule, MatPaginatorModule, MatSlideToggleModule,
    MatTooltipModule
} from '@angular/material';
import { NhModalModule } from '../../shareds/components/nh-modal/nh-modal.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GhmPagingModule } from '../../shareds/components/ghm-paging/ghm-paging.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NHTreeModule } from '../../shareds/components/nh-tree/nh-tree.module';
import { NhImageModule } from '../../shareds/components/nh-image/nh-image.module';
import { GhmSelectPickerModule } from '../../shareds/components/ghm-select-picker/ghm-select-picker.module';
import { CoreModule } from '../../core/core.module';
import { LayoutModule } from '../../shareds/layouts/layout.module';
import { CustomerComponent } from './customer.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { NhDateModule } from '../../shareds/components/nh-datetime-picker/nh-date.module';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { ContactPersonComponent } from './contact-person/contact-person.component';
import { CustomerContactComponent } from './customer-contact/customer-contact.component';
import { GhmUserSuggestionModule } from '../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.module';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { DatetimeFormatModule } from '../../shareds/pipe/datetime-format/datetime-format.module';
import {FeedbackDetailComponent} from './feedback/feedback-detail/feedback-detail.component';
import {FeedbackComponent} from './feedback/feedback.component';
import {FeedbackService} from './feedback/feedback.service';
import { CommentComponent } from './comment/comment.component';
import { TreeTableModule } from 'primeng';

@NgModule({
    imports: [
        CommonModule, LayoutModule, CustomerRoutingModule, NhSelectModule, NhImageModule, DatetimeFormatModule,
        MatCheckboxModule, NhDateModule, TreeTableModule,
        NhModalModule, ReactiveFormsModule, FormsModule, MatTooltipModule, NHTreeModule, GhmUserSuggestionModule,
        GhmSelectPickerModule, CoreModule, GhmPagingModule, SweetAlert2Module.forRoot()
    ],
    exports: [CustomerComponent],
    declarations: [CustomerComponent, CustomerFormComponent,
        ContactPersonComponent, CustomerContactComponent, CustomerDetailComponent,
        FeedbackDetailComponent, FeedbackComponent, CommentComponent
    ],
    providers: [FeedbackService],
})
export class CustomerModule {
}
