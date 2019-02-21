/**
 * Created by HoangIT21 on 7/4/2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatCheckboxModule, MatSlideToggleModule, MatTabsModule, MatButtonModule,
    MatTooltipModule, MatIconModule
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TimekeepingRoutingModule } from './timekeeping-routing.module';
import { TimekeepingConfigComponent } from './config/timekeeping-config.component';
import { TimekeepingConfigHolidayComponent } from './config/holiday/timekeeping-config-holiday.component';
import { TimekeepingMachineComponent } from './config/machine/timekeeping-machine.component';
import { TimekeepingConfigGeneralComponent } from './config/timekeeping-config-general.component';
import { TimekeepingConfigShiftComponent } from './config/shift/timekeeping-config-shift.component';
import { TimekeepingWorkScheduleComponent } from './config/work-schedule/timekeeping-work-schedule.component';
import { UploadUserDataComponent } from './connect/upload-user-data/upload-user-data.component';
import { SyncDataComponent } from './connect/sync-data/sync-data.component';
import { TimekeepingTimesheetComponent } from './time-sheet/timekeeping-timesheet.component';
import { TimekeepingOvertimeComponent } from './overtime-register/timekeeping-overtime.component';
import { TimekeepingGeneralComponent } from './config/general/timekeeping-general.component';
import { TimekeepingInOutComponent } from './in-out/timekeeping-in-out.component';
import { TimekeepingOvertimeRegisterComponent } from './overtime-register/timekeeping-overtime-register.component';
import { TimekeepingForgotCheckinComponent } from './forgot-checkin/timekeeping-forgot-checkin.component';
import { TimekeepingDayOffRegisterComponent } from './day-off/timekeeping-day-off-register.component';
import { TimekeepingInOutFrequentlyComponent } from './timekeeping-in-out-frequently/timekeeping-in-out-frequently.component';
import { LayoutModule } from '../../shareds/layouts/layout.module';
import { NhSelectModule } from '../../shareds/components/nh-select/nh-select.module';
import { NhTabModule } from '../../shareds/components/nh-tab/nh-tab.module';
import { NhModalModule } from '../../shareds/components/nh-modal/nh-modal.module';
import { NHTreeModule } from '../../shareds/components/nh-tree/nh-tree.module';
import { NhDateModule } from '../../shareds/components/nh-datetime-picker/nh-date.module';
import { NhSuggestionModule } from '../../shareds/components/nh-suggestion/nh-suggestion.module';
import { NhIconLoadingModule } from '../../shareds/components/nh-icon-loading/nh-icon-loading.module';
import { GhmUserSuggestionModule } from '../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.module';
import { NhInputHelperModule } from '../../shareds/components/nh-input-helper/nh-input-helper.module';
import { NhImageModule } from '../../shareds/components/nh-image/nh-image.module';
import { TimekeepingDayOffComponent } from './day-off/timekeeping-day-off.component';
import { DownloadUserDataComponent } from './connect/download-user-data/download-user-data.component';
import { GhmPagingModule } from '../../shareds/components/ghm-paging/ghm-paging.module';
import { DatetimeFormatModule } from '../../shareds/pipe/datetime-format/datetime-format.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
    imports: [
        CommonModule, TimekeepingRoutingModule, ReactiveFormsModule, FormsModule,
        LayoutModule, NhSelectModule, NhTabModule, NhModalModule, NHTreeModule, NhDateModule,
        NhSuggestionModule, NhIconLoadingModule, GhmUserSuggestionModule, NhInputHelperModule,
        NhDateModule, NhImageModule, CoreModule, GhmPagingModule, DatetimeFormatModule,
        // Materials
        MatCheckboxModule, MatSlideToggleModule, MatTabsModule, MatButtonModule, MatIconModule,
        MatTooltipModule
    ],
    declarations: [TimekeepingConfigComponent, TimekeepingConfigHolidayComponent, TimekeepingMachineComponent,
        TimekeepingConfigGeneralComponent, TimekeepingConfigShiftComponent, TimekeepingWorkScheduleComponent,
        TimekeepingDayOffComponent, DownloadUserDataComponent, UploadUserDataComponent, SyncDataComponent, TimekeepingTimesheetComponent,
        TimekeepingOvertimeComponent, TimekeepingOvertimeRegisterComponent, TimekeepingGeneralComponent, TimekeepingInOutComponent,
        TimekeepingForgotCheckinComponent, TimekeepingDayOffRegisterComponent, TimekeepingInOutFrequentlyComponent
    ],
    providers: []
})
export class TimekeepingModule {
}
