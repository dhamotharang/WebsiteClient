import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {JobComponent} from './jobs/job.component';
import {JobService} from './jobs/service/job.service';
import {PatientResourceComponent} from './patient-source/patient-resource.component';
import {PatientResourceService} from './patient-source/service/patient-resource.service';
import {PatientSubjectComponent} from './patient-subject/patient-subject.component';
import {PatientSubjectService} from './patient-subject/service/patient-subject.service';

export const userRoutes: Routes = [
    {
        path: 'jobs',
        component: JobComponent,
        resolve: {
            data: JobService
        }
    },
    {
        path: 'patient-source',
        component: PatientResourceComponent,
        resolve: {
            data: PatientResourceService
        }
    },
    {
        path: 'patient-subject',
        component: PatientSubjectComponent,
        resolve: {
            data: PatientSubjectService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(userRoutes)],
    exports: [RouterModule],
    providers: [JobService, PatientResourceService, PatientSubjectService]
})

export class CustomerConfigRoutingModule {
}
