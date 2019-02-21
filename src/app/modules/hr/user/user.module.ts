import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
    MatButtonModule, MatCheckboxModule, MatIconModule, MatPaginatorModule, MatSlideToggleModule,
    MatTooltipModule
} from '@angular/material';
import { UserListComponent } from './user-list/user-list.component';
import { UserRoutingModule } from './user-routing.module';
import { NhSelectModule } from '../../../shareds/components/nh-select/nh-select.module';
import { NhModalModule } from '../../../shareds/components/nh-modal/nh-modal.module';
import { GhmPagingModule } from '../../../shareds/components/ghm-paging/ghm-paging.module';
import { LayoutModule } from '../../../shareds/layouts/layout.module';
import { UserComponent } from './user.component';
import { NHTreeModule } from '../../../shareds/components/nh-tree/nh-tree.module';
import { NhImageModule } from '../../../shareds/components/nh-image/nh-image.module';
import { UserFormComponent } from './user-form/user-form.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { NhUploadModule } from '../../../shareds/components/nh-upload/nh-upload.module';
import { LaborContractComponent } from './labor-contract/labor-contract.component';
import { LaborContractListComponent } from './labor-contract/labor-contract-list.component';
import { InsuranceFormComponent } from './insurance/insurance-form.component';
import { InsuranceListComponent } from './insurance/insurance-list.component';
import { LaborContractFormComponent } from './labor-contract/labor-contract-form.component';
import { TrainingHistoryListComponent } from './training-history/training-history-list.component';
import { TrainingHistoryFormComponent } from './training-history/training-history-form.component';
import { EmploymentHistoryListComponent } from './employment_history/employment-list.component';
import { EmploymentHistoryFormComponent } from './employment_history/employment-form.component';
import { CommendationDisciplineListComponent } from './commendation-discipline/commendation-discipline-list.component';
import { CommendationDisciplineFormComponent } from './commendation-discipline/commendation-discipline-form.component';
import { RecordsManagementFormComponent } from './records-management/records-management-form.component';
import { AcademicLevelFormComponent } from './academic-level/academic-level-form.component';
import { AcademicLevelComponent } from './academic-level/academic-level.component';
import { NhDateModule } from '../../../shareds/components/nh-datetime-picker/nh-date.module';
import { DatetimeFormatModule } from '../../../shareds/pipe/datetime-format/datetime-format.module';
import { FormatNumberModule } from '../../../shareds/pipe/format-number/format-number.module';
import { NhSuggestionModule } from '../../../shareds/components/nh-suggestion/nh-suggestion.module';
import { UserDynamicHostDirective } from './user-dynamic-host.directive';
import { CoreModule } from '../../../core/core.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import {SearchUserContactPipe} from './pie/searchUserContact.pie';
import {UserContactComponent} from './user-contact/user-contact.component';
import {ManagerConfigModule} from './manager-config/manager-config.module';
import {DateTimeValidator} from '../../../validators/datetime.validator';

@NgModule({
    imports: [
        CommonModule, LayoutModule, UserRoutingModule, NhSelectModule, NHTreeModule, NhImageModule,
        MatCheckboxModule, MatPaginatorModule, MatButtonModule, MatSlideToggleModule, NhSuggestionModule,
        NhModalModule, ReactiveFormsModule, FormsModule, MatTooltipModule, MatIconModule,
        CoreModule, GhmPagingModule, NhUploadModule, NhDateModule, DatetimeFormatModule, FormatNumberModule, ManagerConfigModule,
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
        UserDynamicHostDirective,
        UserComponent,
        UserFormComponent,
        UserDetailComponent,
        UserListComponent,
        // Labor Contract
        LaborContractComponent, LaborContractListComponent, LaborContractFormComponent,
        // Insurance
        InsuranceListComponent, InsuranceFormComponent,
        // Training History
        TrainingHistoryListComponent, TrainingHistoryFormComponent,
        // Employment History
        EmploymentHistoryListComponent, EmploymentHistoryFormComponent,
        // Commendation
        CommendationDisciplineListComponent, CommendationDisciplineFormComponent,
        // Records
        RecordsManagementFormComponent,
        // Academic level
        AcademicLevelFormComponent, AcademicLevelComponent,
        SearchUserContactPipe,
        UserContactComponent
    ],
    entryComponents: [],
    providers: [DateTimeValidator]
})

export class UserModule {
}
