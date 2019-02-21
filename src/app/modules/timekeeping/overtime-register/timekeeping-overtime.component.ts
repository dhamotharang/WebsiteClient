import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, finalize, share } from 'rxjs/operators';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import * as _ from 'lodash';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { TimekeepingOvertimeService } from './timekeeping-overtime.service';
import { NumberValidator } from '../../../validators/number.validator';
import { TimekeepingWorkScheduleService } from '../config/work-schedule/timekeeping-work-schedule.service';
import { NhModalComponent } from '../../../shareds/components/nh-modal/nh-modal.component';
import { OvertimeRegister } from './overtime-register.model';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { UtilService } from '../../../shareds/services/util.service';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { FilterLink } from '../../../shareds/models/filter-link.model';
import { BaseListComponent } from '../../../base-list.component';

@Component({
    selector: 'app-timekeeping-overtime-register',
    templateUrl: './timekeeping-overtime.component.html',
    providers: [TimekeepingOvertimeService, NumberValidator, TimekeepingWorkScheduleService,
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})

export class TimekeepingOvertimeComponent extends BaseListComponent<any> implements OnInit {
    @ViewChild('registerFormModal') registerFormModal: NhModalComponent;
    @ViewChild('detailModal') detailModal: NhModalComponent;
    listMonth = [];
    listYear = [];
    listShift$: Observable<any>;
    $listOvertimeRegisters: Observable<OvertimeRegister[]>;
    listType = [{id: 0, name: 'Đánh máy'},
        {id: 1, name: 'Làm thủ thuật'},
        {id: 2, name: 'Tăng cường'},
        {id: 3, name: 'Trực trưa'}];
    overtimeRegister = new OvertimeRegister();
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
                private overtimeService: TimekeepingOvertimeService,
                private numberValidator: NumberValidator,
                private workscheduleService: TimekeepingWorkScheduleService) {
        super();
        this.title.setTitle('Danh sách làm thêm giờ.');
        this.appService.setupPage(pageId.HR, pageId.TIMEKEEPING_OVERTIME, 'Chấm công', 'Danh sách làm thêm giờ.');
        // this.getPermission(this.appService);
        // this.currentUser = this.appService.currentUser;
        this.month = new Date().getMonth() + 1;
        this.year = new Date().getFullYear();
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
                    this.model.reset(new OvertimeRegister());
                    this.registerFormModal.open();
                });
            }
        });

        this.listShift$ = this.workscheduleService.getMyWorkScheduleShift()
            .pipe(map((result: any) => {
                return result;
            }), share());

        this.$listOvertimeRegisters = this.route.data
            .pipe(map((result: { data: any }) => {
                const overtimes = result.data;
                this.totalRows$ = new Observable(o => o.next(overtimes.totalRows));
                return overtimes.items.map((item) => {
                    item.statusText = this.getStatusText(item.status);
                    const totalHour = Math.floor(item.totalMinutes / 60);
                    const totalMinutes = item.totalMinutes % 60;
                    item.totalMinutesText = `${totalHour}:${totalMinutes}`;
                    return item;
                });
            }));

        this.builForm();

        this.utilService.initListMonth().forEach((month: number) => {
            this.listMonth = [...this.listMonth, {id: month, name: `Tháng ${month}`}];
        });

        this.utilService.initListYear().forEach((year: number) => {
            this.listYear = [...this.listYear, {id: year, name: `năm ${year}`}];
        });
    }

    onDetailModalHidden() {
        if (this.research) {
            this.search(this.currentPage);
        }
    }

    getDetail(id: string) {
        setTimeout(() => {
            this.isGettingDetail = true;
            this.detailModal.open();
            this.overtimeService.getDetail(id)
                .pipe(finalize(() => this.isGettingDetail = false))
                .subscribe((overTimeRegister: OvertimeRegister) => {
                    this.overtimeRegister = overTimeRegister;
                    this.overtimeRegister.statusText = this.getStatusText(overTimeRegister.status);
                    this.overtimeRegister.totalMinutesText = this.calculateHour(overTimeRegister.totalMinutes);
                    this.overtimeRegister.typeText = this.getTypeText(overTimeRegister.type);
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

        this.$listOvertimeRegisters = this.overtimeService.search(this.userId, this.month, this.year, this.type, this.status,
            this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((result: ISearchResult<OvertimeRegister>) => {
                    this.totalRows$ = new Observable(o => o.next(result.totalRows));
                    return result.items.map((item) => {
                        item.statusText = this.getStatusText(item.status);
                        const totalHour = Math.floor(item.totalMinutes / 60);
                        const totalMinutes = item.totalMinutes % 60;
                        item.totalMinutesText = `${totalHour}:${totalMinutes}`;
                        return item;
                    });
                }));
    }

    showRegisterModal() {
        // this.isUpdate = false;
        this.model.reset(new OvertimeRegister());
        this.registerFormModal.open();
    }

    edit(overtimeRegister: OvertimeRegister) {
        // this.isUpdate = true;
        this.model.patchValue(overtimeRegister);
        this.registerFormModal.open();
    }

    detail(overtimeRegister: OvertimeRegister) {
        this.overtimeRegister = overtimeRegister;
        this.overtimeRegister.statusText = this.getStatusText(this.overtimeRegister.status);
        this.overtimeRegister.totalMinutesText = this.calculateHour(this.overtimeRegister.totalMinutes);
        this.overtimeRegister.typeText = this.getTypeText(this.overtimeRegister.type);
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
        //         this.overtimeService.delete(overtimeRegister.id)
        //             .finally(() => this.isSearching = false)
        //             .subscribe(() => {
        //                 this.search(1);
        //             });
        //     }
        // }, () => {
        // });
    }

    approve(overtimeRegister: OvertimeRegister, isApprove: boolean, fromDetailModal?: boolean) {
        this.research = fromDetailModal;
        // if (!isApprove) {
        //     swal({
        //         title: ``,
        //         text: `Bạn có chắc chắn muốn không duyệt cho đơn đăng ký làm thêm giờ của: "${overtimeRegister.fullName}"`,
        //         type: 'warning',
        //         showCancelButton: true,
        //         confirmButtonColor: '#DD6B55',
        //         confirmButtonText: 'Đồng ý',
        //         cancelButtonText: 'Hủy bỏ'
        //     }).then((isConfirm: boolean) => {
        //         if (isConfirm) {
        //             swal({
        //                 input: 'textarea',
        //                 inputPlaceholder: 'Vui lòng nhập lý do không duyệt!',
        //                 showCancelButton: true
        //             }).then((text) => {
        //                 if (text) {
        //                     this.updateApproveStatus(overtimeRegister, isApprove, text);
        //                 }
        //             });
        //         }
        //     }, () => {
        //     });
        // } else {
        //     this.updateApproveStatus(overtimeRegister, isApprove);
        // }
    }

    save() {
        this.overtimeRegister = this.model.value;
        // const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        // if (isValid) {
        //     if (this.totalMinutes === '') {
        //         this.toastr.error('Giá trị thời gian "từ" không được phép lớn hơn giá trị thời gian "đến".');
        //         return;
        //     }
        //
        //     this.overtimeRegister = this.model.value;
        //     // this.isSaving = true;
        //
        //     // if (this.isUpdate) {
        //     //     this.subscribers.update = this.overtimeService.update(this.overtimeRegister)
        //     //         .pipe(finalize(() => this.isSaving = false))
        //     //         .subscribe((result: IResponseResult) => {
        //     //             this.toastr.success(result.message, result.title);
        //     //             this.registerFormModal.dismiss();
        //     //             this.search(this.currentPage);
        //     //         });
        //     // } else {
        //     //     this.subscribers.insert = this.overtimeService.insert(this.overtimeRegister)
        //     //         .pipe(finalize(() => this.isSaving = false))
        //     //         .subscribe((result: IResponseResult) => {
        //     //             this.toastr.success(result.message, result.title);
        //     //             this.model.reset();
        //     //             this.search(this.currentPage);
        //     //         });
        //     // }
        // }
    }

    changeType(type: number) {
        this.type = type;
        this.search(1);
    }

    private updateApproveStatus(overtimeRegister: OvertimeRegister, isApprove: boolean, note?: string) {
        this.overtimeService.approve(overtimeRegister.id, isApprove, note)
            .subscribe(() => {
                this.toastr.success(isApprove ? 'Duyệt đăng ký làm thêm giờ thành công.' : 'Không duyệt đăng ký làm thêm giờ thành công.');
                overtimeRegister.status = isApprove ? this.STATUS.MANAGER_APPROVE : this.STATUS.MANAGER_DECLINE;
                overtimeRegister.statusText = this.getStatusText(overtimeRegister.status);
                overtimeRegister.declineReason = note;
            });
    }

    private builForm() {
        this.renderFormValidation();
        this.model = this.fb.group({
            'id': [this.overtimeRegister.id],
            'userId': [this.overtimeRegister.userId],
            'registerDate': [this.overtimeRegister.registerDate, [
                Validators.required
            ]],
            'shiftId': [this.overtimeRegister.shiftId, [
                Validators.required
            ]],
            'from': this.fb.group({
                'hour': [this.overtimeRegister.from.hour, [
                    Validators.required,
                    this.numberValidator.isValid,
                    this.numberValidator.range({fromValue: 0, toValue: 23})
                ]],
                'minute': [this.overtimeRegister.from.minute, [
                    Validators.required,
                    this.numberValidator.isValid,
                    this.numberValidator.range({fromValue: 0, toValue: 59})
                ]]
            }),
            'to': this.fb.group({
                'hour': [this.overtimeRegister.to.hour, [
                    Validators.required,
                    this.numberValidator.isValid,
                    this.numberValidator.range({fromValue: 0, toValue: 23})
                ]],
                'minute': [this.overtimeRegister.to.minute, [
                    Validators.required,
                    this.numberValidator.isValid,
                    this.numberValidator.range({fromValue: 0, toValue: 59})
                ]]
            }),
            'totalMinutes': [this.overtimeRegister.totalMinutes, [
                Validators.required
            ]],
            'type': [this.overtimeRegister.type, [
                Validators.required
            ]],
            'note': [this.overtimeRegister.note, [
                Validators.maxLength(500)
            ]]
        });

        this.model.valueChanges.subscribe(values => {
            // this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages);
            const from = values.from;
            const to = values.to;
            if (from.hour && from.minute && to.hour && to.minute) {
                const totalFromMinute = parseInt(from.hour) * 60 + parseInt(from.minute);
                const totalToMinute = parseInt(to.hour) * 60 + parseInt(to.minute);
                const totalMin = totalToMinute - totalFromMinute;
                this.totalMinutes = !isNaN(totalMin) && totalMin > 0 ? this.calculateHour(totalMin) : '';
            }
        });
    }

    private renderFormValidation() {
        // this.formErrors = {
        //     'shiftId': '',
        //     'registerDate': '',
        //     'note': '',
        //     'type': '',
        //     'from': this.utilService.renderFormError(['hour', 'minute']),
        //     'to': this.utilService.renderFormError(['hour', 'minute'])
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
        //         'maxLength': 'Ghi chú không được phép vượt quá 500 ký tự.'
        //     },
        //     'type': {
        //         'required': 'Vui lòng chọn hình thức xin nghỉ.'
        //     },
        //     'from': {
        //         'hour': {
        //             'required': 'Vui lòng nhập giờ bắt đầu làm thêm.',
        //             'isValid': 'Giờ xin nghỉ phải là số bắt đầu làm thêm.',
        //             'invalidRange': 'Giờ bắt đầu làm thêm phải từ 0 đến 23 giờ.'
        //         },
        //         'minute': {
        //             'required': 'Vui lòng nhập phút bắt đầu làm thêm giờ.',
        //             'isValid': 'Phút bắt đầu làm thêm giờ phải là số.',
        //             'invalidRange': 'Phút bắt làm thêm giờ phải từ 0 đến 59 phút.'
        //         }
        //     },
        //     'to': {
        //         'hour': {
        //             'required': 'Vui lòng nhập giờ kết thúc làm thêm giờ.',
        //             'isValid': 'Giờ kết thúc làm thêm giờ phải là số.',
        //             'invalidRange': 'Giờ kết thúc làm thêm giờ phải từ 0 đến 23 giờ.'
        //         },
        //         'minute': {
        //             'required': 'Vui lòng nhập số phút kết thúc làm thêm giờ.',
        //             'isValid': 'Phút kết thúc làm thêm giờ phải là số.',
        //             'invalidRange': 'Phút làm thêm giờ phải từ 0 đến 59 phút.'
        //         }
        //     }
        // };
    }

    private renderFilterLink() {
        const path = '/timekeeping/overtime';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('type', this.type),
            new FilterLink('month', this.month),
            new FilterLink('year', this.year),
            new FilterLink('userId', this.userId),
            new FilterLink('status', this.status)
        ]);

        this.location.go(path, query);
    }

    private calculateHour(minutes: number): string {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
    }

    private getStatusText(status: number) {
        return status === this.STATUS.WAITING_MANAGER_APPROVE ? 'Chờ QLTT duyệt'
            : status === this.STATUS.MANAGER_APPROVE ? 'QLTT đã duyệt'
                : status === this.STATUS.MANAGER_DECLINE ? 'QLTT không duyệt' : '';
    }

    private getTypeText(type: number) {
        return _.find(this.listType, (item) => {
            return item.id === type;
        }).name;
    }
}
