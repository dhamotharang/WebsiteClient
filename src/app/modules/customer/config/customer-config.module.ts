import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatIconModule } from '@angular/material';
import { CoreModule } from '../../../core/core.module';
import { NhModalModule } from '../../../shareds/components/nh-modal/nh-modal.module';
import { NhSelectModule } from '../../../shareds/components/nh-select/nh-select.module';
import { NHTreeModule } from '../../../shareds/components/nh-tree/nh-tree.module';
import { GhmPagingModule } from '../../../shareds/components/ghm-paging/ghm-paging.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CustomerConfigRoutingModule } from './customer-config-routing.module';
import { JobComponent } from './jobs/job.component';
import { JobFormComponent } from './jobs/job-form/job-form.component';
import { PatientResourceComponent } from './patient-source/patient-resource.component';
import { PatientResourceFormComponent } from './patient-source/patient-resource-form/patient-resource-form.component';
import { PatientSubjectComponent } from './patient-subject/patient-subject.component';
import { PatientSubjectFormComponent } from './patient-subject/patient-subject-form/patient-subject-form.component';
import { TreeTableModule, SharedModule } from 'primeng/primeng';

@NgModule({
    imports: [
        FormsModule, CommonModule, CustomerConfigRoutingModule, MatButtonModule, MatCheckboxModule, TreeTableModule, SharedModule,
        NHTreeModule, NhSelectModule, ReactiveFormsModule, FormsModule, CoreModule, NhModalModule,
        MatButtonModule, MatIconModule, GhmPagingModule,
        SweetAlert2Module.forRoot(),
    ],
    declarations: [
        JobComponent, JobFormComponent, PatientResourceComponent, PatientResourceFormComponent,
        PatientSubjectComponent, PatientSubjectFormComponent
    ],
    providers: []
})

export class CustomerConfigModule {
}
