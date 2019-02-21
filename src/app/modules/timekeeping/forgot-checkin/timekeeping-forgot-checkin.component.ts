import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { DestroySubscribers } from '../../../shareds/decorator/destroy-subscribes.decorator';
import { TimekeepingForgotCheckinService } from './timekeeping-forgot-checkin.service';
import { TimekeepingWorkScheduleService } from '../config/work-schedule/timekeeping-work-schedule.service';
import { NhModalComponent } from '../../../shareds/components/nh-modal/nh-modal.component';
import { ForgotCheckIn } from './forgot-checkin.model';
import { FilterLink } from '../../../shareds/models/filter-link.model';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { UtilService } from '../../../shareds/services/util.service';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { OvertimeRegister } from '../overtime-register/overtime-register.model';
import { map, finalize } from 'rxjs/operators';
import { CheckPermission } from '../../../shareds/decorator/check-permission.decorator';
import { BaseListComponent } from '../../../base-list.component';

@Component({
    selector: 'app-timekeeping-forgot-checkin',
    templateUrl: './timekeeping-forgot-checkin.component.html',
    providers: [TimekeepingForgotCheckinService, TimekeepingWorkScheduleService,
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})

export class TimekeepingForgotCheckinComponent extends BaseListComponent<any> implements OnInit {
    @ViewChild('registerFormModal') registerFormModal: NhModalComponent;
    @ViewChild('detailModal') detailModal: NhModalComponent;
    listMonth = [];
    listYear = [];
    listShift$: Observable<any>;
    listForgotCheckIn$: Observable<ForgotCheckIn[]>;
    listType = [{id: 0, name: 'Đánh máy'},
        {id: 1, name: 'Làm thủ thuật'},
        {id: 2, name: 'Tăng cường'},
        {id: 3, name: 'Trực trưa'}];
    forgotCheckIn = new ForgotCheckIn();
    model: FormGroup;
    month: number;
    year: number;
    type = 0;
    userId: string;
    status: number;
    totalMinutes;
    isGettingDetail = false;
    research = false;

    STATUS = {
        WAITING_MANAGER_APPROVE: 0,
        MANAGER_APPROVE: 1,
        MANAGER_DECLINE: 2
    };

    constructor(@Inject(PAGE_ID) pageId: IPageId,
                private location: Location,
                private title: Title,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private forgotCheckInService: TimekeepingForgotCheckinService,
                private workscheduleService: TimekeepingWorkScheduleService) {
        super();
        this.title.setTitle('Danh sách quên chấm công.');
        this.appService.setupPage(pageId.HR, pageId.TIMEKEEPING_FORGOT_CHECK_IN, 'Chấm công', 'Danh sách quên chấm công.');
        // this.getPermission(this.appService);
        // this.currentUser = this.appService.currentUser;
    }

    ngOnInit() {
        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            if (params.type) {
                setTimeout(() => {
                    this.type = parseInt(params.type);
                }, 500);
            }

            if (params.id) {
                this.getDetail(params.id);
            }

            if (params.showRegister) {
                setTimeout(() => {
                    // this.isUpdate = false;
                    this.registerFormModal.open();
                }, 100);
            }

            if (params.month) {
                this.month = parseInt(params.month);
            } else {
                this.month = new Date().getMonth() + 1;
            }

            if (params.year) {
                this.year = parseInt(params.year);
            } else {
                this.year = new Date().getFullYear();
            }
        });

        this.listShift$ = this.workscheduleService.getMyWorkScheduleShift()
            .pipe(map((result: any) => {
                return result;
            }));

        this.listForgotCheckIn$ = this.route.data
            .pipe(map((result: { data: any }) => {
                const overtimes = result.data;
                this.totalRows$ = new Observable(o => o.next(overtimes.totalRows));
                return overtimes.items.map((item) => {
                    item.statusText = this.getStatusText(item.status);
                    return item;
                });
            }));

        this.builForm();

        this.utilService.initListMonth().forEach((month: number) => {
            this.listMonth = [...this.listMonth, {id: month, name: `Tháng ${month}`}];
        });

        this.utilService.initListYear().forEach((year: number) => {
            this.listYear = [...this.listYear, {id: year, name: `Năm ${year}`}];
        });
    }

    getDetail(id: string) {
        setTimeout(() => {
            this.isGettingDetail = true;
            this.detailModal.open();
            this.forgotCheckInService.getDetail(id)
                .pipe(finalize(() => this.isGettingDetail = false))
                .subscribe((forgotCheckIn: ForgotCheckIn) => {
                    this.forgotCheckIn = forgotCheckIn;
                    this.forgotCheckIn.statusText = this.getStatusText(forgotCheckIn.status);
                });
        }, 500);
    }

    onSelectMonth(month) {
        this.month = month.id;
        this.search(1);
    }

    onSelectYear(year) {
        this.year = year.id;
        this.search(1);
    }

    onSelectStatus(status) {
        this.status = status.id;
        this.search(1);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();

        this.listForgotCheckIn$ = this.forgotCheckInService
            .search(this.month, this.year, this.type, this.userId, this.status, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((result: ISearchResult<ForgotCheckIn>) => {
                    this.totalRows$ = new Observable(o => o.next(result.totalRows));
                    return result.items.map((item) => {
                        item.statusText = this.getStatusText(item.status);
                        return item;
                    });
                }));
    }

    showRegisterModal() {
        // this.isUpdate = false;
        this.registerFormModal.open();
    }

    edit(overtimeRegister: ForgotCheckIn) {
        // this.isUpdate = true;
        this.model.patchValue(overtimeRegister);
        this.registerFormModal.open();
    }

    detail(overtimeRegister: ForgotCheckIn) {
        this.forgotCheckIn = overtimeRegister;
        this.forgotCheckIn.statusText = this.getStatusText(this.forgotCheckIn.status);
        this.detailModal.open();
    }

    delete(overtimeRegister: OvertimeRegister) {
        // swal({
        //     title: ``,
        //     text: `Bạn có chắc chắn muốn xóa đơn đăng ký làm thêm giờ này?`,
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then((isConfirm: boolean) => {
        //     if (isConfirm) {
        //         this.forgotCheckInService.delete(overtimeRegister.id)
        //             .finally(() => this.isSearching = false)
        //             .subscribe(() => {
        //                 this.search(1);
        //             });
        //     }
        // }, () => {
        // });
    }

    approve(forgotCheckIn: ForgotCheckIn, isApprove: boolean, fromDetailModal?: boolean) {
        this.research = fromDetailModal;
        if (!isApprove) {
            // swal({
            //     title: ``,
            //     text: `Bạn có chắc chắn muốn không duyệt cho đơn đăng ký làm thêm giờ của: "${forgotCheckIn.fullName}"`,
            //     type: 'warning',
            //     showCancelButton: true,
            //     confirmButtonColor: '#DD6B55',
            //     confirmButtonText: 'Đồng ý',
            //     cancelButtonText: 'Hủy bỏ'
            // }).then((isConfirm: boolean) => {
            //     if (isConfirm) {
            //         swal({
            //             input: 'textarea',
            //             inputPlaceholder: 'Vui lòng nhập lý do không duyệt!',
            //             showCancelButton: true,
            //             confirmButtonColor: '#DD6B55',
            //             confirmButtonText: 'Gửi',
            //             cancelButtonText: 'Hủy bỏ'
            //         }).then((text) => {
            //             if (text) {
            //                 this.updateApproveStatus(forgotCheckIn, isApprove, text);
            //             }
            //         });
            //     }
            // }, () => {
            // });
        } else {
            this.updateApproveStatus(forgotCheckIn, isApprove);
        }
    }

    save() {
        this.forgotCheckIn = this.model.value;
        // const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        // if (isValid) {
        //     if (this.totalMinutes === '') {
        //         this.toastr.error('Giá trị thời gian "từ" không được phép lớn hơn giá trị thời gian "đến".');
        //         return;
        //     }
        //
        //     this.forgotCheckIn = this.model.value;
        //     this.isSaving = true;
        //
        //     if (this.isUpdate) {
        //         this.subscribers.update = this.forgotCheckInService.update(this.forgotCheckIn)
        //             .pipe(finalize(() => this.isSaving = false))
        //             .subscribe((result: IResponseResult) => {
        //                 this.toastr.success(result.message, result.title);
        //                 this.registerFormModal.dismiss();
        //                 this.search(this.currentPage);
        //             });
        //     } else {
        //         this.subscribers.insert = this.forgotCheckInService.insert(this.forgotCheckIn)
        //             .pipe(finalize(() => this.isSaving = false))
        //             .subscribe((result: IResponseResult) => {
        //                 this.toastr.success(result.message, result.title);
        //                 this.model.reset();
        //                 this.search(this.currentPage);
        //             });
        //     }
        // }
    }

    changeType(type: number) {
        this.type = type;
        this.search(1);
    }

    private updateApproveStatus(forgotCheckIn: ForgotCheckIn, isApprove: boolean, note?: string) {
        this.forgotCheckInService.approve(forgotCheckIn.id, isApprove, note)
            .subscribe(() => {
                this.toastr.success(isApprove ? 'Duyệt đăng ký làm thêm giờ thành công.' : 'Không duyệt đăng ký làm thêm giờ thành công.');
                forgotCheckIn.status = isApprove ? this.STATUS.MANAGER_APPROVE : this.STATUS.MANAGER_DECLINE;
                forgotCheckIn.statusText = this.getStatusText(forgotCheckIn.status);
                forgotCheckIn.declineReason = note;
            });
    }

    private builForm() {
        // this.renderFormValidation();
        // this.model = this.fb.group({
        //     'id': [this.forgotCheckIn.id],
        //     'userId': [this.forgotCheckIn.userId],
        //     'registerDate': [this.forgotCheckIn.registerDate, [
        //         Validators.required
        //     ]],
        //     'shiftId': [this.forgotCheckIn.shiftId, [
        //         Validators.required
        //     ]],
        //     'note': [this.forgotCheckIn.note, [
        //         Validators.maxLength(500)
        //     ]],
        //     'isCheckIn': [this.forgotCheckIn.isCheckIn]
        // });
        //
        // this.model.valueChanges.subscribe(values =>
        // this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private renderFormValidation() {
        // this.formErrors = {
        //     'shiftId': '',
        //     'registerDate': '',
        //     'note': '',
        //     'isCheckIn': ''
        // };
        //
        // this.validationMessages = {
        //     'shiftId': {
        //         'required': 'Vui lòng chọn ca làm việc.'
        //     },
        //     'registerDate': {
        //         'required': 'Vui lòng chọn ngày làm thêm.'
        //     },
        //     'note': {
        //         'maxLength': 'Ghi chú không được phép vượt quá 500 ký tự'
        //     },
        //     'isCheckIn': {
        //         'required': 'Vui lòng chọn hình thức.'
        //     }
        // };
    }

    private renderFilterLink() {
        const path = '/timekeeping/forgot-checkin';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('type', this.type),
            new FilterLink('month', this.month),
            new FilterLink('year', this.year),
            new FilterLink('userId', this.userId),
            new FilterLink('status', this.status)
        ]);

        this.location.go(path, query);
    }

    private getStatusText(status: number) {
        return status === this.STATUS.WAITING_MANAGER_APPROVE ? 'Chờ QLTT duyệt'
            : status === this.STATUS.MANAGER_APPROVE ? 'QLTT đã duyệt'
                : status === this.STATUS.MANAGER_DECLINE ? 'QLTT không duyệt' : '';
    }
}
