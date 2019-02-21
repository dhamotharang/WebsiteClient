import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { IActionResultResponse } from '../../../interfaces/iaction-result-response.result';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { HelperService } from '../../../shareds/services/helper.service';
import { TimeSheetService } from './timesheet.service';
import { NhModalComponent } from '../../../shareds/components/nh-modal/nh-modal.component';
import {
    MyReportByShift, ReportByShift, ReportByShiftDetail, ReportByShiftShifts,
    WorkingDays
} from './view-models/report-by-shift.viewmodel';
import { ReportByMonth, ReportShiftAggregate } from './view-models/report-by-month.viewmodel';
import { CheckinCheckoutHistoryViewModel } from './view-models/checkin-checkout-history.viewmodel';
import { DayDetailViewModel, ReportByMonthDetailViewModel } from './view-models/report-by-month-detail.viewmodel';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { UtilService } from '../../../shareds/services/util.service';
import { OfficeService } from '../../hr/organization/office/services/office.service';
import { BaseListComponent } from '../../../base-list.component';

@Component({
    selector: 'app-time-sheet',
    templateUrl: './timekeeping-timesheet.component.html',
    providers: [OfficeService, TimeSheetService, HelperService]
})
export class TimekeepingTimesheetComponent extends BaseListComponent<any> implements OnInit {
    @ViewChild('shiftDetailModal') shiftDetailModal: NhModalComponent;
    @ViewChild('reportMonthDetailModal') reportMonthDetailModal: NhModalComponent;
    @ViewChild('dayOffDetailModal') dayOffDetailModal: NhModalComponent;
    @ViewChild('reportByShiftTableElement') reportByShiftTableElement: ElementRef;
    @ViewChild('reportByMonthTableElement') reportByMonthTableElement: ElementRef;
    currentUser: any;
    officeTree = [];
    listMonth = [];
    listYear = [];
    // daysInMonth = [];
    month: number;
    year: number;
    officeId: number;
    officeName: string;
    reportByShiftDetail: ReportByShiftDetail;
    shiftDetailViewType = 0;
    daysInMonth = [];
    viewType = 0; // 0: Detail 1: Aggregate
    listReports: ReportByShift[] = [];
    listReportByMonth = [];
    reportMonthDetail: ReportByMonth;
    listShifts: ReportShiftAggregate[] = [];
    reportByMonthDetail: any;
    isLoadingHistory = false;
    isLoadingPrinter = false;
    isSearchingMonthDetail = false;
    listCheckInCheckOutHistory: CheckinCheckoutHistoryViewModel[] = [];
    listReportByMonthDetail: ReportByMonthDetailViewModel[] = [];
    listDayOffMethos: { id: any, name: string }[] = [];

    listMyTimeSheet$: Observable<MyReportByShift[]>;

    STATUS = {
        // 0: Nghỉ phép
        ANNUAL_LEAVE: 0,
        // 1: Nghỉ không lương
        UNPAID_LEAVE: 1,
        // 2: Nghỉ bù
        COMPENSATORY_LEAVE: 2,
        // 3: Nghỉ bảo hiểm
        INSURANCE_LEAVE: 3,
        // 4: Nghỉ chế độ
        ENTITLEMENT_LEAVE: 4,
        // 5: Nghỉ tuần
        WEEK_LEAVE: 5,
        // 6: Nghỉ lễ
        HOLIDAY_LEAVE: 6,
        // 7: Nghỉ không phép
        UNAUTHORIZED_LEAVE: 7
    };

    get totalInSoon() {
        let totalInSoon = 0;
        this.listReportByMonthDetail.forEach(detail => {
            detail.dayDetail.forEach(item => {
                totalInSoon += item.inSoonMin;
            });
        });

        return totalInSoon;
    }

    get totalOutSoon() {
        let totalOutSoon = 0;
        this.listReportByMonthDetail.forEach(detail => {
            detail.dayDetail.forEach(item => {
                totalOutSoon += item.outSoonMin;
            });
        });

        return totalOutSoon;
    }

    get totalInLate() {
        let totalInLate = 0;
        this.listReportByMonthDetail.forEach(detail => {
            detail.dayDetail.forEach(item => {
                totalInLate += item.inLateMin;
            });
        });

        return totalInLate;
    }

    get totalOutLate() {
        let totalOutLate = 0;
        this.listReportByMonthDetail.forEach(detail => {
            detail.dayDetail.forEach(item => {
                totalOutLate += item.outLateMin;
            });
        });

        return totalOutLate;
    }

    get totalValidMeal() {
        return _.sumBy(this.listReportByMonthDetail, (detail: ReportByMonthDetailViewModel) => {
            return detail.isValidMeal ? 1 : 0;
        });
    }

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) pageId: IPageId,
                private title: Title,
                private toastr: ToastrService,
                private utilService: UtilService,
                private helperService: HelperService,
                private spinnerService: SpinnerService,
                private officeService: OfficeService,
                private timeSheetService: TimeSheetService) {
        super();
        this.title.setTitle('Bảng công nhân viên.');
        this.appService.setupPage(pageId.HR, pageId.TIMEKEEPING_TIMESHEET, 'Chấm công', 'Bảng công nhân viên.');
        // this.getPermission(this.appService);
        // this.currentUser = this.appService.currentUser;

        // Init list month
        this.initListMonth();

        // Init list year
        this.initListYear();

        this.initDefaultMonthAndYear();

        // Init list days in month by selected month
        this.initDayInMonth();

        // Get list tree data
        this.getTreeData();

        this.listDayOffMethos = [
            {id: this.STATUS.ANNUAL_LEAVE, name: 'Nghỉ phép'},
            {id: this.STATUS.UNPAID_LEAVE, name: 'Nghỉ Không lương'},
            {id: this.STATUS.COMPENSATORY_LEAVE, name: 'Nghỉ bù'},
            {id: this.STATUS.INSURANCE_LEAVE, name: 'Nghỉ bảo hiểm'},
            {id: this.STATUS.ENTITLEMENT_LEAVE, name: 'Nghỉ chế độ'},
            {id: this.STATUS.WEEK_LEAVE, name: 'Nghỉ tuần'},
            {id: this.STATUS.HOLIDAY_LEAVE, name: 'Nghỉ lễ'},
            {id: this.STATUS.UNAUTHORIZED_LEAVE, name: 'Nghỉ không phép'}
        ];
    }

    ngOnInit() {
        this.search();
    }

    onSelectMonth(month) {
        this.month = month.id;
        this.search();
    }

    onSelectYear(year) {
        this.year = year.id;
        this.search();
    }

    onSelectOffice(office) {
        if (office.id > 0) {
            this.officeId = office.id;
            this.officeName = office.text;
            this.search();
        }
    }

    onShiftDetailTabSelect(viewType: number) {
        this.shiftDetailViewType = viewType;
        if (this.shiftDetailViewType === 0) {

        } else {
            this.getCheckInCheckOutHistory();
        }
    }

    changeReportType(viewType) {
        this.viewType = viewType;
        this.search();
    }

    search() {
        // if (this.currentUser && !this.currentUser.isAdmin && this.currentUser.isLeader !== 1 && this.currentUser.isLeader !== 2) {
        //     if (this.viewType === 0) {
        //         this.getMyTimeSheet();
        //     } else {
        //         this.getMyTimeSheetResult();
        //     }
        // } else {
        //     if (!this.officeId) {
        //         this.officeId = this.currentUser.officeId;
        //     }
        //     if (!this.currentUser.isAdmin && !this.isHasViewPermission) {
        //         this.officeId = this.currentUser.officeId;
        //     }
        //     this.spinnerService.open();
        //     if (this.viewType === 0) {
        //         this.initDayInMonth();
        //         this.timeSheetService.getListTimeSheet(this.keyword, this.officeId, this.month, this.year)
        //             .finally(() => this.spinnerService.hide())
        //             .subscribe(result => {
        //                 this.renderListReportByShift(result);
        //
        //             });
        //     } else {
        //         this.timeSheetService.getListTimeSheetResult(this.keyword, this.officeId, this.month, this.year)
        //             .finally(() => this.spinnerService.hide())
        //             .subscribe((result: any) => {
        //                 if (result && result.length > 0) {
        //                     this.listShifts = _.orderBy(result[0].reportShiftAggregates, ['shiftId'], ['asc']) as ReportShiftAggregate[];
        //                     this.listReportByMonth = _.orderBy(_.map(result, (reportByMonth: ReportByMonth) => {
        //                         const reportByMonthItem = reportByMonth;
        //                         reportByMonthItem.totalOvertimeText = this.utilService.getHourTextFromMinute(reportByMonthItem.totalOvertime);
        //                         return reportByMonthItem;
        //                     }), ['userId'], ['asc']);
        //                 } else {
        //                     this.listReportByMonth = [];
        //                 }
        //             });
        //     }
        // }
    }

    detail(shiftId: string, enrollNumber: number, fullName: string, workingDay: WorkingDays) {
        if (workingDay) {
            this.reportByShiftDetail = new ReportByShiftDetail(
                shiftId,
                enrollNumber,
                fullName,
                `${workingDay.day}/${workingDay.month}/${workingDay.year}`,
                workingDay.day,
                workingDay.month,
                workingDay.year,
                workingDay.inDateTime,
                workingDay.outDateTime,
                workingDay.inSoonMin,
                workingDay.outSoonMin,
                workingDay.inLateMin,
                workingDay.outLateMin,
                workingDay.status,
                workingDay.inLatencyMin,
                workingDay.outLatencyMin,
                workingDay.inLatencyReason,
                workingDay.outLatencyReason);

            // Trường hợp là lịch sử lấy về danh sách lịch sử checkin checkout
            if (this.shiftDetailViewType === 1) {
                this.getCheckInCheckOutHistory();
            }
        } else {
            this.toastr.error('Không có dữ liệu chấm công ca làm việc này.');
        }

        if (workingDay.status == null) {
            this.shiftDetailModal.open();
        }
    }

    markAsValid(isCheckIn: boolean) {
        // swal({
        //     title: '',
        //     text: `Bạn có chắc chắn muốn đánh dấu hợp lệ cho ca làm việc này.`,
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#3085d6',
        //     cancelButtonColor: '#dd3333',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.subscribers.markAsValid = this.timeSheetService.markAsValid(this.reportByShiftDetail.day, this.reportByShiftDetail.month,
        //         this.reportByShiftDetail.year, this.reportByShiftDetail.enrollNumber, this.reportByShiftDetail.shiftId, isCheckIn)
        //         .subscribe((result: IActionResultResponse) => {
        //             this.toastr.success(result.message);
        //             this.shiftDetailModal.dismiss();
        //             this.search();
        //         });
        // }, () => {
        // });
    }

    deleteShift() {
        // swal({
        //     title: '',
        //     text: `Bạn có chắc chắn muốn xóa ca làm việc này. Lưu ý sau khi xóa không thể lấy lại.`,
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#3085d6',
        //     cancelButtonColor: '#dd3333',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.subscribers.deleteShift = this.timeSheetService.deleteShift(this.reportByShiftDetail.day, this.reportByShiftDetail.month,
        //         this.reportByShiftDetail.year, this.reportByShiftDetail.enrollNumber, this.reportByShiftDetail.shiftId)
        //         .subscribe((result: IActionResultResponse) => {
        //             this.toastr.success(result.message);
        //             this.shiftDetailModal.dismiss();
        //             this.search();
        //         });
        // }, () => {
        // });
    }

    onChangeDayOffMethod(method) {
        this.subscribers.changeMethod = this.timeSheetService.changeMethod(this.reportByShiftDetail.day, this.reportByShiftDetail.month,
            this.reportByShiftDetail.year, this.reportByShiftDetail.enrollNumber, this.reportByShiftDetail.shiftId, method.id)
            .subscribe((result: IActionResultResponse) => {
                this.toastr.success(result.message);
                this.search();
            });
    }

    monthReportDetail(monthReport: ReportByMonth) {
        console.log(monthReport);
        this.reportByMonthDetail = monthReport;
        this.reportMonthDetailModal.open();
        this.spinnerService.show();

        monthReport.reportShiftAggregates = _.orderBy(monthReport.reportShiftAggregates, ['shiftId'], ['asc']);
        this.reportMonthDetail = monthReport;
        this.reportMonthDetail.totalInLateMinText = this.utilService.getHourTextFromMinute(this.reportMonthDetail.totalInLateMin);
        this.reportMonthDetail.totalInSoonMinText = this.utilService.getHourTextFromMinute(this.reportMonthDetail.totalInSoonMin);
        this.reportMonthDetail.totalOutLateMinText = this.utilService.getHourTextFromMinute(this.reportMonthDetail.totalOutLateMin);
        this.reportMonthDetail.totalOutSoonMinText = this.utilService.getHourTextFromMinute(this.reportMonthDetail.totalOutSoonMin);
        this.timeSheetService.getUserTimesheet(monthReport.enrollNumber, this.month, this.year)
            .pipe(finalize(() => this.spinnerService.hide()))
            .subscribe(result => {
                this.renderMonthDetail(result);
            });
    }

    getShiftTotal(shift, reportShiftAggregates) {
        const currentShiftAggregate = _.filter(reportShiftAggregates, (reportShiftAggregate: any) => {
            return reportShiftAggregate.shiftId === shift.shiftId;
        });

        return _.sumBy(currentShiftAggregate, (o: any) => {
            return o.totalDays;
        });
    }

    print() {
        this.isLoadingPrinter = true;
        this.timeSheetService.getDataForPrint(this.officeId, this.month, this.year)
            .pipe(finalize(() => this.isLoadingPrinter = false))
            .subscribe((result: { listReportByShift: ReportByShift[], listReportByMonth: ReportByMonth[] }) => {
                if (result) {
                    this.listShifts = _.orderBy(result.listReportByMonth[0].reportShiftAggregates, ['shiftId'], ['asc']);
                    this.listReportByMonth = _.orderBy(_.map(result.listReportByMonth, (reportByMonth: ReportByMonth) => {
                        const reportByMonthItem = reportByMonth;
                        reportByMonthItem.totalOvertimeText = this.utilService.getHourTextFromMinute(reportByMonthItem.totalOvertime);
                        return reportByMonthItem;
                    }), ['userId'], ['asc']);

                    this.renderListReportByShift(result.listReportByShift);

                    setTimeout(() => {
                        this.showPrintModal();
                    }, 500);
                } else {
                    this.listReportByMonth = [];
                }
            });
    }

    private initDayInMonth() {
        const daysInMonth = moment(`1/${this.month}/${this.year}`, 'DD/MM/YYYY').daysInMonth();
        this.daysInMonth = [];
        for (let i = 1; i <= daysInMonth; i++) {
            this.daysInMonth = [...this.daysInMonth, {
                day: i,
                isSunday: moment(`${i}/${this.month}/${this.year}`, 'DD/MM/YYYY').days() === 0
            }];
        }
    }

    private initListMonth() {
        for (let i = 1; i <= 12; i++) {
            this.listMonth = [...this.listMonth, {id: i, name: `Tháng ${i}`}];
        }
    }

    private initListYear() {
        const currentYear = moment().year();
        for (let year = 2016; year < currentYear + 1; year++) {
            this.listYear.push({id: year, name: year});
        }
    }

    private getTreeData() {
        this.spinnerService.show();
        this.officeService.getTree()
            .pipe(finalize(() => this.spinnerService.hide()))
            .subscribe((result: any) => this.officeTree = result);
    }

    private initDefaultMonthAndYear() {
        this.month = moment().month() + 1;
        this.year = moment().year();
    }

    private getCheckInCheckOutHistory() {
        this.isLoadingHistory = true;
        this.timeSheetService.getCheckInCheckOutHistory(this.reportByShiftDetail.enrollNumber,
            this.reportByShiftDetail.day, this.reportByShiftDetail.month, this.reportByShiftDetail.year)
            .pipe(finalize(() => this.isLoadingHistory = false))
            .subscribe(result => {
                const shiftGroup = _.groupBy(result, (item: any) => {
                    return item.shiftId;
                });

                this.listCheckInCheckOutHistory = [];
                for (const key in shiftGroup) {
                    if (shiftGroup.hasOwnProperty(key)) {
                        const shift = shiftGroup[key];
                        const history = <CheckinCheckoutHistoryViewModel>{
                            shiftId: key,
                            shiftCode: shift[0].shiftCode,
                            checkInTimes: []
                        };

                        shift.forEach((item: any) => {
                            history.checkInTimes = [...history.checkInTimes, item.checkInTime];
                        });
                        history.checkInTimes = _.orderBy(history.checkInTimes, ['checkInTime'], ['asc']);

                        this.listCheckInCheckOutHistory = [...this.listCheckInCheckOutHistory, history];
                    }
                }

                this.listCheckInCheckOutHistory = _.orderBy(this.listCheckInCheckOutHistory, ['shiftId'], ['asc']);
            });
    }

    private renderMonthDetail(result: any) {
        this.listReportByMonthDetail = [];
        const groupDays = _.groupBy(result, (item: any) => {
            return item.day;
        });

        for (const key in groupDays) {
            if (groupDays.hasOwnProperty(key)) {
                const dayGroup = groupDays[key];
                const day = <ReportByMonthDetailViewModel>{
                    day: dayGroup[0].day,
                    isValidMeal: false,
                    dayDetail: []
                };

                let dayDetails = [];
                dayGroup.forEach((item) => {
                    dayDetails = [...dayDetails, <DayDetailViewModel>{
                        shiftId: item.shiftId,
                        shiftCode: item.shiftCode,
                        outLateMin: item.outLateMin,
                        inLateMin: item.inLateMin,
                        outSoonMin: item.outSoonMin,
                        inSoonMin: item.inSoonMin,
                        intTime: item.inTime,
                        outTime: item.outTime,
                        inDateTime: item.in,
                        outDateTime: item.out,
                        totalWorkingMin: item.totalWorkingMin,
                        statusName: this.getStatusName(item.status),
                        status: item.status,
                        totalHolidaysLeave: item.totalHolidaysLeave,
                        totalOvertimeMin: item.totalOvertimeMin
                        // totalMin: item.totalWorkingMin + (item.totalOvertimeMin ? item.totalOvertimeMin : 0)
                    }];
                });

                day.isValidMeal = _.sumBy(dayDetails, (item) => {
                    return item.totalWorkingMin + (item.totalOvertimeMin ? item.totalOvertimeMin : 0);
                }) > 270;
                day.dayDetail = _.orderBy(dayDetails, ['shiftId'], ['asc']);
                this.listReportByMonthDetail = [...this.listReportByMonthDetail, day];
            }
        }
    }

    private getStatusName(status: number) {
        switch (status) {
            case this.STATUS.ANNUAL_LEAVE:
                return 'Nghỉ phép';
            case this.STATUS.UNPAID_LEAVE:
                return 'Nghỉ không lương';
            case this.STATUS.INSURANCE_LEAVE:
                return 'Nghỉ bảo hiểm';
            case this.STATUS.COMPENSATORY_LEAVE:
                return 'Nghỉ bù';
            case this.STATUS.ENTITLEMENT_LEAVE:
                return 'Nghỉ chế độ';
            case this.STATUS.WEEK_LEAVE:
                return 'Nghỉ tuần';
            case this.STATUS.HOLIDAY_LEAVE:
                return 'Nghỉ lễ';
            default:
                return '';
        }
    }

    private getMyTimeSheet() {
        this.spinnerService.show();
        this.listMyTimeSheet$ = this.timeSheetService.getMyTimeSheet(this.month, this.year)
            .pipe(finalize(() => this.spinnerService.hide()),
                map(result => {
                    let listMyReportByShift: MyReportByShift[] = [];
                    const groupByMonth = _.groupBy(result, (item: any) => {
                        return item.month;
                    });
                    if (groupByMonth) {
                        for (const key in groupByMonth) {
                            if (groupByMonth.hasOwnProperty(key)) {
                                const groupByMonthItems = groupByMonth[key];
                                const firstItem = groupByMonthItems[0];
                                const myReportByShift = new MyReportByShift(firstItem.enrollNumber, firstItem.userId, firstItem.fullName,
                                    firstItem.month, firstItem.year, []);

                                const groupByShifts = _.groupBy(groupByMonthItems, (monthItem: any) => {
                                    return monthItem.shiftId;
                                });

                                if (groupByShifts) {
                                    for (const shiftKey in groupByShifts) {
                                        if (groupByShifts.hasOwnProperty(shiftKey)) {
                                            const shifts = groupByShifts[shiftKey];
                                            const shiftItem = new ReportByShiftShifts(shifts[0].shiftId, shifts[0].shiftCode,
                                                shifts[0].shiftReportName, []);

                                            this.daysInMonth.forEach((day) => {
                                                const workingDays = _.find(shifts, (item) => {
                                                    return day.day === item.day;
                                                });

                                                // Trường hợp có đi làm
                                                if (workingDays) {
                                                    const workingDay = new WorkingDays(workingDays.day,
                                                        workingDays.month,
                                                        workingDays.year,
                                                        workingDays.inTime,
                                                        workingDays.outTime,
                                                        workingDays.in,
                                                        workingDays.out,
                                                        workingDays.inSoonMin,
                                                        workingDays.outSoonMin,
                                                        workingDays.inLateMin,
                                                        workingDays.outLateMin,
                                                        workingDays.quarter,
                                                        workingDays.isValid,
                                                        workingDays.isValidWorkSchedule,
                                                        workingDays.isSunday,
                                                        workingDays.isHoliday,
                                                        workingDays.totalWorkingMin,
                                                        workingDays.totalOvertimeMin,
                                                        workingDays.workUnit,
                                                        workingDays.status);

                                                    workingDay.reason = workingDays.reason;
                                                    shiftItem.workingDays = [...shiftItem.workingDays, workingDay];
                                                } else {
                                                    const dayOff = new WorkingDays(day.day, this.month, this.year);
                                                    dayOff.status = -1;
                                                    dayOff.isSunday = day.isSunday;
                                                    dayOff.reason = day.reason;

                                                    shiftItem.workingDays = [...shiftItem.workingDays, dayOff];
                                                }
                                            });

                                            myReportByShift.shifts = [...myReportByShift.shifts, shiftItem];
                                        }
                                    }
                                }

                                listMyReportByShift = [...listMyReportByShift, myReportByShift];
                            }
                        }
                    }
                    return listMyReportByShift;
                }));
    }

    private getMyTimeSheetResult() {
        this.spinnerService.show();
        this.timeSheetService.getMyTimeSheetResult(this.month, this.year)
            .pipe(finalize(() => this.spinnerService.hide()))
            .subscribe((result: ReportByMonth[]) => {
                if (result && result.length > 0) {
                    this.listShifts = _.orderBy(result[0].reportShiftAggregates, ['shiftId'], ['asc']);
                    this.listReportByMonth = _.orderBy(result, ['userId'], ['asc']);
                } else {
                    this.listReportByMonth = [];
                }
            });
    }

    private showPrintModal() {
        const style = `
                        h4.timekeeping-title {
                            text-transform: uppercase;
                            font-weight: bold;
                            font-size: 25px;
                            margin-top: 10px;
                            text-align: center;
                        }
                    `;
        const tableReportByShiftContent = this.reportByShiftTableElement.nativeElement.innerHTML;
        const tableReportByMonthContent = this.reportByMonthTableElement.nativeElement.innerHTML;
        const currentDate = new Date();
        const content = `
                            <div class="print-page">
                                <header>
                                    <img src="${this.appConfig.CORE_API_URL}/assets/images/print/print-header.jpg" alt="">
                                </header>
                                <h4 class="timekeeping-title">
                                <!-- TODO: Check this -->
                                </h4>
                                <div class="wrapper-table">
                                    <table class="bordered">
                                        ${tableReportByShiftContent}
                                    </table>
                                    <div class="note">
                                        Ghi chú: Đi làm X; Nghỉ phép NP; Nghỉ lễ: NL; Nghỉ không lương: NKL; Nghỉ chế độ: NCĐ; Nghỉ BHXH: 
                                        NBH; Nghỉ tuần: NT; Nghỉ bù: NB
                                    </div>
                                </div>
                                <footer>
                                    <img src="${this.appConfig.CORE_API_URL}/assets/images/print/print-footer.jpg" alt="">
                                </footer>
                            </div>
                            <div class="page-break"></div>
                            <div class="print-page">
                                <header>
                                    <img src="${this.appConfig.CORE_API_URL}/assets/images/print/print-header.jpg" alt="">
                                </header>
                                <h4 class="timekeeping-title">
                                <!-- TODO: Check this -->
                                </h4>
                                <div class="wrapper-table">
                                        <table class="bordered">
                                            ${tableReportByMonthContent}
                                        </table>
                                    </div>
                                    <div  class="text-right"style="padding: 0 30px">
                                        <i>
                                            Hà nội, ngày ${currentDate.getDate()} tháng ${currentDate.getMonth() + 1} 
                                            năm ${currentDate.getFullYear()}
                                        </i>
                                    </div>
                                    <table class="w100pc" style="margin-top: 10px;">
                                        <tbody>
                                            <tr>
                                                <td class="center uppercase">Người lập bảng</td>
                                                <td class="center uppercase">PT bộ phận</td>
                                                <td class="center uppercase">Người kiểm tra</td>
                                            </tr>
                                            <tr>
                                                <td style="min-height: 100px; height: 100px;"></td>
                                                <td style="min-height: 100px; height: 100px;"></td>
                                                <td style="min-height: 100px; height: 100px;"></td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                             <tr>
                                                <td class="center">${this.currentUser ? this.currentUser.fullName : ''}</td>
                                                <td class="center"></td>
                                                <td class="center"></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                <footer>
                                    <img src="${this.appConfig.CORE_API_URL}/assets/images/print/print-footer.jpg" alt="">
                                </footer>
                            </div>
                        `;

        this.helperService.openPrintWindow(`Bảng công phòng ${this.officeName} tháng ${this.month} năm ${this.year}`, content, style);
    }

    private renderListReportByShift(result) {
        this.listReports = [];
        const groupByUsers = _.groupBy(result, (item: any) => {
            return item.userId;
        });

        for (const key in groupByUsers) {
            if (groupByUsers.hasOwnProperty(key)) {
                const items = groupByUsers[key];
                const firstItem = _.first(items);
                const reportItem = new ReportByShift(firstItem.enrollNumber, firstItem.userId, firstItem.fullName, []);
                const groupByShifts = _.groupBy(items, (item: any) => {
                    return item.shiftId;
                });

                for (const shiftKey in groupByShifts) {
                    if (groupByShifts.hasOwnProperty(shiftKey)) {
                        const shifts = groupByShifts[shiftKey];
                        const shiftItem = new ReportByShiftShifts(shifts[0].shiftId, shifts[0].shiftCode,
                            shifts[0].shiftReportName, []);

                        this.daysInMonth.forEach((day) => {
                            const workingDays = _.find(shifts, (item) => {
                                return day.day === item.day;
                            });

                            // Trường hợp có đi làm
                            if (workingDays) {
                                const workingDay = new WorkingDays(
                                    workingDays.day,
                                    workingDays.month,
                                    workingDays.year,
                                    workingDays.inTime,
                                    workingDays.outTime,
                                    workingDays.in,
                                    workingDays.out,
                                    workingDays.inSoonMin,
                                    workingDays.outSoonMin,
                                    workingDays.inLateMin,
                                    workingDays.outLateMin,
                                    workingDays.quarter,
                                    workingDays.isValid,
                                    workingDays.isValidWorkSchedule,
                                    workingDays.isSunday,
                                    workingDays.isHoliday,
                                    workingDays.totalWorkingMin,
                                    workingDays.totalOvertimeMin,
                                    workingDays.workUnit,
                                    workingDays.status,
                                    workingDays.inLatencyMin,
                                    workingDays.outLatencyMin,
                                    workingDays.inLatencyReason,
                                    workingDays.outLatencyReason);

                                workingDay.reason = workingDays.reason;
                                shiftItem.workingDays = [...shiftItem.workingDays, workingDay];
                            } else {
                                const dayOff = new WorkingDays(day.day, this.month, this.year);
                                dayOff.status = -1;
                                dayOff.isSunday = day.isSunday;
                                dayOff.reason = day.reason;

                                shiftItem.workingDays = [...shiftItem.workingDays, dayOff];
                            }
                        });

                        reportItem.shifts = [...reportItem.shifts, shiftItem];
                    }
                }

                this.listReports = [...this.listReports, reportItem];
            }
        }
    }
}
