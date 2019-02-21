import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimekeepingConfigComponent } from './config/timekeeping-config.component';
import { TimekeepingWorkScheduleComponent } from './config/work-schedule/timekeeping-work-schedule.component';
import { TimekeepingDayOffComponent } from './day-off/timekeeping-day-off.component';
import { DownloadUserDataComponent } from './connect/download-user-data/download-user-data.component';
import { UploadUserDataComponent } from './connect/upload-user-data/upload-user-data.component';
import { SyncDataComponent } from './connect/sync-data/sync-data.component';
import { TimekeepingTimesheetComponent } from './time-sheet/timekeeping-timesheet.component';
import { TimekeepingOvertimeComponent } from './overtime-register/timekeeping-overtime.component';
import { TimekeepingInOutComponent } from './in-out/timekeeping-in-out.component';
import { TimekeepingForgotCheckinComponent } from './forgot-checkin/timekeeping-forgot-checkin.component';
import { TimekeepingInOutFrequentlyComponent } from './timekeeping-in-out-frequently/timekeeping-in-out-frequently.component';
import { InOutFrequentlyService } from './timekeeping-in-out-frequently/in-out-frequently.service';
import { LayoutComponent } from '../../shareds/layouts/layout.component';
import { AuthGuardService } from '../../shareds/services/auth-guard.service';
import { TimekeepingDayOffService } from './day-off/timekeeping-dayoff.service';
import { TimekeepingWorkScheduleService } from './config/work-schedule/timekeeping-work-schedule.service';
import { TimekeepingOvertimeService } from './overtime-register/timekeeping-overtime.service';
import { TimekeepingInOutService } from './in-out/timekeeping-in-out.service';
import { TimekeepingForgotCheckinService } from './forgot-checkin/timekeeping-forgot-checkin.service';

export const timekeepingRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuardService],
        children: [
            {
                path: '',
                component: TimekeepingConfigComponent
            },
            {
                path: 'config',
                component: TimekeepingConfigComponent
            },
            {
                path: 'work-schedule',
                component: TimekeepingWorkScheduleComponent
            },
            {
                path: 'work-schedule',
                canActivate: [AuthGuardService],
                resolve: {
                    data: TimekeepingWorkScheduleService
                },
                component: TimekeepingWorkScheduleComponent,
            },
            {
                path: 'day-off',
                resolve: {
                    data: TimekeepingDayOffService
                },
                component: TimekeepingDayOffComponent,
            },
            {
                path: 'download-user-data',
                component: DownloadUserDataComponent,
            },
            {
                path: 'upload-user-data',
                component: UploadUserDataComponent,
            },
            {
                path: 'sync-data',
                component: SyncDataComponent,
            },
            {
                path: 'time-sheet',
                component: TimekeepingTimesheetComponent
            },
            {
                path: 'overtime',
                resolve: {
                    data: TimekeepingOvertimeService
                },
                component: TimekeepingOvertimeComponent
            },
            {
                path: 'in-out',
                resolve: {
                    data: TimekeepingInOutService
                },
                component: TimekeepingInOutComponent
            },
            {
                path: 'in-out-frequently',
                resolve: {
                    data: InOutFrequentlyService
                },
                component: TimekeepingInOutFrequentlyComponent
            },
            {
                path: 'forgot-checkin',
                resolve: {
                    data: TimekeepingForgotCheckinService
                },
                component: TimekeepingForgotCheckinComponent
            }
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(timekeepingRoutes)],
    exports: [RouterModule],
    providers: [TimekeepingDayOffService, TimekeepingInOutService, TimekeepingWorkScheduleService,
        TimekeepingOvertimeService, TimekeepingForgotCheckinService, InOutFrequentlyService]
})

export class TimekeepingRoutingModule {
}
