/**
 * Created by HoangIT21 on 7/22/2017.
 */
import {
    AfterViewInit, Component, Inject, OnInit,
    ViewChild
} from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { IAppConfig } from '../../../interfaces/iapp-config';
import { Title } from '@angular/platform-browser';
import swal from 'sweetalert2';
import { TimekeepingDayOffRegisterComponent } from './timekeeping-day-off-register.component';
import { IActionResultResponse } from '../../../interfaces/iaction-result-response.result';
import { NhModalComponent } from '../../../shareds/components/nh-modal/nh-modal.component';
import { DayOff, DayOffDate, IDateDisplay, IDayOffShiftDisplay } from './day-off.model';
import { APP_CONFIG } from '../../../configs/app.config';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { TimekeepingWorkScheduleService } from '../config/work-schedule/timekeeping-work-schedule.service';
import { TimekeepingDayOffService } from './timekeeping-dayoff.service';
import { UtilService } from '../../../shareds/services/util.service';
import { FilterLink } from '../../../shareds/models/filter-link.model';
import { finalize } from 'rxjs/internal/operators';
import { BaseListComponent } from '../../../base-list.component';

@Component({
    selector: 'app-timekeeping-day-off',
    templateUrl: './timekeeping-day-off.component.html',
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})

export class TimekeepingDayOffComponent extends BaseListComponent<any> implements OnInit, AfterViewInit {
    @ViewChild('dayOffDetailModal') detailModal: NhModalComponent;
    @ViewChild(TimekeepingDayOffRegisterComponent) dayOffRegisterComponent: TimekeepingDayOffRegisterComponent;
    listDayOff: DayOff[] = [];
    dayOffDetail: DayOff = new DayOff();
    fromDateSearch: string;
    toDateSearch: string;
    searchType: number;
    statusSearch: number;
    isGettingDetail = false;
    listDates: IDateDisplay[] = [];
    listShifts = [];
    totalDates = 0;
    isApprove = false;
    listStats = [];

    // Stats
    totalAnnualLeave;
    totalUnpaidLeave;
    totalInsuranceLeave;
    totalCompensatory;
    totalEntitlement;

    DAYOFF_STATUS = {
        WAIT_MANAGER_APPROVE: 0,
        MANAGER_APPROVE: 1,
        MANAGER_APPROVE_WAIT_APPROVER_APPROVE: 2,
        MANAGER_DECLINE: 3,
        APPROVER_APPROVE: 4,
        APPROVER_DECLINE: 5,
        CANCEL: 6
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

    DAYOFF_METHOD = {
        ANNUAL_LEAVE: 0, // Nghỉ phép
        UNPAID_LEAVE: 1, // Nghỉ không lương
        COMPENSATORY_LEAVE: 2, // Nghỉ bù
        INSURANCE_LEAVE: 3, // Nghỉ bảo hiểm
        ENTITLEMENT_LEAVE: 4, // Nghỉ chế độ
        WEEK_LEAVE: 5, // Nghỉ tuần
        HOLIDAY_LEAVE: 6, // Nghỉ lễ
        UNAUTHORIZED_LEAVE: 7, // Nghỉ không phép
    };

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                @Inject(PAGE_ID) pageId: IPageId,
                private location: Location,
                private title: Title,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private workScheduleService: TimekeepingWorkScheduleService,
                private dayOffService: TimekeepingDayOffService,
                private utilService: UtilService) {
        super();
        this.title.setTitle('Duyệt đăng ký nghỉ.');
        // this.currentUser = this.appService.currentUser;
        this.appService.setupPage(pageId.HR, pageId.TIMEKEEPING_DAY_OFF_APPROVE, 'Chấm công', 'Đăng ký nghỉ');
        // this.getPermission(this.appService);

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.statusSearch = params.status ? params.status : '';
            this.fromDateSearch = params.fromDate ? params.fromDate : '';
            this.toDateSearch = params.toDate ? params.toDate : '';
            this.searchType = params.type != null && params.type !== undefined ? params.type : 0;
            this.currentPage = params.page ? params.page : 1;
            this.pageSize = params.pageSize ? params.pageSize : appConfig.pageSize;
        });

        this.workScheduleService.getMyWorkSchedule()
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: any) => {
                this.listShifts = result.shifts;
            });
    }

    ngOnInit() {
        this.subscribers.routeData = this.route.data.subscribe((result: { data: any }) => {
            const data = result.data;
            if (data) {
                this.renderListRegister(data);
            }
        });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            if (params.type) {
                this.searchType = parseInt(params.type);
            }

            if (params.showRegister) {
                setTimeout(() => {
                    this.dayOffRegisterComponent.showModal();
                });
            }
        });
    }

    ngAfterViewInit() {
        this.route.queryParams.forEach(params => {
            const id = params.id;
            const role = params.role;

            // setTimeout(() => {
            if (role === 'user') {
                this.searchType = 0;
            }

            if (role === 'manager') {
                this.searchType = 1;
            }

            if (role === 'approver') {
                this.searchType = 2;
            }
            // }, 500);

            if (id) {
                setTimeout(() => {
                    this.detailModal.open();
                    this.isGettingDetail = true;
                    this.dayOffService.getDetail(id)
                        .pipe(finalize(() => this.isGettingDetail = false))
                        .subscribe(dayOffRegister => {
                            this.showDetail(dayOffRegister);
                        });
                }, 100);
            }
        });
    }

    delete(dayOff: DayOff) {
        // swal({
        //     title: '',
        //     text: `Bạn có chắc chắn muốn xoá đăng ký xin nghỉ này?`,
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     console.log(dayOff.id);
        //     this.dayOffService.delete(dayOff.id)
        //         .subscribe((result: IActionResultResponse) => {
        //             this.toastr.success(result.message);
        //             this.search(this.currentPage, this.searchType);
        //         });
        // }, () => {
        // });
    }


    approve(shift: IDayOffShiftDisplay, isApprove: boolean, shiftIndex?: number) {
        if (isApprove) {
            if (this.searchType === 1) {
                shift.isManagerApprove = isApprove;
                shift.managerDeclineReason = '';
            }
            if (this.searchType === 2) {
                shift.isApproverApprove = isApprove;
                shift.approverDeclineReason = '';
            }
        } else {
            if (this.searchType === 1) {
                shift.isManagerApprove = false;
            } else if (this.searchType === 2) {
                shift.isApproverApprove = false;
            }
        }
    }

    approveAll(isApprove: boolean) {
        this.isApprove = isApprove;
        const note = this.searchType === 1 ? this.dayOffDetail.managerNote : this.dayOffDetail.approverNote;
        const declineReason = this.searchType === 1 ? this.dayOffDetail.managerDeclineReason : this.dayOffDetail.approverDeclineReason;
        this.dayOffService.approveAll(this.dayOffDetail.id, this.isApprove, note, declineReason)
            // .pipe(finalize(() => this.isSaving = false))
            .subscribe((result: IActionResultResponse<any>) => {
                this.toastr.success(result.message);
                this.dayOffDetail.status = result.data.status;
                this.dayOffDetail.statusText = this.getStatusText(this.dayOffDetail.status);
            });
    }

    declineAll() {
        this.isApprove = false;
        // swal({
        //     title: '',
        //     text: `Bạn có chắc chắn muốn không duyệt cho tất cả các ngày đăng ký xin nghỉ của nhân viên "${this.dayOffDetail.fullName}"`,
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     swal({
        //         input: 'textarea',
        //         inputPlaceholder: 'Vui lòng nhập lý do không duyệt.',
        //         showCancelButton: true,
        //         confirmButtonColor: '#DD6B55',
        //         confirmButtonText: 'Đồng ý',
        //         cancelButtonText: 'Hủy bỏ'
        //     }).then((text) => {
        //         if (text) {
        //             if (this.searchType === 1) {
        //                 this.dayOffDetail.managerDeclineReason = text;
        //             }
        //             if (this.searchType === 2) {
        //                 this.dayOffDetail.approverDeclineReason = text;
        //             }
        //             this.approveAll(false);
        //         }
        //     }, () => {
        //     });
        // }, () => {
        // });
    }

    confirm() {
        const dayOffApprove = {
            id: this.dayOffDetail.id,
            type: this.searchType,
            isApprove: this.isApprove,
            managerNote: this.dayOffDetail.managerNote,
            approverNote: this.dayOffDetail.approverNote,
            managerDeclineReason: this.dayOffDetail.managerDeclineReason,
            approverDeclineReason: this.dayOffDetail.approverDeclineReason,
            dates: this.convertListDatesDisplayToListDates()
        };
        const promise = Object.keys(dayOffApprove.dates).map((key, index) => {
            return new Promise((resolve, reject) => {
                const date = dayOffApprove.dates[key];
                if (date.method === this.DAYOFF_METHOD.WEEK_LEAVE || date.method === this.DAYOFF_METHOD.UNAUTHORIZED_LEAVE
                    || date.method === this.DAYOFF_METHOD.HOLIDAY_LEAVE || !date.method) {
                    resolve(true);
                } else if (dayOffApprove.type === 1 && !date.isManagerApprove && !date.managerDeclineReason) {
                    resolve(false);
                } else if (dayOffApprove.type === 2 && !date.isApproverApprove && !date.approverDeclineReason) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
        return Promise.all(promise).then(values => {
            const failCount = _.countBy(values, value => {
                return !value;
            }).true;
            if (failCount >= 0) {
                this.toastr.error('Vui lòng nhập lý do không duyệt.');
                return;
            }
            this.dayOffService.confirm(dayOffApprove)
                .subscribe((result: IActionResultResponse<any>) => {
                    this.toastr.success(result.message);
                    this.dayOffDetail.status = result.data.status;
                    this.dayOffDetail.statusText = this.getStatusText(this.dayOffDetail.status);
                    this.dayOffDetail.totalApprovedDays = result.data.totalApprovedDays;
                });
        });
    }

    showRegisterModal() {
        this.dayOffRegisterComponent.isUpdate = false;
        this.dayOffRegisterComponent.formModel.reset(new DayOff());
        this.dayOffRegisterComponent.listDates = [];
        this.dayOffRegisterComponent.showModal();
    }

    showDetail(dayOffDetail: DayOff) {
        this.dayOffDetail = dayOffDetail;
        this.dayOffDetail.statusText = this.getStatusText(this.dayOffDetail.status);
        this.renderListDates(this.dayOffDetail.dates);
        this.renderDetailLink();
        this.detailModal.open();
        this.calculateStats();
    }

    onSelectFromDate(date) {
        this.fromDateSearch = date.currentValue;
        this.search(1);
    }

    onSelectToDate(date) {
        this.toDateSearch = date.currentValue;
        this.search(1);
    }

    onSelectStatus(status) {
        this.statusSearch = status.id;
        this.search(1);
    }

    search(currentPage: number, searchType?: number) {
        this.currentPage = currentPage;
        this.searchType = searchType != null && searchType !== undefined ? searchType : this.searchType;
        this.renderFilterLink();
        this.isSearching = true;
        this.dayOffService.searchDayOff(this.keyword, this.searchType, this.fromDateSearch, this.toDateSearch, this.statusSearch,
            this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe(result => {
                this.renderListRegister(result);
            });
    }

    // itemApprove(dayOffRegister: DayOff, isApprove: boolean) {
    //     if (!isApprove) {
    //         swal({
    //             title: '',
    //             text: `Bạn có chắc chắn không duyệt cho đơn xin nghỉ của: "${dayOffRegister.fullName}"`,
    //             type: 'warning',
    //             showCancelButton: true,
    //             confirmButtonColor: '#DD6B55',
    //             confirmButtonText: 'Đồng ý',
    //             cancelButtonText: 'Hủy bỏ'
    //         }).then(() => {
    //             swal({
    //                 input: 'textarea',
    //                 inputPlaceholder: 'Vui lòng nhập lý do không duyệt.',
    //                 showCancelButton: true,
    //                 confirmButtonColor: '#DD6B55',
    //                 confirmButtonText: 'Gửi',
    //                 cancelButtonText: 'Hủy bỏ'
    //             }).then((text) => {
    //                 if (text) {
    //                     this.updateApproveStatus(dayOffRegister, isApprove, text);
    //                 }
    //             }, () => {
    //             });
    //         }, () => {
    //         });
    //     } else {
    //         this.updateApproveStatus(dayOffRegister, isApprove);
    //     }
    // }

    // approve(isApprove: boolean) {
    //     this.isSaving = true;
    //     this.dayOffService.approve(this.dayOffDetail.id, isApprove)
    //         .finally(() => this.isSaving = false)
    //         .subscribe(result => {
    //             this.toastr.success('Cập nhật trạng thái thành công.');
    //             this.search(1, this.searchType);
    //             this.detailModal.dismiss();
    //             this.dayOffDetail = null;
    //         }, error => this.toastr.error(error.message));
    // }

    cancel(dayOffRegister: DayOff) {
        swal({
            title: '',
            text: `Bạn có chắc chắn muốn xóa bản đăng ký nghỉ này?`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy bỏ'
        }).then(() => {
            this.dayOffService.cancel(dayOffRegister.id)
                .subscribe(() => {
                    this.toastr.success('Hủy đăng ký thành công.');
                });

            dayOffRegister.status = this.DAYOFF_STATUS.CANCEL;
            dayOffRegister.statusText = this.getStatusText(dayOffRegister.status);
        }, () => {
        });
    }

    edit(dayOffRegister: DayOff) {
        this.dayOffRegisterComponent.setUpdate(dayOffRegister);
    }

    private renderListRegister(result: any) {
        this.totalRows = result.totalRows;
        result.items.forEach(item => {
            item.statusText = this.getStatusText(item.status);
            item.dates.forEach(date => {
                date.dateText = `${moment(date.day).date()}/${moment(date.day).month()}`;
                date.statusText = this.getStatusText(date.status);
                date.methodName = this.getMethodShortName(date.method);
            });
        });
        this.listDayOff = result.items;
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

    private getStatusText(status: number) {
        switch (status) {
            case this.DAYOFF_STATUS.WAIT_MANAGER_APPROVE:
                return 'Chờ QLTT duyệt';
            case this.DAYOFF_STATUS.MANAGER_APPROVE:
                return 'QLTT đã duyệt';
            case this.DAYOFF_STATUS.MANAGER_APPROVE_WAIT_APPROVER_APPROVE:
                return 'QLTT duyệt chờ QLPD duyệt';
            case this.DAYOFF_STATUS.MANAGER_DECLINE:
                return 'QLTT không duyệt';
            case this.DAYOFF_STATUS.APPROVER_APPROVE:
                return 'QLPD đã duyệt';
            case this.DAYOFF_STATUS.APPROVER_DECLINE:
                return 'QLPD không duyệt';
            case this.DAYOFF_STATUS.CANCEL:
                return 'Đã hủy đăng ký';
        }
    }

    private getDayName(dayOfWeek: number) {
        return dayOfWeek === this.MOMENT_DAY_OF_WEEK.SUNDAY ? 'CN' : 'Thứ ' + (dayOfWeek + 1);
    }

    private renderListDates(dates: DayOffDate[]): void {
        this.totalDates = _.countBy(dates, (date: DayOffDate) => {
            return date.method === this.DAYOFF_METHOD.ANNUAL_LEAVE || this.DAYOFF_METHOD.COMPENSATORY_LEAVE ||
                this.DAYOFF_METHOD.ENTITLEMENT_LEAVE || this.DAYOFF_METHOD.INSURANCE_LEAVE || this.DAYOFF_METHOD.UNPAID_LEAVE;
        }).true;
        const groupDates = _.groupBy(dates, (date: DayOffDate) => {
            return date.date;
        });
        if (groupDates) {
            const datesGroupArray = [];
            for (const key in groupDates) {
                if (groupDates.hasOwnProperty(key)) {
                    const firstDate = groupDates[key][0];
                    const date = moment(firstDate.date, this.appService.momentDateTimeLocalFormat[this.appService.locale].shortDate);
                    const newDate = {
                        date: firstDate.date,
                        dateText: `${date.date()}/${date.month() + 1}`,
                        dateName: this.getDayName(date.day()),
                        shifts: []
                    };
                    _.each(groupDates[key], (groupDate: DayOffDate) => {
                        newDate.shifts.push({
                            id: groupDate.shiftId,
                            code: groupDate.shiftCode,
                            reportName: groupDate.shiftReportName,
                            method: groupDate.method,
                            methodName: this.getMethodShortName(groupDate.method),
                            workUnit: groupDate.shiftWorkUnit,
                            isShowDay: groupDate.isShowDay,
                            isHoliday: groupDate.isHoliday,
                            value: groupDate.value,
                            workingDaysValue: groupDate.shiftWorkingDaysValue,
                            isManagerApprove: groupDate.isManagerApprove,
                            isApproverApprove: groupDate.isApproverApprove,
                            managerNote: groupDate.managerNote,
                            approverNote: groupDate.approverNote,
                            managerDeclineReason: groupDate.managerDeclineReason,
                            approverDeclineReason: groupDate.approverDeclineReason
                        } as IDayOffShiftDisplay);
                    });
                    datesGroupArray.push(newDate);
                }
            }
            this.listDates = datesGroupArray;
        }
    }

    private renderDetailLink() {
        const path = '/timekeeping/day-off';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('id', this.dayOffDetail.id),
            new FilterLink('type', this.searchType),
        ]);
        this.location.go(path, query);
    }

    private renderFilterLink() {
        const path = '/timekeeping/day-off';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('status', this.statusSearch),
            new FilterLink('fromDate', this.fromDateSearch),
            new FilterLink('toDate', this.toDateSearch),
            new FilterLink('type', this.searchType),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        // this.appService.updateTabItem(`${path}?${query}`);
        this.location.go(path, query);
    }

    private convertListDatesDisplayToListDates(): DayOffDate[] {
        const listDayOff: DayOffDate[] = [];
        _.each(this.listDates, (date: IDateDisplay) => {
            _.each(date.shifts, (shift: IDayOffShiftDisplay) => {
                const dayOff = new DayOffDate();
                dayOff.date = date.date;
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
                dayOff.isManagerApprove = shift.isManagerApprove;
                dayOff.isApproverApprove = shift.isApproverApprove;
                dayOff.managerNote = shift.managerNote;
                dayOff.approverNote = shift.approverNote;
                dayOff.managerDeclineReason = shift.managerDeclineReason;
                dayOff.approverDeclineReason = shift.approverDeclineReason;
                listDayOff.push(dayOff);
            });
        });
        return listDayOff;
    }

    // Hàm này cấn check theo số ngày điều chuyển lên cấp trên được cấu hình theo config. Hiện tại
    // Fix tĩnh <= 3 ngày không gửi, lớn hơn 3 ngày sẽ gửi lên.
    private updateAllApproveStatus(isApprove: boolean) {
        _.each(this.listDates, (dates: IDateDisplay) => {
            _.each(dates.shifts, (shift: IDayOffShiftDisplay) => {
                if (this.searchType === 1) {
                    shift.isManagerApprove = isApprove;
                    shift.managerDeclineReason = '';
                }

                if (this.searchType === 2) {
                    shift.isApproverApprove = isApprove;
                    shift.approverDeclineReason = '';
                }
            });
        });
    }

    private calculateStats() {
        this.totalAnnualLeave = 0;
        this.totalUnpaidLeave = 0;
        this.totalInsuranceLeave = 0;
        this.totalCompensatory = 0;
        this.totalEntitlement = 0;

        _.each(this.listDates, (date: any) => {
            _.each(date.shifts, (shift: any) => {
                this.totalAnnualLeave += shift.method === this.DAYOFF_METHOD.ANNUAL_LEAVE
                && (shift.workingDaysValue & shift.value) === shift.value && !shift.isHoliday
                    ? shift.workUnit : 0;

                this.totalUnpaidLeave += shift.method === this.DAYOFF_METHOD.UNPAID_LEAVE
                && (shift.workingDaysValue & shift.value) === shift.value && !shift.isHoliday
                    ? shift.workUnit : 0;

                this.totalInsuranceLeave += shift.method === this.DAYOFF_METHOD.INSURANCE_LEAVE
                && (shift.workingDaysValue & shift.value) === shift.value && !shift.isHoliday
                    ? shift.workUnit : 0;

                this.totalCompensatory += shift.method === this.DAYOFF_METHOD.COMPENSATORY_LEAVE
                && (shift.workingDaysValue & shift.value) === shift.value && !shift.isHoliday
                    ? shift.workUnit : 0;

                this.totalEntitlement += shift.method === this.DAYOFF_METHOD.ENTITLEMENT_LEAVE
                && (shift.workingDaysValue & shift.value) === shift.value && !shift.isHoliday
                    ? shift.workUnit : 0;
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
}
