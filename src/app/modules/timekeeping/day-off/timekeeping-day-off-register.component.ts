/**
 * Created by HoangIT21 on 7/20/2017.
 */
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Moment } from 'moment';
import { TimekeepingDayOffService } from './timekeeping-dayoff.service';
import { TimekeepingHolidayService } from '../config/holiday/timekeeping-holiday.service';
import { NhModalComponent } from '../../../shareds/components/nh-modal/nh-modal.component';
import { DayOff, DayOffDate, IDateDisplay, IDayOffShiftDisplay } from './day-off.model';
import { UtilService } from '../../../shareds/services/util.service';
import { TimekeepingWorkScheduleService } from '../config/work-schedule/timekeeping-work-schedule.service';
import { Holiday } from '../config/holiday/holiday.model';
import { finalize } from 'rxjs/operators';
import { BaseFormComponent } from '../../../base-form.component';

@Component({
    selector: 'app-timekeeping-day-off-register',
    templateUrl: './timekeeping-day-off-register.component.html',
    providers: [TimekeepingDayOffService, TimekeepingHolidayService]
})

export class TimekeepingDayOffRegisterComponent extends BaseFormComponent implements OnInit {
    @ViewChild('dayOffRegisterModal') dayOffRegisterModal: NhModalComponent;
    @Output() onSaveSuccess = new EventEmitter();
    listMethod: any = [];
    listShortMethod: any = [];
    listStats: any = [];
    listHolidays = [];
    dayOff = new DayOff();
    dayOffDate = new DayOffDate();
    formModel: FormGroup;
    errorMessage = '';
    listShifts = [];
    listDates: IDateDisplay[] = [];
    warningMessage = '';
    isLockForm = false;

    // Stats
    totalAnnualLeave;
    totalUnpaidLeave;
    totalInsuranceLeave;
    totalCompensatory;
    totalEntitlement;

    METHODS = {
        ANNUAL_LEAVE: 0,
        UNPAID_LEAVE: 1,
        COMPENSATORY_LEAVE: 2,
        INSURANCE_LEAVE: 3,
        ENTITLEMENT: 4,
        WEEK_LEAVE: 5,
        HOLIDAY_LEAVE: 6
    };

    MOMENT_DAY_OF_WEEK = {
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6
    };

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private dayOffService: TimekeepingDayOffService,
                public utilService: UtilService,
                private workScheduleService: TimekeepingWorkScheduleService,
                private holidayService: TimekeepingHolidayService) {
        super();
        // this.currentUser = this.appService.currentUser;

        this.listMethod = [
            {id: 0, name: 'Nghỉ phép (NP)'},
            {id: 1, name: 'Nghỉ không lương (NKL)'},
            {id: 2, name: 'Nghỉ bù (NB)'},
            {id: 3, name: 'Nghỉ bào hiểm (NBH)'},
            {id: 4, name: 'Nghỉ chế độ (NCĐ)'}
        ];

        this.listShortMethod = [
            {id: 0, name: 'NP'},
            {id: 1, name: 'NKL'},
            {id: 2, name: 'NB'},
            {id: 3, name: 'NBH'},
            {id: 4, name: 'NCĐ'}
        ];

        this.formErrors = this.utilService.renderFormError(['fromDate', 'reason']);
        this.validationMessages = {
            'fromDate': {
                'required': 'Vui lòng chọn nghỉ từ ngày'
            },
            'reason': {
                'required': 'Vui lòng nhập lý do nghỉ',
                'maxLength': 'Lý do nghỉ không được phép vượt quá 500 ký tự.'
            }
        };
    }

    ngOnInit() {
        this.buildForm();
        this.subscribers.onDayOffRegisterShow = this.dayOffRegisterModal.onShown.subscribe(() => {
            this.workScheduleService.getMyWorkSchedule()
                // .pipe(finalize(() => this.isSearching = false))
                .subscribe((result: any) => {
                    this.isLockForm = false;
                    this.warningMessage = '';
                    this.listShifts = result.shifts;
                }, (errorResult: any) => {
                    this.isLockForm = true;
                    this.warningMessage = errorResult.error.message;
                });
        });

        this.subscribers.getListHolidays = this.holidayService.getYearHolidays()
            .subscribe((result: any) => {
                this.listHolidays = result;
            });
    }

    onSelectFromDate(date) {
        this.calculateListDate();
    }

    onSelectToDate(date) {
        this.calculateListDate();
    }

    onSelectMethod(method) {
        this.listDates.forEach((date: any) => {
            date.shifts.forEach((shift: any) => {
                shift.method = !shift.isHoliday ? method.id : this.METHODS.HOLIDAY_LEAVE;
            });
        });
        this.calculateStats();
    }

    onDayMethodSelect(shift: any, method: any) {
        shift.method = !shift.isHoliday ? method.id : this.METHODS.HOLIDAY_LEAVE;
        this.calculateStats();
    }

    showModal() {
        this.dayOffRegisterModal.open();
    }

    setUpdate(dayOffRegister: DayOff) {
        this.isUpdate = true;
        _.each(dayOffRegister.dates, (date: DayOffDate) => {
            date.date = moment(date.date, this.appService.momentDateTimeLocalFormat[this.appService.locale].shortDate);
            date.dateText = `${date.date.date()}/${date.date.month() + 1}`;
            date.dateName = this.getDayName(date.date.day());
            date.isShowDay = this.utilService.bitwiseCheck(date.shiftWorkingDaysValue, this.getDayValue(date.date.day()));
            date.isHoliday = this.checkDayIsHoliday(date.date);
        });
        this.renderListDates(dayOffRegister.dates);
        this.formModel.patchValue(dayOffRegister);
        this.calculateStats();
        this.showModal();
    }

    save() {
        this.model = this.formModel.value;
        // Nếu là nghỉ phép sẽ kiểm tra với số ngày phép còn lại.
        if (this.dayOff.method === this.METHODS.ANNUAL_LEAVE && this.dayOff.toDate) {
            // TODO: Check this
            // Check total annual leave days
            // if (this.totalAnnualLeave > this.currentUser.holidayRemain) {
            //     this.errorMessage = 'Số ngày nghỉ phép không được phép lớn hơn số ngày phép còn lại';
            //     return;
            // }
        }

        if (!this.isUpdate && (this.dayOff.method == null || this.dayOff.method === undefined)) {
            this.toastr.error('Vui lòng chọn hình thức nghỉ');
            return;
        }

        const isValid = this.utilService.onValueChanged(this.formModel, this.formErrors, this.validationMessages, true);
        if (isValid) {
            const listDayOffDate = this.convertListDatesDisplayToListDates();
            this.dayOff.dates = listDayOffDate;

            this.isSaving = true;
            if (this.isUpdate) {
                this.dayOffService.update(this.model)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.toastr.success('Cập nhật thông tin nghỉ phép thành công.');
                        this.dayOffRegisterModal.dismiss();
                        this.formModel.reset();
                        this.onSaveSuccess.emit(false);
                    });
            } else {
                this.dayOffService.insert(this.model)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.toastr.success('Đăng ký nghỉ phép thành công. Vui lòng chờ cấp trên phê duyệt.');
                        this.dayOffRegisterModal.dismiss();
                        this.formModel.reset();
                        this.onSaveSuccess.emit(true);
                    });
            }
        }
    }

    private buildForm() {
        this.formModel = this.fb.group({
            'id': [this.dayOff.id],
            'fromDate': [this.dayOff.fromDate],
            'toDate': [this.dayOff.toDate],
            'method': [this.dayOff.method],
            'dayOff': [this.dayOff.dayOff],
            'dayWork': [this.dayOff.dayWork],
            'reason': [this.dayOff.reason, [
                Validators.required,
                Validators.maxLength(500)
            ]],
            // 'shifts': [this.model.shifts],
            'dates': this.fb.array([])
        });
        this.formModel.valueChanges.subscribe(data =>
            this.utilService.onValueChanged(this.formModel, this.formErrors, this.validationMessages));
    }

    private getDayName(dayOfWeek: number) {
        return dayOfWeek === this.MOMENT_DAY_OF_WEEK.SUNDAY ? 'CN' : 'Thứ ' + (dayOfWeek + 1);
    }

    private getDayValue(dayOfWeek: number) {
        switch (dayOfWeek) {
            case this.MOMENT_DAY_OF_WEEK.SUNDAY:
                return 1;
            case this.MOMENT_DAY_OF_WEEK.MONDAY:
                return 2;
            case this.MOMENT_DAY_OF_WEEK.TUESDAY:
                return 4;
            case this.MOMENT_DAY_OF_WEEK.WEDNESDAY:
                return 8;
            case this.MOMENT_DAY_OF_WEEK.THURSDAY:
                return 16;
            case this.MOMENT_DAY_OF_WEEK.FRIDAY:
                return 32;
            case this.MOMENT_DAY_OF_WEEK.SATURDAY:
                return 64;
        }
    }

    private calculateListDate() {
        const formValue = this.formModel.value;
        const fromDate = moment(formValue.fromDate, this.appService.momentDateTimeLocalFormat[this.appService.locale].shortDate);
        const toDate = formValue.toDate ? moment(formValue.toDate,
            this.appService.momentDateTimeLocalFormat[this.appService.locale].shortDate) : fromDate;
        const diff = fromDate.diff(toDate, 'days');

        if (!this.listShifts) {
            this.toastr.error('Bạn chưa được cấu hình ca làm việc. Vui lòng liên hệ với bộ phận nhân sự.');
            return;
        }

        if (diff > 0) {
            this.toastr.error('Đến ngày không được phép trước từ ngày.');
            return;
        }

        const datesArray = [];
        if (diff !== 0) {
            this.listShifts.forEach((shift: any) => {
                for (let i = 0; i <= Math.abs(diff); i++) {
                    const newDay = moment(fromDate).add(i, 'days');
                    const weekDay = newDay.day();
                    datesArray.push({
                        shiftId: shift.id,
                        shiftCode: shift.code,
                        shiftReportName: shift.reportName,
                        shiftWorkUnit: shift.workUnit,
                        shiftWorkingDaysValue: shift.workingDaysValue,
                        date: newDay,
                        dateText: `${newDay.date()}/${newDay.month() + 1}`,
                        dateName: this.getDayName(weekDay),
                        value: this.getDayValue(weekDay),
                        method: this.formModel.value.method ? this.formModel.value.method : null,
                        methodName: this.getMethodShortName(this.formModel.value.method),
                        isShowDay: this.utilService.bitwiseCheck(shift.workingDaysValue, this.getDayValue(weekDay)),
                        isHoliday: this.checkDayIsHoliday(newDay)
                    });
                }
            });
        } else {
            this.listShifts.forEach((shift: any) => {
                const weekday = fromDate.day();
                datesArray.push({
                    shiftId: shift.id,
                    shiftCode: shift.code,
                    shiftReportName: shift.reportName,
                    shiftWorkUnit: shift.workUnit,
                    shiftWorkingDaysValue: shift.workingDaysValue,
                    date: fromDate,
                    dateText: `${fromDate.date()}/${fromDate.month() + 1}`,
                    dateName: this.getDayName(weekday),
                    value: this.getDayValue(weekday),
                    method: this.formModel.value.method ? this.formModel.value.method : null,
                    methodName: this.getMethodShortName(this.formModel.value.method),
                    isShowDay: this.utilService.bitwiseCheck(shift.workingDaysValue, this.getDayValue(weekday)),
                    isHoliday: this.checkDayIsHoliday(fromDate)
                });
            });
        }
        this.renderListDates(datesArray);
    }

    private calculateStats() {
        this.totalAnnualLeave = 0;
        this.totalUnpaidLeave = 0;
        this.totalInsuranceLeave = 0;
        this.totalCompensatory = 0;
        this.totalEntitlement = 0;

        _.each(this.listDates, (date: any) => {
            _.each(date.shifts, (shift: any) => {
                this.totalAnnualLeave += shift.method === this.METHODS.ANNUAL_LEAVE
                && (shift.workingDaysValue & shift.value) === shift.value && !shift.isHoliday ? shift.workUnit : 0;

                this.totalUnpaidLeave += shift.method === this.METHODS.UNPAID_LEAVE
                && (shift.workingDaysValue & shift.value) === shift.value && !shift.isHoliday ? shift.workUnit : 0;

                this.totalInsuranceLeave += shift.method === this.METHODS.INSURANCE_LEAVE
                && (shift.workingDaysValue & shift.value) === shift.value && !shift.isHoliday ? shift.workUnit : 0;

                this.totalCompensatory += shift.method === this.METHODS.COMPENSATORY_LEAVE
                && (shift.workingDaysValue & shift.value) === shift.value && !shift.isHoliday ? shift.workUnit : 0;

                this.totalEntitlement += shift.method === this.METHODS.ENTITLEMENT
                && (shift.workingDaysValue & shift.value) === shift.value && !shift.isHoliday ? shift.workUnit : 0;
            });
        });

        this.listStats = [
            {name: 'Nghỉ phép', quantity: this.totalAnnualLeave},
            {name: 'Nghỉ không lương', quantity: this.totalUnpaidLeave},
            {name: 'Nghỉ bảo hiểm', quantity: this.totalInsuranceLeave},
            {name: 'Nghỉ bù', quantity: this.totalCompensatory},
            {name: 'Nghỉ chế độ', quantity: this.totalEntitlement}
        ];
    }

    private checkDayIsHoliday(day: Moment) {
        const thisYear = moment().year();
        const holiday = _.find(this.listHolidays, (holidayConfig: Holiday) => {
            if (holidayConfig.toDay != null && holidayConfig.toDay.day != null && holidayConfig.toDay.month != null) {
                const fromDay = new Date(thisYear, holidayConfig.fromDay.month - 1, holidayConfig.fromDay.day);
                const toDay = new Date(thisYear, holidayConfig.toDay.month - 1, holidayConfig.toDay.day);

                const dateDiff = moment(toDay).diff(fromDay, 'days');
                for (let i = 0; i <= dateDiff; i++) {
                    const currentDay = moment(fromDay).add(i, 'day');
                    return currentDay.date() === day.date() && currentDay.month() === day.month();
                }
            } else {
                return holidayConfig.fromDay.day === day.date() && holidayConfig.fromDay.month === day.month() + 1;
            }
        });

        return holiday != null && holiday !== undefined;
    }

    private renderListDates(dates: any): void {
        const groupDates = _.groupBy(dates, (date: DayOffDate) => {
            return date.date;
        });
        if (groupDates) {
            const datesGroupArray = [];
            for (const key in groupDates) {
                if (groupDates.hasOwnProperty(key)) {
                    const firstDate = groupDates[key][0];
                    const newDate = {
                        date: firstDate.date,
                        dateText: firstDate.dateText,
                        dateName: firstDate.dateName,
                        shifts: []
                    };
                    _.each(groupDates[key], (groupDate: DayOffDate) => {
                        newDate.shifts.push({
                            id: groupDate.shiftId,
                            code: groupDate.shiftCode,
                            reportName: groupDate.shiftReportName,
                            method: groupDate.method,
                            methodName: groupDate.methodName,
                            workUnit: groupDate.shiftWorkUnit,
                            isShowDay: groupDate.isShowDay,
                            isHoliday: groupDate.isHoliday,
                            value: groupDate.value,
                            workingDaysValue: groupDate.shiftWorkingDaysValue
                        } as IDayOffShiftDisplay);
                    });
                    datesGroupArray.push(newDate);
                }
            }
            this.listDates = datesGroupArray;
        }
    }

    private convertListDatesDisplayToListDates(): DayOffDate[] {
        const listDayOff: DayOffDate[] = [];
        _.each(this.listDates, (date: IDateDisplay) => {
            _.each(date.shifts, (shift: IDayOffShiftDisplay) => {
                const dayOff = new DayOffDate();
                dayOff.date = date.date.format(this.appService.momentDateTimeLocalFormat[this.appService.locale].shortDate);
                dayOff.dateText = date.dateText;
                dayOff.dateName = date.dateName;
                dayOff.value = shift.value;
                dayOff.shiftWorkUnit = shift.workUnit;
                dayOff.shiftId = shift.id;
                dayOff.shiftWorkUnit = shift.workUnit;
                dayOff.shiftReportName = shift.reportName;
                dayOff.shiftCode = shift.code;
                dayOff.shiftWorkingDaysValue = shift.workingDaysValue;
                dayOff.method = shift.method;
                listDayOff.push(dayOff);
            });
        });
        return listDayOff;
    }

    private getMethodShortName(method: number) {
        switch (method) {
            case 0:
                return 'NP';
            case 1:
                return 'NKL';
            case 2:
                return 'NB';
            case 3:
                return 'NBH';
            case 4:
                return 'NCĐ';
            case 5:
                return 'NT';
            default:
                return 'Đi làm';
        }
    }
}
