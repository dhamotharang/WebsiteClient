/**
 * Created by HoangIT21 on 7/10/2017.
 */
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../base.component';
import { Title } from '@angular/platform-browser';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { TimekeepingConfigService } from '../timekeeping-config.service';
import { TimekeepingWorkScheduleService } from './timekeeping-work-schedule.service';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { TreeData } from '../../../../view-model/tree-data';
import { ShiftReference, WorkSchedule } from './work-schedule.model';
import { ShiftGroup } from '../shift/shift-group.model';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { AppService } from '../../../../shareds/services/app.service';
import { Shift } from '../shift/timekeeping-shift.model';
import { finalize } from 'rxjs/operators';
import { CheckPermission } from '../../../../shareds/decorator/check-permission.decorator';
import { OfficeService } from '../../../hr/organization/office/services/office.service';

@Component({
    selector: 'app-timekeeping-work-schedule',
    templateUrl: './timekeeping-work-schedule.component.html',
    providers: [OfficeService, TimekeepingConfigService, TimekeepingWorkScheduleService]
})

export class TimekeepingWorkScheduleComponent extends BaseComponent implements OnInit {
    @ViewChild('configModal') configModal: NhModalComponent;
    monthSearch: number;
    yearSearch: number;
    officeTree: TreeData[] = [];
    listUsers = [];
    listUserWorkSchedules: WorkSchedule[] = [];
    listShiftGroups: ShiftGroup[] = [];
    isSearchingShiftGroups = false;
    officeId: number;
    isSelectAll = false;
    isEnableSelectShiftGroupForSelected = false;
    // shiftGroupReferenceMultiple: ShiftGroupReference[] = [];
    // selectedShiftGroup: ShiftGroupReference;
    selectedShiftGroupId: string;
    selectedShiftGroupName: string;
    selectedShifts: ShiftReference[] = [];

    listDays = [];
    listMonth = [];
    listYear = [];

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private title: Title,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private officeService: OfficeService,
                private spinnerService: SpinnerService,
                private timekeepingConfigService: TimekeepingConfigService,
                private timekeepingWorkScheduleService: TimekeepingWorkScheduleService,
                private appService: AppService) {
        super();
        this.title.setTitle('Lịch làm việc');
        this.appService.setupPage(pageId.HR, pageId.TIMEKEEPING_WORK_SCHEDULE, 'Chấm công', 'Lịch làm việc');
        // this.getPermission(this.appService);
        this.officeService.getTree().subscribe((result: any) => this.officeTree = result);

        this.subscribers.routeQueryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.officeId = params.officeId ? params.officeId : -1;
            this.currentPage = params.page ? params.page : 1;
            this.pageSize = params.pageSize ? params.pageSize : 20;

            this.search(this.currentPage);
        });

        for (let i = 0; i < 7; i++) {
            this.listDays.push({
                value: Math.pow(2, i),
                isSelected: false
            });
        }
    }

    ngOnInit() {
        this.searchShiftGroups();
    }

    onSelectOffice(office: TreeData) {
        this.officeId = office.id;
        this.search(1);
    }

    onSelectShiftGroup(shiftGroup: ShiftGroup, workSchedule: WorkSchedule) {
        if (shiftGroup.id != null) {
            const shiftReference: ShiftReference[] = shiftGroup.shifts.map((shift: Shift) => {
                return {
                    id: shift.id,
                    name: shift.name,
                    startTime: shift.startTime,
                    endTime: shift.endTime,
                    inLatency: shift.inLatency,
                    outLatency: shift.outLatency,
                    workUnit: shift.workUnit,
                    meaningTime: shift.meaningTime,
                    code: shift.code,
                    isOvertime: shift.isOvertime,
                    referenceId: shift.referenceId,
                    workingDaysValue: 0
                };
            });

            if (shiftGroup) {
                workSchedule.shiftGroupId = shiftGroup.id;
                workSchedule.shiftGroupName = shiftGroup.name;
                workSchedule.shifts = shiftReference;
            }
        } else {
            workSchedule.shiftGroupId = null;
            workSchedule.shiftGroupName = null;
            workSchedule.shifts = null;
        }
    }

    onSelectShiftGroupForMulti(shiftGroup: ShiftGroup) {
        this.selectedShiftGroupId = shiftGroup.id;
        this.selectedShiftGroupName = shiftGroup.name;
        this.selectedShifts = shiftGroup.shifts.map((shift: Shift) => {
            return {
                id: shift.id,
                name: shift.name,
                startTime: shift.startTime,
                endTime: shift.endTime,
                inLatency: shift.inLatency,
                outLatency: shift.outLatency,
                workUnit: shift.workUnit,
                meaningTime: shift.meaningTime,
                code: shift.code,
                isOvertime: shift.isOvertime,
                referenceId: shift.referenceId,
                workingDaysValue: 0
            };
        });
    }

    onChangeSelectAll() {
        this.isSelectAll = !this.isSelectAll;
        this.isEnableSelectShiftGroupForSelected = !this.isEnableSelectShiftGroupForSelected;
        _.each(this.listUserWorkSchedules, (workSchedule: WorkSchedule) => {
            workSchedule.isSelected = this.isSelectAll;
        });
    }

    onSelectedChange(workSchedule: WorkSchedule) {
        workSchedule.isSelected = !workSchedule.isSelected;
        const countSelected = _.countBy(this.listUserWorkSchedules, (item: WorkSchedule) => {
            return item.isSelected;
        }).true;

        this.isSelectAll = countSelected === this.listUserWorkSchedules.length;
        this.isEnableSelectShiftGroupForSelected = countSelected > 0;
    }

    onChangeWorkingDay(day: { value: number, isSelected: boolean }, shiftReference: ShiftReference) {
        if ((shiftReference.workingDaysValue & day.value) === day.value) {
            shiftReference.workingDaysValue -= day.value;
        } else {
            shiftReference.workingDaysValue += day.value;
        }
    }

    acceptAndSaveConfig() {
        this.configModal.dismiss();
        const selectedWorkSchedules = _.filter(this.listUserWorkSchedules, (workSchedule: WorkSchedule) => {
            return workSchedule.isSelected;
        });

        if (selectedWorkSchedules) {
            _.each(selectedWorkSchedules, (workSchedule: WorkSchedule) => {
                workSchedule.shiftGroupId = this.selectedShiftGroupId;
                workSchedule.shiftGroupName = this.selectedShiftGroupName;
                workSchedule.shifts = this.selectedShifts;
            });

            this.isSaving = true;
            this.timekeepingWorkScheduleService.saves(selectedWorkSchedules)
                .pipe(finalize(() => this.isSaving = false))
                .subscribe(result => {
                    this.toastr.success('Cập nhật thông tin lịch làm việc thành công.');
                });
        }
    }

    save(workSchedule: WorkSchedule) {
        this.spinnerService.show('Đang cập nhật thông lịch làm việc. Vui lòng đợi...');
        this.timekeepingWorkScheduleService.save(workSchedule)
            .pipe(finalize(() => this.spinnerService.hide()))
            .subscribe(result => {
                this.toastr.success('Cập nhật thông tin lịch làm việc thành công.');
            });
    }

    searchShiftGroups() {
        this.isSearchingShiftGroups = true;
        this.timekeepingConfigService.searchAllShiftGroupActive()
            .pipe(finalize(() => this.isSearchingShiftGroups = false))
            .subscribe((result: any) => this.listShiftGroups = result);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.timekeepingWorkScheduleService.search(this.keyword, this.officeId, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: any) => {
                this.listUserWorkSchedules = result.items;
                this.totalRows = result.totalRows;
            });
    }

    showConfigModal() {
        this.configModal.open();
    }

    hasChecked(value, valueCheck) {
        return (value & valueCheck) === valueCheck;
    }
}
